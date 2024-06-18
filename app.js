require('dotenv').config();
let express = require('express');
let app = express();
let http = require('http').createServer(app);
const PORT = process.env.PORT;
const apiUrl = "https://www.thecocktaildb.com/api/json/v1/1/"
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', async (req, res) => {
    res.sendFile(process.cwd() + "/views/index.html");
})
app.post('/api', async (req, res) => {
    let packet = req.body;
    let searchResponse;
    let filteredResults;
    let resultArray = [];
    if(packet.type === 'cocktail') {
        searchResponse = await fetch(apiUrl + "search.php?s=" + packet.search);
        let unfilteredResults = await searchResponse.json();
        // filter unfilteredResults
        filteredResults = unfilteredResults.drinks !== null ? unfilteredResults.drinks.filter(drink => {
            // drink type is category
            // cup type is glass    
            let alcoholicFilterPass = false;
            let categoryFilterPass = packet.filters.drinkType ? drink.strCategory === packet.filters.drinkType : true;
            let glassFilterPass = packet.filters.cupType ? drink.strGlass === packet.filters.cupType : true;

            let alcoholicFilters = packet.filters.alcoholic;
            if(alcoholicFilters.length > 0) {
                // there is an alcoholic filter checked
                for(let i = 0; i < alcoholicFilters.length; i++) {
                    if(drink.strAlcoholic === alcoholicFilters[i]) alcoholicFilterPass = true; 
                }
            } else {
                alcoholicFilterPass = true;
            }

            return alcoholicFilterPass && categoryFilterPass && glassFilterPass;
        }) : null;
        if(filteredResults !== null) {
            for(drink of filteredResults) {
                let ingredients = [];
                let measurements = [];
                for(let i = 0; i < 15; i++) {
                    if(drink['strIngredient' + (i + 1)] == null || drink['strIngredient' + (i + 1)] === '') break;
                    ingredients.push(drink['strIngredient' + (i + 1)]);
                    measurements.push(drink['strMeasure' + (i + 1)]);
                }
                resultArray.push({
                    name: drink.strDrink,
                    drinkType: drink.strCategory,
                    cupType: drink.strGlass,
                    instructions: drink.strInstructions,
                    thumbnail: drink.strDrinkThumb,
                    ingredients,
                    measurements,
                    alcoholic: drink.strAlcoholic
                })
            }
        }
    } else {
        searchResponse = await fetch(apiUrl + "search.php?i=" + packet.search);
        filteredResults = await searchResponse.json();
        if(filteredResults.ingredients !== null) {
            filteredResults.ingredients.forEach(ingredient => {
                resultArray.push({
                    name: ingredient.strIngredient,
                    description: ingredient.strDescription,
                    alcohol: ingredient.strAlcohol === "Yes",
                    abv: ingredient.strABV
                })
            })
        }
    }
    

    //console.log(filteredResults);
    res.json(resultArray);
})

app.get('/cocktails/:cocktail', async (req, res) => {
    res.sendFile(process.cwd() + '/views/cocktail.html');
})

app.post('/api/random', async (req, res) => {
    let packet = req.body;
    if(packet.type === "cocktail") {
        let response = await fetch(apiUrl + 'random.php');
        let data = await response.json();
        let drink = data.drinks[0];
        let ingredients = [];
        let measurements = [];
        for(let i = 0; i < 15; i++) {
            if(drink['strIngredient' + (i + 1)] == null || drink['strIngredient' + (i + 1)] === '') break;
            ingredients.push(drink['strIngredient' + (i + 1)]);
            measurements.push(drink['strMeasure' + (i + 1)]);
        }
        res.json({
            name: drink.strDrink,
            drinkType: drink.strCategory,
            cupType: drink.strGlass,
            instructions: drink.strInstructions,
            thumbnail: drink.strDrinkThumb,
            ingredients,
            measurements,
            alcoholic: drink.strAlcoholic
        });
    } else {
        let response = await fetch(apiUrl + 'list.php?i=list');
        let data = await response.json();
        let randomNumber = Math.floor(Math.random() * data.drinks.length); // literally why is this labeled drinks???????
        let ingredientName = data.drinks[randomNumber].strIngredient1;
        response = await fetch(apiUrl + 'search.php?i=' + ingredientName);
        data = await response.json();
        let ingredient = data.ingredients[0];
        res.json({
            name: ingredient.strIngredient,
            description: ingredient.strDescription,
            alcohol: ingredient.strAlcohol === "Yes",
            abv: ingredient.strABV
        })
    }
})

app.get('/api/:cocktail', async (req, res) => {
    let cocktail = req.params.cocktail;
    let response = await fetch(apiUrl + 'search.php?s=' + cocktail);
    let data = await response.json();
    if(data.drinks) {
        let drink = data.drinks[0];
        let ingredients = [];
        let measurements = [];
        for(let i = 0; i < 15; i++) {
            if(drink['strIngredient' + (i + 1)] == null || drink['strIngredient' + (i + 1)] === '') break;
            ingredients.push(drink['strIngredient' + (i + 1)]);
            measurements.push(drink['strMeasure' + (i + 1)]);
        }
        res.json({
            success: true,
            name: drink.strDrink,
            img: drink.strDrinkThumb,
            instructions: drink.strInstructions,
            ingredients,
            measurements
        })
    } else {
        res.json({
            success: false
        })
    }
})

app.get('/ingredients/:ingredient', async (req, res) => {
    res.sendFile(process.cwd() + '/views/ingredient.html');
})

app.get('/api/i/:ingredient', async (req, res) => {
    let ingredient = req.params.ingredient;
    let response = await fetch(apiUrl + "search.php?i=" + ingredient);
    let data = await response.json();
    if(data.ingredients) {
        let ingredient = data.ingredients[0];
        res.json({
            success: true,
            name: ingredient.strIngredient,
            description: ingredient.strDescription,
            alcohol: ingredient.strAlcohol === 'Yes',
            abv: ingredient.strABV
        })
    } else {
        res.json({
            success: false
        })
    }
})



http.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})