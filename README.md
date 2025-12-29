# MiddleClick+ 🖱️

**Middle click option for all clickables.**

This extension ensures that middle-clicking works on everything: buttons, lists, and modern web apps (SPAs) by forcing them to open in a new tab. It restores the standard browser behavior that many modern sites try to block.

It also adds "Open in New Tab" and "Open in New Window" options to the global right-click context menu.

<p align="center">
  <img src="assets/MiddleClick+.png" alt="MiddleClick+" width="70%">
</p>

## ✨ Features

* **Middle Click Everything**: Use your middle mouse button on any clickable item (like buttons, list items, or `div` links) to open them in a new background tab.
* **Context Menu**: Right-click anywhere to see "Open in New Tab" and "Open in New Window" options.
* **No Duplicates**: Smart logic prevents opening two tabs at once if the website already handles the click correctly.
* **Button Duplication**: If you middle-click a button that doesn't go anywhere (like a "New Chat" button), it duplicates your current tab so you don't lose your place.

## 🛠 Installation

Since this is a developer extension, you can install it manually:

1.  **Clone or Download** this repository to your computer.
2.  Open Chrome and go to `chrome://extensions/`.
3.  Toggle **Developer mode** in the top right corner.
4.  Click **Load unpacked**.
5.  Select the folder containing this extension.

## 📂 Project Structure

* `manifest.json`: Configuration file (Manifest V3).
* `content.js`: Injected script that handles DOM analysis and click interception.
* `background.js`: Service worker that manages tab creation and deduplication logic.
* `assets/`: Images and screenshots.
* `icons/`: Extension icons.

## 📄 License

This project is licensed under the [MIT License](LICENSE).