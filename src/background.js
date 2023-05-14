const Article = require("newspaperjs").Article
const PROMPTS = {
  "en": [
      {
          "role": "system",
          "content": "You are a tool that generates saved-you-a-click summaries when provided clickbait titles and content",
      },
      {
          "role": "user",
          "content": "Given the title and the body of a clickbait article, please provide the information that one might desire upon reading the title. Make the answer as brief as you can.\n" +
          "If there is no information in the article content that answers the title, provide your answer as 'The article doesn't say'",
      },
  ],
  "en_yt": [
      {
          "role": "system",
          "content": "You are a tool that generates saved-you-a-click summaries when provided clickbait titles and video transcritps",
      },
      {
          "role": "user",
          "content": "Given the title of a clickbait youtube video, and the transcript of the video. Provide the information that one might desire upon reading the title. Make the answer as brief as you can.\n" +
          "If there is no information in the transcript content that answers the title, provide your answer as a brief statement about the information not being present in the video.\n"
      },
  ],
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
    console.log("Sending saveMeAClick to content.js")
    chrome.tabs.sendMessage(tab.id, { url: info.linkUrl });
  }
});

chrome.runtime.onMessage.addListener(async (message, sender) => {
  if (message.type === "startSpinner") {
    chrome.tabs.sendMessage(sender.tab.id, { startSpinner: true, url: message.url });
  }
  if (message.type === "fetchSummary") {
    console.log("Received fetchSummary from content.js. Sending spinnner")
    // Send the message to start the spinner

    try {
      const summary = await getSummary(message.url);
      console.log(summary)
      console.log("Summary received, sending to content.js")
      chrome.tabs.sendMessage(sender.tab.id, { summary: summary, overlayId: message.overlayId });
    } catch (error) {
      console.log("There was an error, sending to content.js")

      chrome.tabs.sendMessage(sender.tab.id, { error: error.message, overlayId: message.overlayId });
    }
  }
});


/**
 * 
 * @param {str} url url address of the clickbait article or web page
 * @returns {object} summary of the given clickbait content
 */
async function getSummary(url) {
  const article = await Article(url);
  
  if (!(article.title && article.text)) throw new Error("missing article title or text");
  pre_prompt = PROMPTS["EN"]
  full_prompt = pre_prompt.extend([
    {"role": "user", "content": `<article-title>${title}</article-title>`},
    {"role": "user", "content": `<article-body>${body}</article-body>`},
  ])
  console.log(full_prompt)
  
  return article.title
  // const response = await fetch("http://localhost:8000", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({ url: url }),
  // });

  // return await response.json();
  // TODO: replace with actual api once hosted

  // console.log("response received")
  // console.log(response)

  // if (!response.ok) {
  //   throw new Error("Failed to fetch summary");
  // }

}