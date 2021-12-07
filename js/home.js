import postApi from './api/postApi';
import { initPagination, initSearchInput, renderPostList, renderPagination, toast } from './utils';

async function handleFilterChange(filterName, filterValue) {
  try {
    const url = new URL(window.location);
    if (filterName) url.searchParams.set(filterName, filterValue);

    //reset page
    if (filterName === 'title_like') url.searchParams.set('_page', 1);

    //update url
    history.pushState({}, '', url);
    //fetch API
    const { data, pagination } = await postApi.getAll(url.searchParams);

    renderPostList(data);
    renderPagination('pagination', pagination);
  } catch (error) {
    console.log('failed to fetch post list');
  }

  //re-render postList
}

function handleNoButton() {
  console.log(btnNo);
}
function registerPostDeleteEvent() {
  document.addEventListener('post-delete', async function (e) {
    //call api to remove post id
    //fetch data
    try {
      const btnRemove = document.querySelector('[data-id="remove"]');
      if (!btnRemove) return;
      btnRemove.addEventListener('click', function (e) {
        e.preventDefault();
        const modal = document.getElementById('deleteModal');
        if (!modal) return;
        modal.style.display = 'block';
      });
      const btnNo = document.querySelector('.modal-footer .no');
      btnNo.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = document.getElementById('deleteModal');
        if (!modal) return;
        modal.style.display = 'none';
      });
      const post = e.detail;
      const btnYes = document.querySelector('.modal-footer .yes');
      if (!btnYes) return;
      btnYes.addEventListener('click', async function (e) {
        e.preventDefault();
        console.log(e);
        await postApi.remove(post.id);
        await handleFilterChange();
        toast.success('Remove post successfully');
      });
      // btnYes.addEventListener('click', (e) => {
      //
      //
      //
      // });
    } catch (error) {
      console.log('failed to remove post', error);
      toast.error(error.message);
    }
  });
}
(async () => {
  try {
    const url = new URL(window.location);
    //update search params if needed
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);

    history.pushState({}, '', url);
    const queryParams = url.searchParams;
    registerPostDeleteEvent();
    //attach click event for link
    initPagination({
      elementId: 'pagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    });

    //set default query params if it doesnt exists
    //set default pagination (_page,_limit) on url

    initSearchInput({
      elementId: 'searchInput',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    });

    //render post list based on params
    // const queryParams = new URLSearchParams(window.location.search);

    const { data, pagination } = await postApi.getAll(queryParams);

    renderPostList(data);
    renderPagination('pagination', pagination);
  } catch (error) {
    console.log('get all failed', error);
  }
})();
