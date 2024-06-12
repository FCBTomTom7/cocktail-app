let searchInput = document.getElementById('search-input');
let searchButton = document.getElementById('search-button');
let searchType = document.getElementById('search-type-input');
let randomButton = document.getElementById('random-button');
let alcoholicFilters = document.getElementsByClassName('alcoholic-input');
let drinkTypeSwitch = document.getElementById('drink-type-switch');
let drinkTypeInput = document.getElementById('drink-type-input');
let cupTypeSwitch = document.getElementById('cup-type-switch');
let cupTypeInput = document.getElementById('cup-type-input');
const url = "http://localhost:3000";

searchInput.addEventListener('keypress', e => {
    if(e.key === 'Enter') {
        search();
    }
})

searchButton.addEventListener('click', () => {
    search();
})

async function search() {
    let searchText = searchInput.value;
    searchInput.value = '';
    let packet = {
        type: searchType.value,
        search: searchText,
        filters: getFilterData()
    }
    let response = await fetch(url + '/api', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(packet)
    });
    let data = await response.json();
    console.log(data);
    // we'll work out what to do with the data later...
}

function getFilterData() {
    let alcoholicFilterArray = [];
    for(let filter of alcoholicFilters) {
        if(filter.checked) alcoholicFilterArray.push(filter.value);
    }

    let drinkType;
    if(drinkTypeSwitch.checked) {
        drinkType = drinkTypeInput.value;
    } else {
        drinkType = false;
    }

    let cupType;
    if(cupTypeSwitch.checked) {
        cupType = cupTypeInput.value;
    } else {
        cupType = false;
    }

    let filters = {
        alcoholic: alcoholicFilterArray,
        drinkType,
        cupType
    }

    return filters;
}