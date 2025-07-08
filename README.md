# LinkedIn GitHub Sync

**AI-powered Chrome extension to seamlessly extract your GitHub projects and add them to LinkedIn's "Add Projects" section, complete with AI-enhanced project descriptions.**

## Features

- 🔗 **Sync GitHub Projects to LinkedIn:** Fetch all repositories for a specified GitHub username and prepare them for quick addition to your LinkedIn profile.
- 🤖 **AI-Powered Descriptions:** Automatically rewrite and enhance your project descriptions using Google's Gemini LLM for better presentation on LinkedIn.
- ⚡ **One-Click Autofill:** Fills LinkedIn's "Add Project" form fields with your selected GitHub project name and its AI-enhanced description.
- 🖱️ **Simple Popup UI:** Easy-to-use interface—just enter your GitHub username, view your projects, and add any project to LinkedIn in one click.

## How It Works

1. **Install the Extension** in your Chrome browser.
2. **Open LinkedIn** and navigate to the "Add Project" section on your profile.
3. **Open the Extension Popup** and enter your GitHub username.
4. **Fetch Projects:** The extension lists all your public repositories.
5. **Add to LinkedIn:** Click "Add to LinkedIn" on any project to autofill LinkedIn’s fields with project details. The description will be rewritten by AI for you!
6. **Review and Save** the project on LinkedIn.

## Screenshots

<!-- Add screenshots here if available, e.g.: -->
<!-- ![Popup UI](images/popup.png) -->
<!-- ![LinkedIn Autofill](images/autofill.png) -->

## Installation

1. Download or clone this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable "Developer mode" (top right).
4. Click "Load unpacked" and select the repository folder.
5. The extension is now ready to use!

## Usage

- Click the extension icon to open the popup.
- Enter your GitHub username and fetch your repositories.
- Click "Add to LinkedIn" for any project. The extension will attempt to autofill the "Add Project" fields on LinkedIn (make sure the relevant LinkedIn form is open).
- If the LinkedIn fields are not detected, make sure you are on the correct form and try again.

## Project Structure

- `manifest.json` — Chrome extension manifest (v3), sets permissions, popup, and background service worker.
- `background.js` — Handles requests to the Gemini LLM API for rewriting project descriptions.
- `content.js` — Automates filling LinkedIn’s "Add Project" form fields with project info.
- `popup.html` & `popup.js` — User interface for entering your GitHub username, listing projects, and triggering autofill.
- `icons/` — Extension icons.
- `style.css` — Styles for the popup.

## Permissions

- `activeTab`, `storage`, `scripting`
- Access to `api.github.com` (to fetch repositories), Google Gemini API (for AI rewriting), and LinkedIn (to autofill forms).

## Requirements

- Google Chrome
- GitHub account
- LinkedIn account

## Notes

- The extension only works with public repositories.
- AI project description rewriting uses Gemini API—replace the placeholder API key in `background.js` with your own for production use.

## Author
- Rahul V S

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[Specify your license here if applicable]

##Designed AND Developed by Rahul V S
