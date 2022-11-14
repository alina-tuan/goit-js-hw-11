import './css/styles.css';
import api from './api-pixabay';
import axios from 'axios';
import Notiflix from 'notiflix';
import { createImgMarkup } from './img-markup';

import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";
const lightbox = new SimpleLightbox('.gallery a', { captionsData:"alt", captionDelay:250});

const getEl = selector => document.querySelector(selector);

let page = 1;

getEl('.search-form').addEventListener('submit', onSubmit);
getEl('.gallery').addEventListener('click', event => event.preventDefault());
// getEl('.load-more').addEventListener('click', onLoadMore);

function onSubmit(event) {
  event.preventDefault();
  const formValue = getEl('.search-form').elements.searchQuery.value;
  getEl('.gallery').innerHTML = '';
  page = 1;

  api.getData(formValue, page).then(response => {
    if (response.data.hits.length === 0) {
      return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    } else {
      Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`);

      createImgMarkup(response.data.hits, getEl('.gallery'));

      lightbox.refresh();
    }
  });
}

// function onLoadMore() {
//   api.getData().then(response => {
//     page += 1;
//     if (res.data.hits.length === 0) {
//           Notiflix.Notify.warning('We`re sorry, but you`ve reached the end of search results.');
//           return;
//         } else {
//           createMarkup(res.data.hits, getEl('.gallery'));
//           lightbox.refresh();
//         }
//   }) 
// }

const onEntry = entries => {
  entries.forEach(async entry => {
    if (entry.isIntersecting && getEl('.img-link')) {
      page += 1;
      const value = getEl('.search-form').elements.searchQuery.value;
      await api.getData(value, page).then(res => {
        if (res.data.hits.length === 0) {
          page -= 1;
          Notiflix.Notify.warning('We`re sorry, but you`ve reached the end of search results.');
          return;
        } else {
          createImgMarkup(res.data.hits, getEl('.gallery'));

          lightbox.refresh();
        }
      });
    }
  });
};

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '100px',
});

observer.observe(getEl('footer'));