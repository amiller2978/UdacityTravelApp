const express = require('express')
const cors = require('cors')
require('dotenv').config()
const fetch = require('node-fetch')
const pixabayKey = process.env.PIXABAY_API_KEY;
const pixabayURL = "https://pixabay.com/api/";


//let projectData = {};
var pixaBayData = {};

// Require Express to run server and routes
/* Express to run server and routes */
/* Start up an instance of app */
const app = express();
const bodyParser = require('body-parser')


//dark-sky node package
//https://www.npmjs.com/package/dark-sky
const DarkSky = require('dark-sky')
const darksky = new DarkSky(process.env.DARKSKY_API_KEY) //

const port = process.env.PORT;
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
// Initialize the main project folder
app.use(express.static('website'));
let data = [];

/* Initialize the main project folder*/
app.use(express.static('website'));

/* Spin up the server*/
const server = app.listen(port, listening);
function listening() {

  console.log(`running on localhost: ${port}`);
};


//GET route;
app.get('/all', sendData);

function sendData(request, response) {
  response.send(data);
};

// POST route
app.post('/add', callBack);

function callBack(req, res) {
  res.send('POST received');
}


app.post('/addTripData', addTripData);

function addTripData(req, res) {
  data.push(req.body);
  console.log(data);

};

app.use('/darkSkyForecast', async (req, res, next) => {
  try {
    const { latitude, longitude, time } = req.body
    const forecast = await darksky
      .options({
        latitude,
        longitude,
        time
      })
      .get()
    res.status(200).json(forecast)
  } catch (err) {
    next(err)
  }
})



const getPixbayData = async url => {
  try {
    const response = await fetch(url);
    const json = await response.json();
    //console.log(json);
    return json;
  } catch (error) {
    console.log(error);
  }
};


app.use('/pixabay', async (req, res) => {
  let pixabaySearch = req.body.input.search;

  pixaBayData = {};
  let pixabaySearchURL = pixabayURL + `?key=` + pixabayKey + `&category=travel&safesearch=true&image_type=photo&q=` + pixabaySearch

  try {
    pixaBayData = getPixbayData(pixabaySearchURL)
    pixaBayData.then(function (result) {

      res.status(200).json(result)
      return result;
    })

  } catch (err) {
    next(err)
  }

}
)

