import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import debounce from 'lodash.debounce';

const input = document.querySelector('input');
const formSubmit = document.querySelector('.search-form');
const searchBtn = document.querySelector('.search');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
const bottom = document.querySelector('.bottom');
const imagesPerPage = 40;
let page;
let loadedImages = 0;
let request = '';

gallery.addEventListener('click', onImageClick);
function onImageClick(event) {
  event.preventDefault();
}

const slideShow = new SimpleLightbox('.gallery a');
// console.log(slideShow.elements);

document.addEventListener('wheel', debounce(scrollHandler, 300));
function scrollHandler(event) {
  if (event.deltaY > 0) {
    windowAutoScroll();
  }

  console.log(event.deltaY);
}

formSubmit.addEventListener('submit', onFormSubmit);
function onFormSubmit(event) {
  event.preventDefault();

  page = 1;
  request = input.value;
  gallery.innerHTML = '';

  fetchImages(input.value)
    .then(photos => {
      Notiflix.Notify.success(`Hooray! We found ${photos.totalHits} images.`);
      renderGallery(photos);
      searchBtn.blur();
      loadMore.blur();
      loadMore.classList.remove('is-hidden', 'is-disabled');
      loadMore.disabled = false;
      bottom.classList.remove('is-hidden');
      slideShow.refresh();
      //   windowAutoScroll();
    })
    .catch(() => {
      gallery.innerHTML = '';
      loadMore.classList.add('is-hidden');
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
}

loadMore.addEventListener('click', onLoadMoreClick);
function onLoadMoreClick() {
  page += 1;
  loadedImages += imagesPerPage;

  fetchImages(request)
    .then(photos => {
      if (loadedImages >= photos.total) {
        throw new Error();
      }
      renderGallery(photos);
      slideShow.refresh();
      //   windowAutoScroll();
    })
    .catch(() => {
      loadMore.disabled = true;
      loadMore.classList.add('is-disabled');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    });
}

async function fetchImages(request) {
  return fetch(
    `https://pixabay.com/api/?key=29601825-65f79e377599d679ceb963779&q=${request}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${imagesPerPage}`
  )
    .then(response => {
      return response.json();
    })
    .then(parsedData => {
      if (parsedData.total === 0) {
        throw new Error();
      }
      return parsedData;
    });
}

function renderGallery(photos) {
  console.log(photos);
  let markUp = '';
  let size = '';

  photos.hits.forEach(photo => {
    if (photo.webformatHeight <= (photo.webformatWidth / 3) * 2) {
      size = 'height';
    } else {
      size = 'width';
    }

    markUp += `<a href="${photo.largeImageURL}">
      <div class="photo-card">
        <div class="photo-thumb">
            <img src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" style="${size}:100%"/>
        </div>
        <div class="info">
            <p class="info-item">
                <b>Likes</b>${photo.likes}
            </p>
            <p class="info-item">
                <b>Views</b>${photo.views}
            </p>
            <p class="info-item">
                <b>Comments</b>${photo.comments}
            </p>
            <p class="info-item">
                <b>Downloads</b>${photo.downloads}
            </p>
        </div>
      </div>
      </a>`;
  });

  gallery.insertAdjacentHTML('beforeend', markUp);
}

function windowAutoScroll() {
  //   console.log(document.querySelector('.gallery').firstElementChild);
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 3,
    behavior: 'smooth',
  });
}
