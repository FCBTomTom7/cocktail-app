let ingredientName = document.getElementById('ingredient-name');
let ingredientImg = document.getElementById('ingredient-img');
let alcoholicTitle = document.getElementById('alcoholic-title');
let alcoholic = document.getElementById('alcoholic');
let abvTitle = document.getElementById('abv-title');
let abv = document.getElementById('abv');
let descTitle = document.getElementById('desc-title');
let desc = document.getElementById('desc');

let param = window.location.pathname.split('/ingredients/')[1];

const ingredientThumb = "https://www.thecocktaildb.com/images/ingredients/";

const url = "http://localhost:3000";
async function getIngredientData() {
    let response = await fetch(url + '/api/i/' + param, {method: "GET"});
    let data = await response.json();
    return data;
}

function fillPage(data) {
    if(data.success) {
        document.title = data.name;
        ingredientName.innerHTML = data.name;
        ingredientImg.src = ingredientThumb + data.name.toLowerCase() + '-Medium.png';
        alcoholicTitle.style.visibility = 'visible';
        alcoholic.innerHTML = data.alcohol ? 'Alcoholic' : 'Non-alcoholic';
        if(data.alcohol) {
            abvTitle.style.visibility = 'visible';
            if(data.abv !== null) {
                abv.innerHTML = data.abv + "%";
            } else {
                abv.innerHTML = "Varies";
            }
        }
        if(data.description !== null) {
            descTitle.innerHTML = 'Description';
            desc.innerHTML = data.description;
        }
    } else {
        ingredientName.innerHTML = "We don't have data on this drink";
    }
}



async function main() {
    let data = await getIngredientData();
    fillPage(data);
}

main();