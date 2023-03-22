let lastRightClickPosition = { x: 0, y: 0 };

document.addEventListener("contextmenu", (event) => {
  lastRightClickPosition.x = event.pageX;
  lastRightClickPosition.y = event.pageY;
});

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.startSpinner) {
    const overlay = displayOverlay("Loading...", "", "", lastRightClickPosition.x, lastRightClickPosition.y);
    chrome.runtime.sendMessage({ url: message.url, type: "fetchSummary", overlayId: overlay.id })

  } else if (message.summary) {
    const { title, body, answer } = message.summary;
    console.log("summary received in content.js. Updating overlay");
    updateOverlay(message.overlayId, answer, body, title);
  } else if (message.error) {
    updateOverlay(message.overlayId, "Error", "", message.error);
  } else {
    chrome.runtime.sendMessage({ url: message.url, type: "startSpinner" })
  }
});


function updateOverlay(overlayId, title, body, summary) {
  console.log("Update overlay called");
  const overlay = document.getElementById(overlayId);
  console.log(overlayId)
  console.log(overlay)

  // Remove the spinner
  const spinner = overlay.querySelector(".spinner");
  if (spinner) {
    spinner.remove();
  }
  console.log("Spinner removed");

  // Update the content
  const overlayBox = overlay.querySelector(".overlay-box");
  overlayBox.innerHTML = "";

  const titleEl = document.createElement("h3");
  titleEl.textContent = title;
  overlayBox.appendChild(titleEl);

  const summaryEl = document.createElement("p");
  summaryEl.textContent = `Title: ${summary}`;
  overlayBox.appendChild(summaryEl);
}



function displayOverlay(title, body, summary, x, y) {
  // Create the overlay elements
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.id = "overlay" + document.querySelectorAll(".overlay").length
  overlay.style.left = `${x}px`;
  overlay.style.top = `${y}px`;

  const overlayBox = document.createElement("div");
  overlayBox.className = "overlay-box";

  const titleEl = document.createElement("h2");
  titleEl.textContent = title;

  const summaryEl = document.createElement("p");
  summaryEl.textContent = `${summary}`;

  // Create the spinner element
  const spinner = document.createElement("div");
  spinner.className = "spinner";

  // Assemble the elements
  overlayBox.appendChild(spinner);
  overlay.appendChild(overlayBox);
  document.body.appendChild(overlay);

  // Event listener to close the overlay when clicked outside
  document.addEventListener("click", function closeOverlay(event) {
    if (!overlay.contains(event.target)) {
      overlay.remove();
      document.removeEventListener("click", closeOverlay);
    }
  });

  return overlay;
}



