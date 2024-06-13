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
    console.log(packet);
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
                    if(drink['strIngredient' + (i + 1)] == null) break;
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
        console.log('IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII');
        searchResponse = await fetch(apiUrl + "search.php?i=" + packet.search);
        filteredResults = await searchResponse.json();
        resultArray = filteredResults;
    }
    

    //console.log(filteredResults);
    res.json(resultArray);
})

http.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})