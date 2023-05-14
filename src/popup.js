document.getElementById('saveApiKey').addEventListener('click', function(){
    const apiKey = document.getElementById('apiKey').value;
    chrome.storage.sync.set({apiKey: apiKey}, function() {
      console.log('API key is stored in Chrome storage.');
    });
  });
  