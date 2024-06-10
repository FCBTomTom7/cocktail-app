require('dotenv').config();
let express = require('express');
let app = express();
let http = require('http').createServer(app);
const PORT = process.env.PORT;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', async (req, res) => {
    res.sendFile(process.cwd() + "/views/index.html");
})

http.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})