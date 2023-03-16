let lastRightClickPosition = { x: 0, y: 0 };

document.addEventListener("contextmenu", (event) => {
  lastRightClickPosition.x = event.pageX;
  lastRightClickPosition.y = event.pageY;
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const { url } = request;

  try {
    chrome.runtime.sendMessage(
      { type: "fetchSummary", url: url },
      (response) => {
        const { title, body, summary } = response;
        displayOverlay(
          title,
          body,
          summary,
          lastRightClickPosition.x,
          lastRightClickPosition.y
        );
      }
    );
  } catch (error) {
    displayOverlay("Error", "", error.message);
  }
});

function displayOverlay(title, body, summary, x, y) {
  // Create the overlay elements
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.style.left = `${x}px`;
  overlay.style.top = `${y}px`;

  const overlayBox = document.createElement("div");
  overlayBox.className = "overlay-box";

  const titleEl = document.createElement("h2");
  titleEl.textContent = title;

  const bodyEl = document.createElement("p");
  bodyEl.textContent = `Body: ${body}`;

  const summaryEl = document.createElement("p");
  summaryEl.textContent = `Summary: ${summary}`;

  // Assemble the elements
  overlayBox.appendChild(titleEl);
  overlayBox.appendChild(bodyEl);
  overlayBox.appendChild(summaryEl);
  overlay.appendChild(overlayBox);
  document.body.appendChild(overlay);

  // Event listener to close the overlay when clicked outside
  document.addEventListener("click", function closeOverlay(event) {
    if (!overlay.contains(event.target)) {
      overlay.remove();
      document.removeEventListener("click", closeOverlay);
    }
  });
}
