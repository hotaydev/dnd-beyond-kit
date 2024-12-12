// Something similar to this script need to be added to the extension, so we have a way to detect new content from different D&D races.
// IMPORTANT: this feature need to be disabled by default and users need to be able to enable it manually, because we respect users' privacy.

let translationsArray = [];

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

function isDiceString(input) {
  const diceRegex = /^\d+d\d+(?:[\+\-]\d+)?$/;
  return diceRegex.test(input);
}

function translateTextInElements(parentElement) {
  const translationsMissingButNotSent = JSON.parse(localStorage.getItem("beyondKitTranslationsMissing") || '[]');
  let elements = getTextNodes(parentElement);

  const newTranslations = elements.map((element) => {
    let trimmedText = element.textContent.trim();
    if (isDiceString(trimmedText)) return '';
    if (trimmedText === '*') return '';
    if (trimmedText === 'NaN') return '';
    if (trimmedText === 'm.') return '';
    if (trimmedText === 'kg.') return '';
    if (trimmedText.includes('.prefix__')) return '';

    return trimmedText.replace(/^[.,+•):;]\s/, '').replace(/[.,+•“”(:;]$/, '').replaceAll("--", "").replace(/\d+$/, '').trim();
  }).filter((a) => a !== '');

  const combinedTranslations = [...new Set([...translationsMissingButNotSent, ...newTranslations])];
  const nonTranslatedContent = combinedTranslations.filter(item => !translationsArray.includes(item));
  localStorage.setItem("beyondKitTranslationsMissing", JSON.stringify(nonTranslatedContent));
}

// In thsi function, each 10 seconds the content is scanned for missing translations (this way it's not exhaustive for the browser)
function startSearchingForMissingTranslations() {
  setInterval(() => {
    translateTextInElements(document.querySelector("main")); // Main content
    translateTextInElements(document.querySelector(".ct-sidebar__portal")); // General side menu
    translateTextInElements(document.querySelector("dialog")); // Mobile menu
  }, 10 * 1000); // Each 10 seconds
}

function sendMissingTranslations(translationsMissingButNotSent) {
  const translationsMissingAndSent = JSON.parse(localStorage.getItem("beyondKitTranslationsMissingAlreadySent") || '[]');

  const willSend = translationsMissingButNotSent.filter(item => !translationsMissingAndSent.includes(item));

  if (willSend.length > 10) {
    willSend.shift(); // Remove first element. First element is, in most times, the name of the character from the sheet.
    fetch('https://n8n.hotay.dev/webhook/dnd-beyond-kit-translation-new-translations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(willSend),
    }).then(() => {
      localStorage.setItem("beyondKitTranslationsMissingAlreadySent", JSON.stringify([...new Set([...translationsMissingAndSent, ...translationsMissingButNotSent])]));
    }).catch((err) => {
      // On error we just don't execute/retry nothing. This error will not impact the user.
      console.log(err);
    });
  }
}

function checkMissingTranslations() {
  const currentKnownTranslations = "https://raw.githubusercontent.com/hotaydev/dnd-beyond-kit/main/translations/base.json";

  const lastUpdatedTime = parseInt(localStorage.getItem("beyondKitLastUpdatedTime") || "0");
  const savedArrayOfTranslations = JSON.parse(localStorage.getItem("beyondKitTranslationsArray") || "[]");

  // Check if the difference is greater than 24 hours (24 * 60 * 60 * 1000 ms)
  const timeDifference = Date.now() - lastUpdatedTime;
  const passedMoreThan24Hours = timeDifference > 24 * 60 * 60 * 1000;

  if (passedMoreThan24Hours) {
    fetch(currentKnownTranslations)
      .then(res => res.json())
      .then(data => {
        translationsArray = data;
        localStorage.setItem("beyondKitLastUpdatedTime", Date.now().toString());
        localStorage.setItem("beyondKitTranslationsArray", JSON.stringify(data));

        startSearchingForMissingTranslations();
      })
      .catch((err) => {
        // On error we just don't execute/retry nothing. This error will not impact the user.
        console.log(err);

        if (savedArrayOfTranslations.length > 0) {
          translationsArray = savedArrayOfTranslations;
          startSearchingForMissingTranslations();
        }
      });

    const translationsMissingButNotSent = JSON.parse(localStorage.getItem("beyondKitTranslationsMissing") || '[]');

    // Each time the user access the extension, if it have passed more than 24 hours, we send the missing translations
    if (translationsMissingButNotSent.length > 10) {
      // Send and create/edit translationsMissingAndSent
      sendMissingTranslations(translationsMissingButNotSent)
    }
  } else {
    if (savedArrayOfTranslations.length > 0) {
      translationsArray = savedArrayOfTranslations;
      startSearchingForMissingTranslations();
    }
  }
}

// Start function, called when page loads
(() => {
  // After 5 seconds, we call our main function for this script
  setTimeout(async () => {
    const sendMissingTranslationsState = await currentBrowser.storage.local.get("sendMissingTranslations").then((result) => {
      return result.sendMissingTranslations ?? false; // Deactivated by default
    });

    if (sendMissingTranslationsState) {
      checkMissingTranslations()
    }
  }, 5000);
})()