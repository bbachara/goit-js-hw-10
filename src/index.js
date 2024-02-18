import { fetchBreeds, fetchCatByBreed } from './cat-api';
import Notiflix from 'notiflix';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';

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
  new SlimSelect({
    select: '.breed-select',
    data: breeds.map(({ id, name }) => ({ text: name, value: id })),
  });
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
    `<div class="cat-card">
        <h2>${name}</h2>
        <img class="cat-image" src="${url}" alt="${name}" />
        <p class="text-description">${description}</p>
        <p class="text-temperament"><strong>Temperament:</strong> ${temperament}</p>
    </div>`
  );
}
