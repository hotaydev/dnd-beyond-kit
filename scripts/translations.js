// `currentBrowser` is defined in ./metrics.js

async function getTranslations(lang) {

  if (lang === 'en-us') {
    return null;
  }

  const jsonUrl = currentBrowser.runtime.getURL(`translations/${lang}.json`);
  const jsonSpellsUrl = currentBrowser.runtime.getURL(`translations/spells/${lang}.json`);

  const translateSpellNames = await currentBrowser.storage.local.get("translateSpellNames").then((result) => {
    return result.translateSpellNames ?? true;
  });

  return await fetch(jsonUrl)
    .then(res => res.json())
    .then(async (data) => {
      if (translateSpellNames) {
        return await fetch(jsonSpellsUrl)
          .then(res2 => res2.json())
          .then(spellNames => {
            // merge spellNames and data
            return {
              ...data,
              ...spellNames
            };
          });
      } else {
        return data;
      }
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

function translateTextInElements(parentElement, dictionary) {
  let elements = getTextNodes(parentElement);
  elements.forEach(element => {
    let originalText = element.textContent;
    let translatedString = translateWord(originalText, dictionary);
    if (originalText == translatedString) {
      // console.log(originalText); // Untranslated text
      let matches = translatedString.match(/[A-Za-z]+(?:[ '\u2019][A-Za-z]+|-[A-Za-z]+)*/g);
      if (matches) {
        matches.forEach(originalWord => {
          let translatedWord = translateWord(originalWord, dictionary);
          translatedString = translatedString.replace(originalWord, translatedWord);
        });
      }
    }
    element.textContent = translatedString;
  });
}

function translateWord(word, dictionary) {
  let lowerWord = word.toLowerCase();

  if (dictionary.hasOwnProperty(lowerWord)) {
    return dictionary[lowerWord];
  }

  return word;
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
  const translations = await getTranslations(language);

  if (translations) {
    translateTextInElements(document.querySelector("main"), translations);

    document.addEventListener('click', function () {
      // Wait some time after click to also translate content after opening the sidebar and after changing tabs
      setTimeout(() => {
        translateTextInElements(document.querySelector("main"), translations);
        translateTextInElements(document.querySelector(".ct-sidebar__portal"), translations); // General side menu
        translateTextInElements(document.querySelector("dialog"), translations); // Mobile menu
      }, 100);
    }, true); // Don't remove this "true"
  }

  await minifyContent();
  setInterval(() => {
    const splittedTitle = document.title.split('\'s');
    if (splittedTitle.length > 1) document.title = splittedTitle[0] + " | D&D Beyond";
  }, 2000); // 2 seconds
}

async function runWhenPageReady() {
  if (document.querySelectorAll("[class^='ct-character-header-']:is(.ct-character-header-mobile, .ct-character-header-desktop)").length > 0) {
    await translateContent();
  } else {
    setTimeout(runWhenPageReady, 500);
  }
}


(async () => {
  await runWhenPageReady();
})()
