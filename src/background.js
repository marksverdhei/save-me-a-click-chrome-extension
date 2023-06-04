const Article = require("newspaperjs").Article;
const LanguageDetect = require("languagedetect");
const languageDetector = new LanguageDetect();

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
        "Given the title and the body of a clickbait article, please provide the information that one might desire upon reading the title. Make the answer as brief as you can.\n" +
        "If there is no information in the article content that answers the title, provide your answer as 'The article doesn't say'",
    },
  ],
  // Options to enter other languages here
};

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
  if (
    !data ||
    !data.choices ||
    !data.choices[0] ||
    !data.choices[0].message ||
    !data.choices[0].message.content
  ) {
    return "Data missing";
  } else {
    return data.choices[0].message.content;
  }
}

/**
 *
 * @param {str} url url address of the clickbait article or web page
 * @returns {object} summary of the given clickbait content
 */
async function getSummary(url) {
  const article = await Article(url);
  const title = article.title;
  const body = article.text;

  if (!(title && body)) throw new Error("missing article title or text");

  const languages = languageDetector.detect(title + body, 1);
  console.log(languages);
  const language = languages[0][0];
  console.log(language);

  if (language in PROMPTS) {
    prePrompt = PROMPTS[language];
  } else {
    prePrompt = getMissingLanguagePrompt(language);
  }

  fullPrompt = prePrompt.concat([
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

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: fullPrompt,
        temperature: 0.7,
      }),
    });

    console.log(response);

    if (!response.ok) {
      throw new Error("OpenAI request failed");
    }

    const data = await response.json();
    result.answer = getDataContent(data);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
