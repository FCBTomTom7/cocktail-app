let cocktailName = document.getElementById('cocktail-name');
let cocktailImg = document.getElementById('cocktail-img');
let instructions = document.getElementById('instructions');
let ingredients = document.getElementById('ingredients');
let instructionTitle = document.getElementById('instruction-title');
let ingredientsTitle = document.getElementById('ingredients-title')

let param = window.location.pathname.split('/cocktails/')[1];
const url = "http://localhost:3000";
async function getCocktailData() {
    let response = await fetch(url + '/api/' + param, {method: "GET"});
    let data = await response.json();
    return data;
}

function fillPage(data) {
    if(data.success) {
        document.title = data.name;
        cocktailName.innerHTML = data.name;
        cocktailImg.src = data.img;
        instructions.innerHTML = data.instructions;
        instructionTitle.innerHTML = 'Instructions';
        ingredientsTitle.innerHTML = 'Ingredients';
        for(let i = 0; i < data.measurements.length; i++) {
            let instruction = document.createElement('li');
            instruction.className = 'preview-instruction';
            instruction.innerHTML = (data.measurements[i] !== null 
                ? data.measurements[i].charAt(0).toUpperCase()
                 + data.measurements[i].slice(1)
                  + (data.measurements[i].charAt(data.measurements[i].length - 1) === ' ' ? '' : ' ') : "") 
                  + data.ingredients[i];
            ingredients.appendChild(instruction);
        }
    } else {
        cocktailName.innerHTML = "We don't have data on this drink";
    }
}



async function main() {
    let data = await getCocktailData();
    fillPage(data);
}

main();