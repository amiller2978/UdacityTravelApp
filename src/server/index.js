//support for .env vars
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser')
var path = require('path')
const express = require('express')


///support for alyien API
var AYLIENTextAPI = require('aylien_textapi');

var textAPI = new AYLIENTextAPI({
    application_id: process.env.API_ID,
    application_key: process.env.API_KEY
});


//consider moving port to .env and then client can read it
let port = 3000
const app = express()
// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(express.static('dist'))
//console.log(__dirname)


app.listen(port, function () {
    console.log(`App listening on port:` + port)
})

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})


//main function this goes to Aylien to get the info and returns it to the client



app.post('/getSentiment', (request, response) => {
    const inputURL = request.body.input.url;
    console.log("Request to '/getSentiment' for url: ", inputURL);
    textAPI.sentiment({ url: `${inputURL}` }, (error, result, remaining) => {
        console.log("Aylien Data",
            result,
            remaining);
        response.send(result);
    });
});