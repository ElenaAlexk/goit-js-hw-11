import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { createMarkup } from './app/createMarkup';
import NewsApiService from './app/PixabayAPI';
import LoadMoreBtn from './app/load-more-btn';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};

const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  hidden: true,
});

const newsApiService = new NewsApiService();

const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
  captionPosition: 'bottom',
  enableKeyboard: true,
});

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();
  newsApiService.query = e.target.searchQuery.value.trim();
  if (newsApiService.query === '') {
    return Notify.info('Enter data to search!');
  }
  loadMoreBtn.show();
  newsApiService.resetPage();
  clearGallery();
  fetchPosts();
}

function onLoadMore() {
  fetchPosts();
}

function fetchPosts() {
  loadMoreBtn.hide();

  newsApiService.fetchPost().then(data => {
    const currentPage = newsApiService.page - 1;
    newsApiService.hits = data.totalHits;

    if (!data.totalHits) {
      loadMoreBtn.hide();
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    if (!data.hits.length) {
      loadMoreBtn.hide();
      return Notify.failure(
        `We're sorry, but you've reached the end of search results.`
      );
    }

    addMarkup(data.hits);
    loadMoreBtn.show();
    if (currentPage === 1) {
      Notify.success(`Hooray! We found ${newsApiService.hits} images.`);
    }
    lightbox.refresh();
  });
}

function addMarkup(hits) {
  refs.gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}
