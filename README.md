# Hevy Routines Backup Tool - WebExtension

> Export your [Hevy](https://hevy.com) workout routines to a cleanly structured text file.

## Features

- **One-Click Export**: Automatically fetch all your routines directly from the Hevy web app.
- **Detailed Extraction**: Retrieves not only the exercises but also the sets, rest times, and your custom notes/descriptions.
- **Clean Structure**: Outputs a beautifully tab-indented, readable `.txt` file for easy backup or sharing.
- **Privacy First**: Everything runs locally in your browser. No data is sent to external servers.

## Installation

Since this extension is not published on the Chrome Web Store, you can easily install it manually:

1. **Download the code**: Clone this repository or download it as a ZIP file and extract it.
2. **Open Extensions page**: In Google Chrome, go to `chrome://extensions/` (or click the puzzle icon > Manage Extensions).
3. **Enable Developer Mode**: Turn on the "Developer mode" toggle switch in the top right corner.
4. **Load the extension**: Click the **"Load unpacked"** button in the top left.
5. **Select the folder**: Choose the folder containing this extension's files (`manifest.json`, `background.js`, etc.).

## How to Use

1. Go to your Hevy routines page: [https://hevy.com/routines](https://hevy.com/routines)
2. Make sure you are logged into your account.
3. Click the **Hevy Routine Backuper** icon in your Chrome extensions bar.
4. Wait a few seconds... The extension will securely parse your routines in the background.
5. A nicely formatted `.txt` file containing all your workout data will automatically download!

## Built With

- JavaScript
- Chrome Extensions API (Manifest V3)

## Example Output

```text
=== Push Day ===

	--- Barbell Bench Press ---
		Sets: 4 sets
		Rest Time: 3min 0s
		Description:
		{
			Focus on the eccentric phase.
			RPE 8-9
		}

	--- Overhead Press ---
		Sets: 3 sets
		Rest Time: 2min 0s
		Description:
		{
			None
		}
```

## Credits

Developed by **isma** with the assistance of **Gemini 3.1 Pro**.