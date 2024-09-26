# D&D Beyond Kit

[Link for Chrome Web Store](https://chromewebstore.google.com/detail/dd-beyond-kit/gdpopbkamfkkenkillfnocgljokkcopg)
Link for Mozilla Firefox (On approval process)

This extension is used to:
- Traslate your D&D Beyond character sheet page to your language;
- Use the International Unit System (SI) for metrics on Character Sheet, monsters, spells, etc.;
- Remove the Character Sheep interface pollutionm leaving it simpler;
- Add a "Skip to the top" button on long pages;
- Add autoload on listing pages (such as monsters and spells pages).

---

> [!IMPORTANT]
> Using the character sheet in English is difficult, sometimes, so I've created this extension to simplify the process for non-US citizen users.

### Languages

Currently we have translations to the following languages:

- Brazilian Portuguese (Português)
- Spanish (Español)
- English (Only metric system changes)
- Italian (Italiano)
- French (Français)
- German (Deutsch)
- Czech (Čeština)

### Contributing

Feel free to add more translations to the existing languages.

To add a new language, just:

1. Add the translation file on the `translations` folder, following the JSON structure of the other files;
2. Add the path of the translation on `web_accessible_resources[0].resources`, in the `manifest.json` file;
3. Add the language at the end of the HTML select list, on `popup/popup.html`, line 20 and the following ones.

### Browser support

Actually we support Firefox and chrome-based browsers, such as Google Chrome, Brave, Opera, and others.
We use the same `manifest.json` for both platforms.

### Thanks

If you liked the extension, please give us a star on Github and a good note on [Google Chrome Web Store](https://chromewebstore.google.com/detail/dnd-beyond-kit/gdpopbkamfkkenkillfnocgljokkcopg).

