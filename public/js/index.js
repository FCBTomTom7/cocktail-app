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
let instructionsTitle = document.getElementById('instructions-title');

let filtersContainer = document.getElementById('filters');
let itemPreviewContainer = document.getElementById('item-preview');

let previewName = document.getElementById('preview-name');
let previewImage = document.getElementById('preview-image');
let previewInstructions = document.getElementById('instructions-list');
let previewAlcoholic = document.getElementById('preview-alcoholic');
let previewAbv = document.getElementById('preview-abv');
let previewDesc = document.getElementById('preview-desc');
let descContainer = document.getElementById('desc-container');
const url = "http://localhost:3000";
const ingredientThumb = "https://www.thecocktaildb.com/images/ingredients/";

randomButton.addEventListener('click', () => {
    randomSearch();
})

if(searchType.value === 'cocktail') {
    showFilters();
} else {
    hideFilters();
}

searchInput.addEventListener('keypress', e => {
    if(e.key === 'Enter') {
        removeSearchResults();
        search();
    }
})

searchType.addEventListener('change', () => {
    if(searchType.value === 'cocktail') {
        showFilters();
    } else {
        hideFilters();
    }
})

function showFilters() {
    filtersContainer.style.visibility = 'visible';
    filtersContainer.style.height = "33%";
    itemPreviewContainer.style.height = "67%";
}

function hideFilters() {
    filtersContainer.style.visibility = 'hidden';
    filtersContainer.style.height = '0';
    itemPreviewContainer.style.height = "100%";
}


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
    // we'll work out what to do with the data later...

    if(packet.type === 'cocktail') {
        for(drink of data) {
            makeCocktailSearchResult(drink);
        }
        
        
    } else {
        //////////
        for(let ingredient of data) {
            makeIngredientSearchResult(ingredient);
        }
    }
}

function updatePreview(drink) {
    instructionsTitle.style.visibility = 'visible';
    descContainer.style.height = '0';
    descContainer.style.padding = '0';
    previewAlcoholic.innerHTML = '';
    previewAbv.innerHTML = '';
    previewDesc.innerHTML = '';
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

function updatePreviewI(ingredient) {
    instructionsTitle.style.visibility = 'hidden';
    descContainer.style.height = '50%';
    descContainer.style.padding = '5px';
    previewName.innerHTML = ingredient.name;
    previewImage.src = ingredientThumb + ingredient.name.toLowerCase() + '-Medium.png';
    removeChildElements(previewInstructions);
    previewAlcoholic.innerHTML = ingredient.alcohol ? "Alcoholic" : "Non-alcoholic";
    if(ingredient.alcohol) {
        previewAbv.innerHTML = ingredient.abv + "%";
    }
    previewDesc.innerHTML = ingredient.description;
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

async function randomSearch() {
    removeChildElements(searchResults);
    let response = await fetch(url + '/api/random', {method: "GET"});
    let drink = await response.json();
    makeCocktailSearchResult(drink);
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

function makeCocktailSearchResult(drink) {
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
    let descriptorContainer = document.createElement('div');
    descriptorContainer.className = 'descriptor-container';
    descriptorContainer.appendChild(resultDrinkType);
    descriptorContainer.appendChild(resultCupType);
    descriptorContainer.appendChild(resultAlcoholic);
    mainDiv.appendChild(resultThumb);
    mainDiv.appendChild(resultName);
    mainDiv.append(descriptorContainer);
    // mainDiv.appendChild(resultDrinkType);
    // mainDiv.appendChild(resultCupType);
    // mainDiv.appendChild(resultAlcoholic);
    searchResults.appendChild(mainDiv);
    mainDiv.addEventListener('mouseover', () => {
        //console.log(mainDiv.getAttribute('data-drink'));
        updatePreview(JSON.parse(mainDiv.getAttribute('data-drink')));
    })
}

function makeIngredientSearchResult(ingredient) {
    let mainA = document.createElement('a');
    mainA.className = 'search-result-wrapper';
    mainA.href = '/ingredients/' + ingredient.name;
    mainA.setAttribute('data-ingredient', JSON.stringify(ingredient));
    let thumb = document.createElement('img');
    thumb.className = 'search-result-thumbnail';
    thumb.src = ingredientThumb + ingredient.name.toLowerCase() + '-Medium.png';
    let ingredientName = document.createElement('h2');
    ingredientName.className = 'search-result-name';
    ingredientName.innerHTML = ingredient.name;
    let alcoholType = document.createElement('p');
    alcoholType.className = 'search-result-drink-type';
    let descContainer = document.createElement('div');
    descContainer.className = 'descriptor-container';
    mainA.appendChild(thumb);
    mainA.appendChild(ingredientName);

    descContainer.appendChild(alcoholType);
    if(ingredient.alcohol) {
        alcoholType.innerHTML = 'Alcoholic';
        let ABV = document.createElement('p');
        ABV.className = 'search-result-cup-type';
        if(ingredient.abv !== null) {
            ABV.innerHTML = ingredient.abv + "%";
        } else {
            ABV.innerHTML = "ABV varies";
        }
        descContainer.appendChild(ABV);
    } else {
        alcoholType.innerHTML = 'Non-alcoholic';
    }
    mainA.appendChild(descContainer);
    searchResults.appendChild(mainA);
    mainA.addEventListener('mouseover', () => {
        updatePreviewI(JSON.parse(mainA.getAttribute('data-ingredient')));
    })
}