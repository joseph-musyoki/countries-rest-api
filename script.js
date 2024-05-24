document.addEventListener('DOMContentLoaded', () => {
    const countriesContainer = document.getElementById('countries-container');
    const searchInput = document.getElementById('search');
    const regionFilter = document.getElementById('region-filter');

    let countriesData = [];

    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => {
            countriesData = data;
            displayCountries(countriesData);
        });

    function displayCountries(countries) {
        countriesContainer.innerHTML = '';
        countries.forEach(country => {
            const countryCard = document.createElement('div');
            countryCard.classList.add('country-card');
            countryCard.innerHTML = `
                <img src="${country.flags.svg}" alt="${country.name.common}">
                <h3>${country.name.common}</h3>
                <p>Population: ${country.population.toLocaleString()}</p>
                <p>Region: ${country.region}</p>
                <p>Capital: ${country.capital}</p>
                <button onclick="viewCountryDetail('${country.cca3}')">More Info</button>
            `;
            countriesContainer.appendChild(countryCard);
        });
    }

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredCountries = countriesData.filter(country =>
            country.name.common.toLowerCase().includes(searchTerm)
        );
        displayCountries(filteredCountries);
    });

   
    regionFilter.addEventListener('change', () => {
        const region = regionFilter.value;
        const filteredCountries = region === 'all'
            ? countriesData
            : countriesData.filter(country => country.region === region);
        displayCountries(filteredCountries);
    });
});

function viewCountryDetail(cca3) {
    localStorage.setItem('countryCode', cca3);
    window.location.href = 'detail.html';
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('detail.html')) {
        const countryCode = localStorage.getItem('countryCode');
        const countryDetailContainer = document.getElementById('country-detail');

        fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
            .then(response => response.json())
            .then(data => {
                const country = data[0];
                countryDetailContainer.innerHTML = `
                    <img src="${country.flags.svg}" alt="${country.name.common}">
                    <h1>${country.name.common}</h1>
                    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                    <p><strong>Region:</strong> ${country.region}</p>
                    <p><strong>Subregion:</strong> ${country.subregion}</p>
                    <p><strong>Capital:</strong> ${country.capital}</p>
                    <p><strong>Languages:</strong> ${Object.values(country.languages).join(', ')}</p>
                    <p><strong>Borders:</strong> ${country.borders?.join(', ') || 'None'}</p>
                `;
            });
    }
});
