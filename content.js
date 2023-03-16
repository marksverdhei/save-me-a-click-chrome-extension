chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    const { url } = request;
  
    try {
      chrome.runtime.sendMessage(
        { type: "fetchSummary", url: url },
        (response) => {
          const { title, body, summary } = response;
          displayOverlay(title, body, summary);
        }
      );
    } catch (error) {
      displayOverlay("Error", "", error.message);
    }
  });
  
  function displayOverlay(title, body, summary) {
    // Create the overlay elements
    const overlay = document.createElement("div");
    overlay.className = "overlay";
  
    const overlayBox = document.createElement("div");
    overlayBox.className = "overlay-box";
  
    const titleEl = document.createElement("h2");
    titleEl.textContent = title;
  
    const bodyEl = document.createElement("p");
    bodyEl.textContent = `Body: ${body}`;
  
    const summaryEl = document.createElement("p");
    summaryEl.textContent = `Summary: ${summary}`;
  
    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.onclick = () => {
      overlay.remove();
    };
  
    // Assemble the elements
    overlayBox.appendChild(titleEl);
    overlayBox.appendChild(bodyEl);
    overlayBox.appendChild(summaryEl);
    overlayBox.appendChild(closeButton);
    overlay.appendChild(overlayBox);
    document.body.appendChild(overlay);
  }
  