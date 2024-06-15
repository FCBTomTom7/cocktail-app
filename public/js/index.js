let searchInput = document.getElementById('search-input');
let searchButton = document.getElementById('search-button');
let searchType = document.getElementById('search-type-input');
let randomButton = document.getElementById('random-button');
let alcoholicFilters = document.getElementsByClassName('alcoholic-input');
let drinkTypeSwitch = document.getElementById('drink-type-switch');
let drinkTypeInput = document.getElementById('drink-type-input');
let cupTypeSwitch = document.getElementById('cup-type-switch');
let cupTypeInput = document.getElementById('cup-type-input');
let searchResults = document.getElementById('search-results');

let previewName = document.getElementById('preview-name');
let previewImage = document.getElementById('preview-image');
let previewInstructions = document.getElementById('instructions-list');
const url = "http://localhost:3000";

searchInput.addEventListener('keypress', e => {
    if(e.key === 'Enter') {
        removeSearchResults();
        search();
    }
})

searchButton.addEventListener('click', () => {
    removeSearchResults();
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

    if(packet.type === 'cocktail') {
        for(drink of data) {
            let mainDiv = document.createElement('a');
            mainDiv.href = '/cocktails/' + drink.name;
            mainDiv.className = 'search-result-wrapper';
            mainDiv.setAttribute('data-drink', JSON.stringify(drink));
            let resultThumb = document.createElement('img');
            resultThumb.src = drink.thumbnail + '/preview';
            resultThumb.className = 'search-result-thumbnail';
            let resultName = document.createElement('h2');
            resultName.innerHTML = drink.name;
            resultName.className = 'search-result-name';
            let resultDrinkType = document.createElement('p');
            resultDrinkType.innerHTML = drink.drinkType;
            resultDrinkType.className = 'search-result-drink-type';
            let resultCupType = document.createElement('p');
            resultCupType.innerHTML = drink.cupType;
            resultCupType.className = 'search-result-cup-type';
            let resultAlcoholic = document.createElement('p');
            resultAlcoholic.innerHTML = drink.alcoholic;
            resultAlcoholic.className = 'search-result-alcoholic';
            mainDiv.appendChild(resultThumb);
            mainDiv.appendChild(resultName);
            mainDiv.appendChild(resultDrinkType);
            mainDiv.appendChild(resultCupType);
            mainDiv.appendChild(resultAlcoholic);
            searchResults.appendChild(mainDiv);
            mainDiv.addEventListener('mouseover', () => {
                //console.log(mainDiv.getAttribute('data-drink'));
                updatePreview(JSON.parse(mainDiv.getAttribute('data-drink')));
            })
        }
        
        
    } else {
        //////////
    }
}

function updatePreview(drink) {
    document.getElementById('instructions-title').style.visibility = 'visible';
    previewName.innerHTML = drink.name;
    previewImage.src = drink.thumbnail + '/preview';
    removeChildElements(previewInstructions);
    for(let i = 0; i < drink.measurements.length; i++) {
        let instruction = document.createElement('li');
        instruction.className = 'preview-instruction';
        instruction.innerHTML = (drink.measurements[i] !== null ? drink.measurements[i].charAt(0).toUpperCase() + drink.measurements[i].slice(1) + (drink.measurements[i].charAt(drink.measurements[i].length - 1) === ' ' ? '' : ' ') : "") + drink.ingredients[i];
        previewInstructions.appendChild(instruction);
    }
}

function removeChildElements(node) {
    for(let i = node.childNodes.length - 1; i >= 0; i--) {
        node.removeChild(node.childNodes[i]);
    }
}

function removeSearchResults() {
    let currentResults = document.getElementsByClassName('search-result-wrapper');
    for(let i = currentResults.length - 1; i >= 0; i--) {
        currentResults[i].remove();
    }
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