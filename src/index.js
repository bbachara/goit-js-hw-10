import { fetchBreeds, fetchCatByBreed } from './cat-api';
import Notiflix from 'notiflix';

const breedSelect = document.querySelector('.breed-select');
const catInfo = document.querySelector('.cat-info');
const loader = document.querySelector('.loader');

const errorParagraph = document.querySelector('.error');
const showError = show => {
  errorParagraph.style.display = show ? 'block' : 'none';
};

showError(false);

try {
  loader.classList.remove('hidden');
  fetchBreeds().then(data => renderSelect(data));
} catch (error) {
  console.log(error);
  showError(true);
}

function renderSelect(breeds) {
  showError(false);
  const markup = breeds
    .map(({ id, name }) => {
      return `<option value="${id}">${name}</option>`;
    })
    .join('');
  breedSelect.insertAdjacentHTML('beforeend', markup);
  loader.classList.add('hidden');
}

breedSelect.addEventListener('change', e => {
  loader.classList.remove('hidden');
  catInfo.innerHTML = '';
  fetchCatByBreed(e.target.value)
    .then(data => {
      if (data && data.length > 0) {
        renderCat(data[0]);
      } else {
        Notiflix.Report.failure(
          'Something went wrong!',
          'No cat data found for this breed. Choose another breed.',
          'Close',
          {
            width: '360px',
            svgSize: '120px',
          }
        );
      }
    })
    .catch(error => {
      console.error('Error fetching cat data:', error);
      showError(true);
    })
    .finally(() => {
      loader.classList.add('hidden');
    });
});

function renderCat(catData) {
  const { url } = catData;
  const { description, name, temperament } = catData.breeds[0];
  catInfo.insertAdjacentHTML(
    'beforeend',
    `<div>
        <h2>${name}</h2>
        <img src="${url}" alt="${name}" />
        <p>${description}</p>
        <p><strong>Temperament:</strong> ${temperament}</p>
    </div>`
  );
}
