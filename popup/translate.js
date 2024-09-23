const title       = document.getElementById('title');
const choose_lang = document.getElementById('choose_language');
const choose_opt  = document.getElementById('choose_language_option');
const thanks      = document.getElementById('thanks');
const convertToSI = document.getElementById('convertToSI');

if (title)       title.innerText       = chrome.i18n.getMessage("title");
if (choose_lang) choose_lang.innerText = chrome.i18n.getMessage("choose_language");
if (choose_opt)  choose_opt.innerText  = chrome.i18n.getMessage("choose_language_option");
if (thanks)      thanks.innerText      = chrome.i18n.getMessage("thanks");
if (convertToSI) convertToSI.innerText = chrome.i18n.getMessage("convertToSI");
