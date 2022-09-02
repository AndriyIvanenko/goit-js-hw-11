export function galleryAutoScroll() {
  //   console.log(
  //     document.querySelector('.gallery').firstElementChild.getBoundingClientRect()
  //       .height
  //   );
  const galleryItemHeight = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect().height;

  window.scrollBy({
    top: galleryItemHeight * 2,
    // top: 2000,
    behavior: 'smooth',
    // behavior: 'auto',
  });
}
