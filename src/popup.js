import browser from 'webextension-polyfill';

window.onload = function () {
  browser.storage.sync.get(["apiKey"], function (result) {
    if (result.apiKey) {
      document.getElementById("status").textContent = "API key saved!";
      document.getElementById("apiKeyDiv").style.display = "none";
      document.getElementById("saveApiKey").style.display = "none";
      document.getElementById("changeApiKey").style.display = "block";
    }
  });

  document.getElementById("saveApiKey").addEventListener("click", function () {
    const apiKey = document.getElementById("apiKey").value;
    browser.storage.sync.set({ apiKey: apiKey }, function () {
      console.log("API key is stored in Browser storage.");
      document.getElementById("status").textContent = "API key saved!";
      document.getElementById("apiKeyDiv").style.display = "none";
      document.getElementById("saveApiKey").style.display = "none";
      document.getElementById("changeApiKey").style.display = "block";
    });
  });

  document
    .getElementById("changeApiKey")
    .addEventListener("click", function () {
      document.getElementById("status").textContent =
        'Right-click on any link and select "Save me a click" to see a summary.';
      document.getElementById("apiKeyDiv").style.display = "block";
      document.getElementById("saveApiKey").style.display = "block";
      document.getElementById("changeApiKey").style.display = "none";
    });
};
