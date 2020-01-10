//support for .env vars
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser')
var path = require('path')
const express = require('express')
const app = express();
const cors = require('cors');

//
const PixabayApi = require('node-pixabayclient');
const PixabayPhotos = new PixabayApi({ apiUrl: "https://pixabay.com/api/" });




  const postRequest = './handle';
  const GeoNames = 'api.geonames.org/postalCodeSearchJSON?';
  const darkSky = 'api.darksky.net/forecast';
  const pixabayAPI = 'pixabay.com/api';
  const axios = require('axios');
  const portNumber = 3000;


  app.use(bodyParser.json());
  app.use(cors());
  app.use(express.static('dist'));
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  
  // port for incomming requests
  app.listen(portNumber, () => {
    console.log(`Travel app listening on port: ` + portNumber);
  });
  
  // function to aggrogate the geoNames route, api key and url with zip search
  const _fetchGeoNames = async (username, zipOrCity = '11230') => {
    // we build our data necessary for doing the fetch operation from weather api
    const cityOrPostal = getCityOrPostalCode(zipOrCity);
    const url = `http://${GeoNames}${cityOrPostal}&maxRows=10&username=${username}`;
    return axios.get(url).then(response => {
      return response.data.postalCodes[0];
    });
  };
  
  // geoNames
  // Remember that you have to change your GeoNames URL constant if you do it this way
  const getCityOrPostalCode = zipOrCity => {
    if (/\d/.test(zipOrCity.value)) {
      return 'postalcode=' + zipOrCity;
    } else {
      // Otherwise we simply expect it to be a city, and as above, do validation here if you want to
      return 'placename=' + zipOrCity;
    }
  };
  
  
  app.get('/geoNames', (req, res) => {
    const zip = req.query.zip;
    _fetchGeoNames(process.env.username, zip).then(response => {
      res.end(JSON.stringify(response));
    });
  });
   // darkSky
  // function to aggrogate the Dark Sky route, api key and url with longitude/ latitude search
  const _darkSky = async (key, lat, long, time) => {
    // we build our data necessary for doing the fetch operation from weather api
    const url = `https://${darkSky}/${key}/${lat},${long},${time}`;
  
    return await axios.get(url).then(response => {
      return response.data.daily.data[0];
    });
  };
  
  
  app.get('/darkSky', (req, res) => {
    const time = req.query.time;
    const lat = req.query.latitude;
    const long = req.query.longitude;
  
    _darkSky(process.env.key, lat, long, time).then(response => {
      res.end(JSON.stringify(response));
    });
  });
  
  //Pixabay API
  const _pixabay = async (pixabaykey, image) => {
    // data necessary for doing the fetch operation from pixabay api
    const url = `https://${pixabayAPI}/?key=${pixabaykey}&q=${image}`;
  
    return await axios.get(url).then(response => {
      if (response.data.totalHits != 0) {
        return response.data.hits[0].largeImageURL;
      } else {
        return { error: 'no results' };
      }
    });
  };
  
  // Pixabay Route
  app.get('/pixabay', (req, res) => {
    const picture = req.query.image;
  
    _pixabay(process.env.pixabaykey, picture).then(response => {
      res.end(JSON.stringify(response));
    });
  });
  

///support for GeoNamesAPI
const Geonames = require('geonames.js')


const geonames = new Geonames({
    username: 'amiller2978',
    lan: 'en',
    encoding: 'JSON'
  });



  
  // promise
  // geonames.search({q: 'London',maxRows:10}) //get continents
  // .then(resp => {
  //   console.log(resp.geonames);
  // })
  // .catch(err => console.error(err));




  module.exports = app;