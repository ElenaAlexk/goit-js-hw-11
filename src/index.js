import { Notify } from 'notiflix';

import { createMarkup } from './app/createMarkup';
import NewsApiService from './app/PixabayAPI';
import LoadMoreBtn from './app/loadMoreBtn';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};

const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  hidden: true,
});

const newsApiService = new NewsApiService();

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();
  newsApiService.query = e.target.searchQuery.value.trim();
  if (newsApiService.query === '') {
    return Notify.info('Enter data to search!');
  }
  newsApiService.resetPage();
  clearGallery();
  newsApiService.fetchPost().then(addMarkup);
}

function onLoadMore() {
  newsApiService.fetchPost().then(addMarkup);
}

function addMarkup(hits) {
  refs.gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}
