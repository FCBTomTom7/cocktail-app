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
    if(packet.type === 'cocktail') {
        searchResponse = await fetch(apiUrl + "search.php?s=" + packet.search);
        let unfilteredResults = await searchResponse.json();
        // filter unfilteredResults
        filteredResults = unfilteredResults ? unfilteredResults.drinks.filter(drink => {
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
    } else {
        console.log('IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII');
        searchResponse = await fetch(apiUrl + "search.php?i=" + packet.search);
        filteredResults = await searchResponse.json();
    }
    

    console.log(filteredResults);
    res.json(packet);
})

http.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})