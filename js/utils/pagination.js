export function renderPagination(elementId, pagination) {
  const ulPagination = document.getElementById(elementId);
  if (!ulPagination || !pagination) return;
  //calc total pages
  const { _page, _limit, _totalRows } = pagination;
  const totalPages = Math.ceil(_totalRows / _page);
  //save page and total pages to ulPagination

  ulPagination.dataset.page = _page;
  ulPagination.dataset.totalPages = totalPages;
  // ulPagination.dataset.currentPage = _page;
  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled');
  else ulPagination.firstElementChild?.classList.remove('disabled');

  if (_page >= totalPages) ulPagination.lastElementChild?.classList.add('disabled');
  else ulPagination.lastElementChild?.classList.remove('disabled');
  //check if/else to enable/disable link
}

export function initPagination({ elementId, defaultParams, onChange }) {
  //bind click event for prev/next link
  const ulPagination = document.getElementById(elementId);
  if (!ulPagination) return;

  //set current active page
  const currentPage = defaultParams;
  console.log(currentPage);

  //TODO: use default params

  const prevLink = ulPagination.firstElementChild?.firstElementChild;
  prevLink.addEventListener('click', (e) => {
    e.preventDefault();

    const page = Number.parseInt(ulPagination.dataset.page) || 1;

    if (page <= 1) return;
    onChange?.(page - 1);
  });

  const nextLink = ulPagination.lastElementChild?.firstElementChild;
  nextLink.addEventListener('click', (e) => {
    e.preventDefault();

    const page = Number.parseInt(ulPagination.dataset.page) || 1;
    const totalPages = ulPagination.dataset.totalPages;
    if (page < totalPages) onChange?.(page + 1);
  });

  const itemLink = ulPagination.querySelectorAll('.page-item a');
  itemLink.forEach((val, index) => {
    val.addEventListener('click', function (e) {
      e.preventDefault();
    });
  });

  // itemLink[1].addEventListener('click', (e) => {
  //   const page = ulPagination.dataset.page;
  //   const currentPagination = ulPagination.dataset.currentPage;

  // });
  // itemLink[2].addEventListener('click', (e) => {
  //   e.preventDefault();
  // });
  // itemLink[3].addEventListener('click', (e) => {
  //   e.preventDefault();
  // });
}
