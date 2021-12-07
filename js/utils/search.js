//Pure function - dump function
import debounce from 'lodash.debounce';

export function initSearchInput({ elementId, defaultParams, onChange }) {
  const searchInput = document.getElementById(elementId);
  if (!searchInput) return;

  //   const queryParams = new URLSearchParams(window.location.search);
  if (defaultParams.get('title_like')) {
    searchInput.value = defaultParams.get('title_like');
  }

  const debounceSearch = debounce((event) => onChange?.(event.target.value), 500);
  //set default values from query params.
  //title_like

  searchInput.addEventListener('input', debounceSearch);
}
