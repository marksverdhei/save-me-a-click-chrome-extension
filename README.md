# Save Me A Click - Chrome Extension

Save Me A Click is a Chrome extension that provides a summary of a webpage when right-clicking on a link. It displays a popup with a title, body, and summary without needing to open the page.

## Features

- Right-click context menu item to fetch summary
- Displays an overlay with the fetched summary
- Overlay can be closed by clicking outside the popup

## Installation

1. Download or clone this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" by toggling the switch in the top right corner.
4. Click the "Load unpacked" button and select the directory containing the extension files.

The extension should now be installed and active in your Chrome browser.

## Usage

1. Right-click on any link in a webpage.
2. Select "Save me a click" from the context menu.
3. A popup with the summary will appear near the clicked link.

## Project Structure

- `background.js`: Handles context menu creation and message passing between content and background scripts.
- `content.js`: Handles DOM manipulation to display the summary overlay and manages communication with the background script.
- `overlay.css`: Contains the styling for the summary overlay and spinner.
