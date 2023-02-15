import NewsApiService from './app/PixabayAPI';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const newsApiService = new NewsApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();
  newsApiService.query = e.target.searchQuery.value.trim();
  if (newsApiService.query === '') {
    return alert('Введи!');
  }
  newsApiService.resetPage();
  newsApiService.fetchPost();
}

function onLoadMore() {
  newsApiService.fetchPost();
}
