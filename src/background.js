import { parseTrackingLink } from "./parse";

const Article = require("newspaperjs").Article;
const LanguageDetect = require("languagedetect");
const languageDetector = new LanguageDetect();

const MODEL = "gpt-3.5-turbo";

const PROMPTS = {
  english: [
    {
      role: "system",
      content:
        "You are a tool that generates saved-you-a-click summaries when provided clickbait titles and content",
    },
    {
      role: "user",
      content:
        "Your task is the following: Given the title and the body of a clickbait article, provide the information that one would desire or wonder about upon reading the title.\n" +
        "* Be exact, on point and provide your answer as a repsonse to the title, and make your answers brief, preferrably in one sentence.\n" +
        "  Example: Costco shoppers shifting away from specific item; CFO says it’s indicator of recession | Beef and steaks.\n" +
        "* If the article is a list of N items, simply list each item and nothing else.\n" +
        "  Example: 5 Fast-Food Chains That Have Gone From the Best to the Bottom In a Few Years | Burgerim, Quiznos, Boston Market, Red Barn, Burger Chef\n" +
        "* If there is not sufficient information in the article body to answer the title, state so in the answer.\n" +
        "  Example: Why Big Tech execs are swapping the boardroom for the dojo | Article doesn't say\n\n",
    },
  ],
  // Options to enter other languages here
};

function isValidOpenAIAPIKey(apiKey) {
  // Regular expression for OpenAI API key pattern
  const pattern = /^(sk|ek)-\w+$/;

  // Check if apiKey matches the pattern
  return pattern.test(apiKey);
}

function getMissingLanguagePrompt(language) {
  return [
    {
      role: "system",
      content: `You are a tool that generates saved-you-a-click summaries when provided clickbait titles and content written in ${language}`,
    },
    {
      role: "user",
      content:
        "Given the title and the body of a clickbait article, please provide the information that one might desire upon reading the title. Make the answer as brief as you can.\n" +
        `If there is no information in the article content that answers the title, provide your answer as 'The article doesn't say' in ${language}. Write your response in ${language}`,
    },
  ];
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveMeAClick",
    title: "Save me a click",
    contexts: ["link"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "saveMeAClick") {
    console.log("Sending saveMeAClick to content.js");
    chrome.tabs.sendMessage(tab.id, { url: info.linkUrl });
  }
});

chrome.runtime.onMessage.addListener(async (message, sender) => {
  if (message.type === "startSpinner") {
    chrome.tabs.sendMessage(sender.tab.id, {
      startSpinner: true,
      url: message.url,
    });
  }
  if (message.type === "fetchSummary") {
    console.log("Received fetchSummary from content.js. Sending spinnner");
    // Send the message to start the spinner

    try {
      const summary = await getSummary(message.url);
      console.log("Summary received, sending to content.js");
      chrome.tabs.sendMessage(sender.tab.id, {
        summary: summary,
        overlayId: message.overlayId,
      });
    } catch (error) {
      console.log("There was an error, sending to content.js");
      console.log(error.name);
      console.log(error.message);
      console.log(error.stack);
      chrome.tabs.sendMessage(sender.tab.id, {
        error: error.message,
        overlayId: message.overlayId,
      });
    }
  }
});

function getApiKey() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(["apiKey"], function (result) {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(result.apiKey);
    });
  });
}

function getDataContent(data) {
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw Error("There was an error getting the ChatGPT response.");
  }
  return content;
}

/**
 *
 * @param {str} url url address of the clickbait article or web page
 * @returns {object} summary of the given clickbait content
 */
async function getSummary(url) {
  url = parseTrackingLink(url);

  const article = await Article(url);
  const title = article.title;
  const body = article.text;

  if (!(title && body)) throw new Error("missing article title or text");

  const languages = languageDetector.detect(title + body, 1);
  const language = languages[0][0];
  console.log(`Detected language: ${language}`);

  let prePrompt;
  if (language in PROMPTS) {
    prePrompt = PROMPTS[language];
  } else {
    prePrompt = getMissingLanguagePrompt(language);
  }

  const fullPrompt = prePrompt.concat([
    { role: "user", content: `<article-title>${title}</article-title>` },
    { role: "user", content: `<article-body>${body}</article-body>` },
  ]);
  console.log(fullPrompt);

  let result = {
    title: title,
    body: body,
    answer: "<summary placeholder> " + title,
  };
  console.log(result);

  const apiKey = await getApiKey();

  if (!apiKey) {
    throw Error(
      "OpenAI API key not set! Follow the steps in the github readme on how to get an API key"
    );
  } else if (!isValidOpenAIAPIKey(apiKey)) {
    throw Error(
      "Invalid OpenAI API key. The API key should start with 'sk-' or 'ek-'"
    );
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: fullPrompt,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data?.error;
      const errorCode = error?.code;

      if (errorCode === "invalid_api_key") {
        throw new Error(`OpenAI request failed: Invalid API key`);
      } else if (error) {
        throw new Error(`OpenAI request failed:\n${JSON.stringify(error)}`);
      } else {
        throw new Error(
          `OpenAI request failed. Status code: ${response.status}`
        );
      }
    }

    result.answer = getDataContent(data);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
