async function needToChangeMetrics() {
  return await chrome.storage.local.get("convertUnits").then((result) => {
    return result.convertUnits ?? true;
  });
}

// TODO: Convert also: miles, inches, cubic foots, square yards, pounds, onces and gallons
// TODO: check line 13

const feetToMeters = (feet) => feet * 0.3;
const feetRegex = /\b(\d+(\.\d+)?)\s*(feet|foot|ft|-ft|ft\.)\b/gi;

// It works fine in general text, but in some parts of the Character sheet the values will need to be replace on by one
function replaceFeetsByMetersInText(element) {
  if (element.nodeType === Node.TEXT_NODE) {
      if (feetRegex.test(element.textContent)) {
       element.textContent = element.textContent.replace(feetRegex, function(match, feetValue) {
          try {
            var metersValue = feetToMeters(parseFloat(feetValue));
            return (metersValue % 1 === 0 ? metersValue.toFixed(0) : metersValue.toFixed(1)) + ' m';
          } catch (error) {
            console.error(error);
            return match;
          }
        });
      }
  } else if (element.nodeType === Node.ELEMENT_NODE) {
      element.childNodes.forEach((element) => replaceFeetsByMetersInText(element))
  }
}

async function run() {
  const needToRun = await needToChangeMetrics();
  if (!needToRun) {
    console.log("Metrics convert is disabled");
  } else {
    var observedNode = document.querySelector("body");
    const observer = new MutationObserver(() => {replaceFeetsByMetersInText(observedNode)});
    observer.observe(observedNode, { childList: true, subtree: true });
  }
}

async function runWhenPageReady() {
  if (document.querySelector("body")) {
    await run();
  } else {
    setTimeout(runWhenPageReady, 500);
  }
}

(async () => {
  await runWhenPageReady();
})()
