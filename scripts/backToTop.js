(() => {
  let scrollShown = false;
  let scroller;

  function scrollToTop() {
    window.scrollTo(0, 0);
  }

  function checkScroll() {
    if (window.scrollY >= 600 && !scrollShown) {
      showScroll();
    } else if (window.scrollY < 600 && scrollShown) {
      hideScroll();
    }
  }

  function showScroll() {
    document.body.appendChild(scroller);
    scrollShown = true;
  }

  function hideScroll() {
    scroller.remove();
    scrollShown = false;
  }

  window.addEventListener('scroll', checkScroll);
  scroller = document.createElement('button');
  scroller.innerText = chrome.i18n.getMessage("backToTop");
  scroller.classList.add('scrollToTop');

  scroller.addEventListener('click', scrollToTop);

  checkScroll();
})()