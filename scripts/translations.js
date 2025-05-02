// `currentBrowser` is defined in ./metrics.js

const characterBuilderPageRegex = /^https:\/\/www\.dndbeyond\.com\/characters\/\d+\/builder\/.*/;
let dictionary;

async function getTranslations(lang, remote = false) {
  if (lang === 'en-us') return null;

  const lastLang = localStorage.getItem("beyondKitlastUsedLanguage");
  if (lastLang !== lang) {
    localStorage.removeItem('beyondKitlastCheckedForNewerTranslations');
    localStorage.removeItem('beyondKitNewerTranslations');
    localStorage.setItem("beyondKitlastUsedLanguage", lang);
  } else {
    const newerTranslations = localStorage.getItem('beyondKitNewerTranslations');
    if (newerTranslations) {
      return JSON.parse(newerTranslations);
    }
  }

  const githubBaseURL = 'https://raw.githubusercontent.com/hotaydev/dnd-beyond-kit/main/translations';
  const jsonUrl = remote ? `${githubBaseURL}/${lang}.json` : currentBrowser.runtime.getURL(`translations/${lang}.json`);

  return await fetch(jsonUrl)
    .then(res => res.json())
    .then(async (data) => {
      return data;
    });
}

async function languageOfTheExtension() {
  return await currentBrowser.storage.local.get("language").then((result) => {

    if (!result.language) {
      currentBrowser.storage.local.set({ language: "en-us" });
      return "en-us";
    }

    return result.language;
  });
}

async function minifyContent() {
  const cleanInterface = await currentBrowser.storage.local.get("cleanInterface").then((result) => {
    return result.cleanInterface ?? true;
  });

  if (!cleanInterface) {
    return;
  }

  const footer = document.querySelector('footer');
  const megamenu = document.querySelector('div[name=megamenu] menu');
  const socials = document.querySelector('.site-bar__container .socials');
  const interactions = document.querySelector('.site-bar__container .user-interactions');
  const search = document.querySelector('.site-bar__container .site-search form .react-autosuggest__container');

  if (footer) footer.style.visibility = 'hidden';
  if (megamenu) megamenu.style.visibility = 'hidden';
  if (socials) socials.style.visibility = 'hidden';
  if (interactions) interactions.style.visibility = 'hidden';
  if (search) search.style.visibility = 'hidden';
}

function translateTextInElements(parentElement) {
  let elements = getTextNodes(parentElement);
  const untranslatedContent = [];

  elements.forEach(element => {
    let originalText = element.textContent;

    // Avoid CSS Classes
    if (originalText.includes('.prefix__')) return;

    let translatedString = translateWord(originalText);
    if (originalText == translatedString) {
      let matches = translatedString.match(/[A-Za-zÀ-ž]+(?:[ '\u2019][A-Za-zÀ-ž]+|-[A-Za-zÀ-ž]+)*/g);
      if (matches) {
        matches.forEach(originalWord => {
          if (originalWord.length === 1) return;

          let translatedWord = translateWord(originalWord);
          translatedString = translatedString.replace(originalWord, translatedWord);

          if (!isTranslatedString(translatedWord)) {
            untranslatedContent.push(translatedWord);
          }
        });
      } else if (!isTranslatedString(originalText)) {
        if (originalText.length === 1) return;
        untranslatedContent.push(originalText);
      }
    }
    element.textContent = translatedString;
  });
  getUntranslatedContent(untranslatedContent); // Defined in ./checkMissingTranslations.js
}

// Replaces dice notation (e.g., 1d4, 2d8) with localized versions
function localizeDiceNotation(text, lang) {
  // TODO: we can possibly turn this into a toggable feature through the interface

  // German localization example: 1d4 -> 1w4
  if (lang === 'de-de') {
    return text.replace(/\b(\d+)d(\d+)\b/g, '$1w$2');
  }

  // Russian localization: Replace 'd' with 'к'
  if (lang === 'ru-ru') {
    return text.replace(/\b(\d+)d(\d+)\b/g, '$1к$2');
  }

  return text;
}

function localizeDiceNotationInElement(element, lang) {
  if (!element) return;

  const nodes = getTextNodes(element);
  nodes.forEach(node => {
    node.textContent = localizeDiceNotation(node.textContent, lang);
  });
}

function translateWord(word) {
  let lowerWord = word.toLowerCase();

  if (dictionary.hasOwnProperty(lowerWord)) {
    return dictionary[lowerWord];
  }

  return word;
}

function isTranslatedString(word) {
  let isTranslated = Object.values(dictionary).some((translation) => translation.replaceAll('.', "").toLowerCase() === word.replaceAll('.', "").toLowerCase());

  return isTranslated;
}

function getTextNodes(parentElement) {
  let textNodes = [];

  function findTextNodes(node) {
    if (!node) {
      return;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      const trimmedText = node.textContent.trim();

      if (trimmedText !== '' &&
        !/^[\d\s.,()"'+/!?-]*$/.test(trimmedText)) {
        const parentTag = node.parentNode.tagName;
        if (parentTag !== 'STYLE' && parentTag !== 'SCRIPT' && parentTag !== 'SVG' && parentTag !== 'IFRAME') {
          const style = window.getComputedStyle(node.parentNode);
          if (style && style.display !== 'none' && style.visibility !== 'hidden') {
            textNodes.push(node);
          }
        }
      }
    }
    node.childNodes.forEach(child => findTextNodes(child));
  }
  findTextNodes(parentElement);

  return textNodes;
}

async function translateContent() {
  const language = await languageOfTheExtension();
  dictionary = await getTranslations(language);

  if (dictionary) {
    translateTextInElements(document.querySelector("main"), dictionary);
    localizeDiceNotationInElement(document.querySelector("main"), language);

    document.addEventListener('click', function () {
      // Wait some time after click to also translate content after opening the sidebar and after changing tabs
      setTimeout(() => {
        const main = document.querySelector("main");
        translateTextInElements(main, dictionary);
        localizeDiceNotationInElement(main, lang);
        translateTextInElements(document.querySelector(".ct-sidebar__portal"), dictionary); // General side menu
        translateTextInElements(document.querySelector("dialog"), dictionary); // Mobile menu
        translateTextInElements(document.querySelector(".fullscreen-modal-overlay"), dictionary); // Character Creator overlays/popups
      }, 100);
    }, true); // Don't remove this "true"
  }

  if (!characterBuilderPageRegex.test(window.location.href)) {
    await minifyContent();
    setInterval(() => {
      const splittedTitle = document.title.split('\'s');
      if (splittedTitle.length > 1) document.title = splittedTitle[0] + " | D&D Beyond";
    }, 2000); // 2 seconds
  }

  checkIfThereAreNewerRemoteTranslations(language);
}

async function checkIfThereAreNewerRemoteTranslations(lang) {
  setTimeout(async () => {
    const lastUpdatedTime = parseInt(localStorage.getItem("beyondKitlastCheckedForNewerTranslations") || "0");

    // Check if the difference is greater than 24 hours (24 * 60 * 60 * 1000 ms)
    const timeDifference = Date.now() - lastUpdatedTime;
    const passedMoreThan24Hours = timeDifference > 24 * 60 * 60 * 1000;

    if (!passedMoreThan24Hours) return;

    localStorage.setItem("beyondKitlastCheckedForNewerTranslations", Date.now().toString());
    const remoteTranslations = await getTranslations(lang, true);
    if (remoteTranslations) {
      const untranslatedContent = Object.keys(remoteTranslations).map((key) => !!dictionary[key]).filter((value) => value === false);
      if (untranslatedContent.length === 0) return;

      // Remote language file has more translated content than the local one 
      localStorage.setItem("beyondKitNewerTranslations", JSON.stringify(remoteTranslations));
      dictionary = remoteTranslations;
    }
  }, 10 * 1000); // 10 seconds, to ensure the UI is already translated before we insert more workload to the page
}

async function runWhenPageReady() {
  const isCharacterBuilderPage = (characterBuilderPageRegex.test(window.location.href) && document.querySelector(".character-builder-inner .character-builder-page-header"));
  const isCharacterAppPage = document.querySelectorAll("[class^='ct-character-header-']:is(.ct-character-header-mobile, .ct-character-header-desktop)").length > 0;

  if (isCharacterAppPage || isCharacterBuilderPage) {
    await translateContent();
  } else {
    setTimeout(runWhenPageReady, 500);
  }
}


(async () => {
  await runWhenPageReady();
})()
