# Save Me A Click - Chrome Extension  

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/marksverdhei)  


Save Me A Click is a Chrome extension that provides a summary of a webpage when right-clicking on a link. It displays a popup with a title, body, and summary without needing to open the page.  

[Get it on the chrome web store](https://chrome.google.com/webstore/detail/save-me-a-click/cnhbeajhcgafdechfbffebemcnfkofbh)  

![Chrome extension demo](gif/demo.gif)

## Features  

- Right-click context menu item to fetch summary
- Displays an overlay with the fetched summary
- Overlay can be closed by clicking outside the popup

Current supported social media websites:  
- [X] Facebook  
- [X] Linkedin  
- [X] Youtube  
- [ ] Instagram  
- [ ] Twitter  

## Installation and setup  

The complete setup is a two-step process.  
1. Install the extension to your browser
2. Obtain an OpenAI API key to make it work  

[If you prefer a youtube tutorial, click here](https://www.youtube.com/watch?v=Rh_-zfLTHKA&ab_channel=Marksverdhei)

There are three ways to install the extension. 
1. [head to the chrome web store and click "add extension"](https://chrome.google.com/webstore/detail/save-me-a-click/cnhbeajhcgafdechfbffebemcnfkofbh)
2. Install from the pre-built extension zip file from [our latest release](https://github.com/marksverdhei/save-me-a-click-chrome-extension/releases/latest)
3. Clone the repo and build locally from source  

To install, simply head to the chrome store and click "Add extension"  

#### Installing from GitHub release 

1. Download the pre-built extension zip file from [our latest release](https://github.com/marksverdhei/save-me-a-click-chrome-extension/releases/latest)
2. Unzip the file in the directory you want your chrome extension
3. Open Google Chrome and navigate to `chrome://extensions/`.
4. Enable "Developer mode" by toggling the switch in the top right corner.
5. Click the "Load unpacked" button and select the directory containing the extension files.

#### Building project locally  

1. Make sure you have npm installed. If not, install npm
2. clone repo
3. run `npm i`  
4. run `npx webpack`  
5. Open Google Chrome and navigate to `chrome://extensions/`.
6. Enable "Developer mode" by toggling the switch in the top right corner.
5. Click the "Load unpacked" button and select the directory containing the extension files.

The extension should now be installed and active in your Chrome browser.

### Setting API key  

In order for the extension to work, you need to set an OpenAI API key.  
To set the API key simply click the chrome extension icon and paste in the key in the field.  

![A screenshot of what the field looks like](gif/api_field.png)

#### How to get an Openai API key  

1. Create an account at https://openai.com/
2. Register your account as a paid account https://platform.openai.com/account/billing/overview (free trial does not work)
3. Create a new API key at https://platform.openai.com/account/api-keys (copy it and save it somewhere)
This currently only works for paid accounts (ass opposed to free-trial accounts)

For your own usage, save me a click should be very cheap in terms of api costs. 
You can try setting a hard limit of costs here: https://platform.openai.com/account/billing/limits
