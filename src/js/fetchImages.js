export async function fetchImages(request, page, imagesPerPage) {
  const response = await fetch(
    `https://pixabay.com/api/?key=29601825-65f79e377599d679ceb963779&q=${request}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${imagesPerPage}`
  );
  const images = await response.json();
  if (images.totalHits === 0) {
    throw new Error();
  }
  return images;
}
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
