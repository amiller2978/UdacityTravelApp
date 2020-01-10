const express = require('express')
const {json, urlencoded} = require('body-parser')
const cors = require('cors')
require('dotenv').config()
//onst fetch = require('node-fetch')
//const uuid = require('uuid/v4')
// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
/* Express to run server and routes */
/* Start up an instance of app */
const app = express();

/* Dependencies */
const bodyParser = require('body-parser')
// Start up an instance of app

//dark-sky node package
//https://www.npmjs.com/package/dark-sky
const DarkSky = require('dark-sky')
const darksky = new DarkSky(process.env.DARKSKY_API_KEY) //

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
// Initialize the main project folder
app.use(express.static('website'));


// Setup Server
const openWeatherAPIKEY = 'c2da5b47cc5e697eff5e9c844de10474';

///from excercise
/* Empty JS object to act as endpoint for all routes */
projectData = {};




/* Initialize the main project folder*/
app.use(express.static('website'));

const port = 3000;
/* Spin up the server*/
const server = app.listen(port, listening);
function listening() {
  // console.log(server);
  console.log(`running on localhost: ${port}`);
};

// TODO-ROUTES!

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

// POST an animal
const data = [];

app.post('/addWeatherData', addWeatherData);

function addWeatherData(req, res) {
  data.push(req.body);
  console.log(data);

};

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
 
