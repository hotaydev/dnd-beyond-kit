# D&D Beyond Kit

[link for Chrome Web Store](https://chromewebstore.google.com/detail/dd-beyond-kit/gdpopbkamfkkenkillfnocgljokkcopg)

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

Currently we have translations to Brazilian Portuguese and Spanish. These translations aren't complete, they just have the main content, such as skills and proficiencies (the content that is usually more difficult to read).

### Contributing

Feel free to add more translations to the existing languages.

To add a new language, just:

1. Add the translation file on the `translations` folder, following the JSON structure of the other files;
2. Add the path of the translation on `web_accessible_resources[0].resources`;
3. Add the language at the end of the HTML select list, on `popup/popup.html`, line 14 and the following ones.

### Thanks

If you liked the extension, please give us a star on Github and a good note on Google Chrome Web Store.

