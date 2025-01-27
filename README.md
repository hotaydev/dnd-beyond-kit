<div align="center">
  <a href="https://dnd-beyond-kit.hotay.dev" target="_blank"><img src="https://raw.githubusercontent.com/hotaydev/dnd-beyond-kit/main/website/dice.svg" width="80" alt="d20 dice" /></a>
  <h1>D&D Beyond Kit</h1>
</div>

- [Website](https://dnd-beyond-kit.hotay.dev)
- [Link for Chrome Web Store](https://chromewebstore.google.com/detail/dd-beyond-kit/gdpopbkamfkkenkillfnocgljokkcopg?utm_source=github)
- [Link for Mozilla Firefox](https://addons.mozilla.org/en-US/firefox/addon/dnd-beyond-kit/?utm_source=github)
- [Translation Tool (Help us translating!)](https://dnd-beyond-kit.hotay.dev/translate)

### This extension is used to:

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
- Japanese (日本語)
- Dutch (Nederlands)

Want to help us translating D&D Beyond content? We created a [Translation Tool](https://dnd-beyond-kit.hotay.dev/translate) to make this process easier!!

### Contributing

To **edit the current existent translations or to translate more content** from the languages that we currently support, have a look at out [Translation Tool](https://dnd-beyond-kit.hotay.dev/translate).

You can also manually help us translating the content by editing the JSON files located in `translations/` folder.
To do this manually, just add the text you want to edit/translate in lowercase as the **key** of the JSON, and the translate text as the **value** of the JSON.

If you **want to add a new language**, then you can create a new JSON file in the `translations/` folder, with the name lik `<lang>-<country_code>.json`, for example: Brazilian Portuguese is called `pt-br.json`.
in this case we need also to add this configuration to the `popup/popup.html` file and to `manifest.json`. For more details, [open an Issue](https://github.com/hotaydev/dnd-beyond-kit/issues/new) and we will help you in this process.

### Browser support

Actually we support Firefox and chromium-based browsers, such as Google Chrome, Brave, Opera, and others.
We use the same `manifest.json` for both platforms.

### People who helped translating this extension <3

- [Taylor](https://github.com/taylorho) - Creator and main developer
- [San](mailto:pedromussipereira@gmail.com) - Helped with ideas and Brazilian Portuguese translations
- [mlynarp](https://github.com/mlynarp) - Many Czech translations and development help
- [MrProditio](https://github.com/MrProditio) - Spanish translations
- [vgauther](https://github.com/vgauther) and [Ins0mniakk](https://github.com/Ins0mniakk) - French translations
- [Gabriele](mailto:we@improve.games) and [bembe83](https://github.com/bembe83) - Italian translations
- [lill-la](https://github.com/lill-la) - Japanese support and translations for both, UI and Beyond pages.
- [Disispower](https://github.com/Disispower) - Contributed with Dutch translations for both, UI and Beyond pages.
- [Eltrio723](https://github.com/Eltrio723) - Helped with Spanish translations for Beyond pages.

### Thanks

If you liked the extension, please give us a star on Github and a good review on [Google Chrome Web Store](https://chromewebstore.google.com/detail/dnd-beyond-kit/gdpopbkamfkkenkillfnocgljokkcopg?utm_source=github).
