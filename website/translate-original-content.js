// Something similar to this script need to be added to the extension, so we have a way to detect new content from different D&D races.
// IMPORTANT: this feature need to be disabled by default and users need to be able to enable it manually, because we respect users' privacy.

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

function translateTextInElements(parentElement) {
  const existingTranslations = JSON.parse(localStorage.getItem("translationsArray")) || [];
  let elements = getTextNodes(parentElement);

  const newTranslations = elements.map((element) => {
    return element.textContent.trim();
  });

  const combinedTranslations = [...new Set([...existingTranslations, ...newTranslations])];
  localStorage.setItem("translationsArray", JSON.stringify(combinedTranslations));
}

setInterval(() => {
  translateTextInElements(document.querySelector("main")); // Main content
  translateTextInElements(document.querySelector(".ct-sidebar__portal")); // General side menu
  translateTextInElements(document.querySelector("dialog")); // Mobile menu
}, 100);
