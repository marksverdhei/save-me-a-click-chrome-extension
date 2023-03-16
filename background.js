chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "saveMeAClick",
      title: "Save me a click",
      contexts: ["link"],
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "saveMeAClick") {
      chrome.tabs.sendMessage(tab.id, { url: info.linkUrl });
    }
  });
  
  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type === "fetchSummary") {
      const summary = getDummySummary();
      sendResponse(summary);
      return true; // Keep the message channel open for asynchronous sendResponse
    }
  });
  
  function getDummySummary() {
    return {
      title: "foo",
      body: "bar",
      summary: "baz",
    };
  }
  