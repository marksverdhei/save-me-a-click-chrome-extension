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



async function getSummary(url) {
  // TODO: replace with actual api once hosted
  const response = await fetch("http://localhost:8000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: url }),
  });

  console.log("response received")
  console.log(response)

  if (!response.ok) {
    throw new Error("Failed to fetch summary");
  }

  return await response.json();
}