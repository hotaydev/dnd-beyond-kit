// `currentBrowser` is defined in ./script.js

const title       = document.getElementById('title');
const choose_lang = document.getElementById('choose_language');
const choose_opt  = document.getElementById('choose_language_option');
const thanks      = document.getElementById('thanks');
const convertToSI = document.getElementById('convertToSI');
const version     = document.getElementById('extension-version');
const settings    = document.getElementById('settingsTitle');
const githubSetti = document.getElementById('moreSettingsQuestion');
const interface   = document.getElementById('cleanInterface');
const question    = document.getElementById('likingInterface');
const review      = document.getElementById('leaveAReview');
const missTransl  = document.getElementById('periodicallySendMissingTranslations');

if (title)       title.innerText       = currentBrowser.i18n.getMessage("title");
if (choose_lang) choose_lang.innerText = currentBrowser.i18n.getMessage("choose_language");
if (choose_opt)  choose_opt.innerText  = currentBrowser.i18n.getMessage("choose_language_option");
if (thanks)      thanks.innerText      = currentBrowser.i18n.getMessage("thanks");
if (convertToSI) convertToSI.innerText = currentBrowser.i18n.getMessage("convertToSI");
if (version)     version.innerText     = `v${currentBrowser.runtime.getManifest().version}`
if (settings)    settings.innerText    = currentBrowser.i18n.getMessage("settingsTitle");
if (githubSetti) githubSetti.innerText = currentBrowser.i18n.getMessage("moreSettingsQuestion");
if (interface)   interface.innerText   = currentBrowser.i18n.getMessage("cleanInterface");
if (question)    question.innerText    = currentBrowser.i18n.getMessage("likingInterface");
if (review)      review.innerText      = currentBrowser.i18n.getMessage("leaveAReview");
if (missTransl)  missTransl.innerText  = currentBrowser.i18n.getMessage("periodicallySendMissingTranslations");
