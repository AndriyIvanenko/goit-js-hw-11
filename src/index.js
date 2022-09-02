import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// import debounce from 'lodash.debounce';

import { fetchImages } from './js/fetchImages';
import { renderGallery } from './js/markupGallery';
import { galleryAutoScroll } from './js/scrollWindow';

const input = document.querySelector('input');
const formSubmit = document.querySelector('.search-form');
const searchBtn = document.querySelector('.search');
const loadMore = document.querySelector('.load-more');
const bottom = document.querySelector('.bottom');
const gallery = document.querySelector('.gallery');

const imagesPerPage = 40;
let page = 1;
let loadedImages = 0;
let totalImages = 0;
let request = '';

gallery.addEventListener('click', onImageClick);
function onImageClick(event) {
  event.preventDefault();
}

const slideShow = new SimpleLightbox('.gallery a');
// console.log(slideShow.elements);

// const mouseWheelHandler = debounce(mouseScrollHandler, 300);
const mouseWheelHandler = onMouseScroll;
gallery.addEventListener('wheel', mouseWheelHandler);
function onMouseScroll(event) {
  // console.log(event.deltaY);
  if (event.deltaY > 0) {
    galleryAutoScroll();
    if (loadedImages < totalImages) {
      LoadMoreImages();
    }
  }
}

formSubmit.addEventListener('submit', searchImages);
function searchImages(event) {
  event.preventDefault();

  page = 1;
  loadedImages = imagesPerPage;
  request = input.value;

  fetchImages(input.value, page, imagesPerPage)
    .then(photos => {
      // console.log(photos.total);
      totalImages = photos.totalHits;
      gallery.innerHTML = '';
      // gallery.addEventListener('wheel', mouseWheelHandler);
      Notiflix.Notify.success(`Hooray! We found ${photos.totalHits} images.`);
      renderGallery(photos, gallery);
      searchBtn.blur();
      loadMore.blur();
      loadMore.classList.remove('is-hidden', 'is-disabled');
      loadMore.disabled = false;
      bottom.classList.remove('is-hidden');
      slideShow.refresh();
    })
    .catch(() => {
      loadMore.classList.add('is-hidden');
      bottom.classList.add('is-hidden');
      searchBtn.blur();
      gallery.innerHTML = '';
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
}

loadMore.addEventListener('click', LoadMoreImages);
function LoadMoreImages() {
  page += 1;
  loadedImages += imagesPerPage;

  fetchImages(request, page, imagesPerPage)
    .then(photos => {
      if (loadedImages >= photos.totalHits) {
        throw new Error();
      }
      renderGallery(photos, gallery);
      slideShow.refresh();
    })
    .catch(() => {
      loadMore.disabled = true;
      loadMore.classList.add('is-disabled');
      // gallery.removeEventListener('wheel', mouseWheelHandler);
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    });
}

// const fetchImages = async request => {
//   const response = await fetch(
//     `https://pixabay.com/api/?key=29601825-65f79e377599d679ceb963779&q=${request}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${imagesPerPage}`
//   );
//   const images = await response.json();
//   if (images.totalHits === 0) {
//     throw new Error();
//   }
//   return images;
// };
// async function fetchImages(request) {
//   return fetch(
//     `https://pixabay.com/api/?key=29601825-65f79e377599d679ceb963779&q=${request}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${imagesPerPage}`
//   )
//     .then(response => {
//       return response.json();
//     })
//     .then(parsedData => {
//       if (parsedData.total === 0) {
//         throw new Error();
//       }
//       return parsedData;
//     });
// }

// function renderGallery(photos) {
//   //   console.log(photos);
//   let markUp = '';
//   let size = '';

//   photos.hits.forEach(photo => {
//     if (photo.webformatHeight <= (photo.webformatWidth / 3) * 2) {
//       size = 'height';
//     } else {
//       size = 'width';
//     }

//     markUp += `<a href="${photo.largeImageURL}">
//       <div class="photo-card">
//         <div class="photo-thumb">
//             <img src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" style="${size}:100%"/>
//         </div>
//         <div class="info">
//             <p class="info-item">
//                 <b>Likes</b>${photo.likes}
//             </p>
//             <p class="info-item">
//                 <b>Views</b>${photo.views}
//             </p>
//             <p class="info-item">
//                 <b>Comments</b>${photo.comments}
//             </p>
//             <p class="info-item">
//                 <b>Downloads</b>${photo.downloads}
//             </p>
//         </div>
//       </div>
//       </a>`;
//   });

//   gallery.insertAdjacentHTML('beforeend', markUp);
// }

// function galleryAutoScroll() {
//   //   console.log(
//   //     document.querySelector('.gallery').firstElementChild.getBoundingClientRect()
//   //       .height
//   //   );
//   const galleryItemHeight = document
//     .querySelector('.gallery')
//     .firstElementChild.getBoundingClientRect().height;

//   window.scrollBy({
//     top: galleryItemHeight * 3,
//     // top: 2000,
//     behavior: 'smooth',
//     // behavior: 'auto',
//   });
// }
