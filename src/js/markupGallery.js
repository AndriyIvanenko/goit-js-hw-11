export function renderGallery(photos, gallery) {
  //   console.log(photos);
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
