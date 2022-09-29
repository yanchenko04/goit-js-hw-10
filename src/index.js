import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import CountriesApiServises from './fetchCountries';

const DEBOUNCE_DELAY = 300;


const refs = {
  search: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
}

const countriesApiServises = new CountriesApiServises();

refs.search.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(evt) {
  countriesApiServises.queryName = evt.target.value.trim();
  clearInput();

  if (countriesApiServises.queryName === '') {
    return;
  }

  countriesApiServises
    .fetchCountries()
    .then(data => {
      const numberCountrys = data.length;
      if (numberCountrys > 10) {
        matchesCountryInfo();
      }
      if (numberCountrys >= 2 && numberCountrys < 10) {
        countryMarkup(data);
      }
      if (numberCountrys === 1) {
        oneCountryMarkup(data);
      }
    })
    .catch(error => {
      mistakeError();
    });
}

function mistakeError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function matchesCountryInfo() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function countryMarkup(country) {
  const murkup = country
    .map(
      ({ flags: { svg }, name }) => `
      <li class='name-flage'>
        <img class='flage' src=${svg} alt='flag' width=70/>
        <h1 class='country-name'>${name}</h1>
      </li>`
    )
    .join('');

  refs.countryList.insertAdjacentHTML('afterbegin', murkup);
}

function oneCountryMarkup(country) {
  refs.countryList.innerHTML = '';

  let languages = country[0].languages.map(({ name }) => `${name}`).join(', ');

  const murkup = country
    .map(({ flags: { svg }, name, capital, population }) => {
      return `<div class='info-list'>
        <img class='flage' src=${svg} alt='flag' width=70/>
        <h1 class='country-name-info'>${name}</h1>
      </div>
        <p class='name-info'><b>Capital:</b> ${capital}</p>
        <p class='name-info'><b>Population:</b> ${population}</p>
        <p class='name-info'><b>Languages:</b> ${languages}</p>`;
    })
    .join('');
  refs.countryInfo.insertAdjacentHTML('afterbegin', murkup);
}

function clearInput() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}