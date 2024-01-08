(function() {
  const LIST = document.getElementsByClassName("listing")[0];
  const PAGING = document.getElementsByClassName("b-pagination")[1];
  const FOOTER = document.getElementById("footer-push");


  var currentPage;
  var maxPage = 1;
  var loading = false;
  var loadingIcon;


  if (!!LIST && !!PAGING && PAGING.querySelectorAll('.b-pagination-item').length > 1) {
    var pageMatch = document.location.search.match(/page=([0-9])+/);

    if (pageMatch) {
      currentPage = parseInt(pageMatch[1]);
    } else {
      currentPage = 1;
    }

    var pageButtons = document.getElementsByClassName("b-pagination-item");
    maxPage = parseInt(pageButtons[pageButtons.length - 2].innerText);
    PAGING.style.display = "none";

    loadingIcon = document.createElement('div');
    loadingIcon.classList.add('center');
    loadingIcon.innerHTML = "<div class='loader'></div>";

    window.addEventListener('scroll', checkScroll);
    checkScroll();
  }

  function checkScroll() {
    if (currentPage >= maxPage) { return }
    var distanceFromBottom = LIST.getBoundingClientRect().bottom - document.body.getBoundingClientRect().height;

    if (!loading && distanceFromBottom < 200) {
      loadNextPage();
    }
  }

  function loadNextPage() {
    var urlWithoutPage = document.location.href.replace(/page=[0-9]+/, '');
    currentPage++;

    var modifier = urlWithoutPage.indexOf('?') >= 0 ? '&' : '?';
    var url = `${urlWithoutPage}${modifier}page=${currentPage}`;

    loading = true;
    FOOTER.appendChild(loadingIcon);
    fetch(url)
      .then((body) => {
        body.text().then((html) => {
          var parser = new DOMParser();
          var doc = parser.parseFromString(html, "text/html");

          var nodes = doc.querySelectorAll('.listing .info, .listing > li');

          Array.prototype.forEach.call(nodes, (node) => {
            LIST.appendChild(node);
          })

          loading = false;
          loadingIcon.remove();
        });
      });
  }
})()
