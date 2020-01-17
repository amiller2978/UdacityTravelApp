const express = require('express')
//const {json, urlencoded} = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const PixabayApi = require('node-pixabayclient');
//pixabay node package
//https://www.npmjs.com/package/node-pixabayclient
const PixabayPhotos = new PixabayApi({ apiUrl: "https://pixabay.com/api/" });
const pixabayKey = process.env.PIXABAY_API_KEY;

//let projectData = {};
let pixaBayData = {};

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


///from excercise
/* Empty JS object to act as endpoint for all routes */
//projectData = {};
let data = [];

/* Initialize the main project folder*/
app.use(express.static('website'));

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

//get pixabay image json
var params = {
  key: pixabayKey,
  q: "", // automatically URL-encoded
  image_type: "photo",
};



app.use('/pixabay', async (req, res) => {
  let pixabaySearch = req.body.input.search;
  params.q = pixabaySearch;
  try {
    PixabayPhotos.query(params, function(errors, res, req) {
      if (errors) {
        console.log('One or more errors were encountered:');
        console.log('- ' + errors.join('\n- '));
        return;
      }
      pixaBayData = res;

      return pixaBayData;
    });
    res.status(200).json(pixaBayData)
  } catch (err) {
    next(err)
  }
})