import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;


const refs = {
    inputForm: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
}
refs.inputForm.addEventListener('input',
debounce(onInputChenge, DEBOUNCE_DELAY));


function onInputChenge() {
    const name = refs.inputForm.value.trim();
    if (name === '') {
        return ((refs.countryList.innerHTML = ''),
        (refs.countryInfo.innerHTML = ''));
    }
    fetchCountries(name)
    .then(response => { 
        refs.countryList.innerHTML = '';
        refs.countryInfo.innerHTML = '';


        if (response.length > 10) {
            Notiflix.Notify.info(
                'Too many matches found. Please enter a more specific name.'
            );
        } else if (response.length < 10 && response.length >= 2) {
            refs.countryList.insertAdjacentHTML(
                'beforeend',
                renderCountryList(response)
            );
        } else {
            refs.countryInfo.insertAdjacentHTML(
                'beforeend',
                renderCountryInfo(response)
            );
        }
        
    })
  .catch(() => {
    Notiflix.Notify.failure('Oops, there is no country with that name');;
});

}

function renderCountryList(contries) {
    return contries
        .map(({ flags, name }) => {
            return `
          <li class="country-list__item">
              <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 50px height = 50px>
              <h2 class="country-list__name">${name.official}</h2>
          </li>
          `;
        })
        .join('');
}

function renderCountryInfo(contries) {
    return contries
        .map(({ flags, name, capital, population, languages }) => { 
            return `
      <img width="50px" height="50px" src='${flags.svg}' 
      alt='${name.official} flag' />
        <ul class="country-info__list">
            <li class="country-info__item"><p><b>Name: </b>${name.official}</p></li>
            <li class="country-info__item"><p><b>Capital: </b>${capital}</p></li>
            <li class="country-info__item"><p><b>Population: </b>${population}</p></li>
            <li class="country-info__item"><p><b>Languages: </b>${Object.values(languages)}</p></li>
        </ul>
        `;
        })
    .join('');
}