import axios from 'axios';

// HTTP-запит
async function getData(data, page) {
  const URL = 'https://pixabay.com/api/';
  const API_KEY = '31292558-14d3c422a36c73095ae1fb7fa';

  const dataApi = await axios.get(`${URL}?key=${API_KEY}&q=${data}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`);
  return dataApi;
}

export default { getData };
