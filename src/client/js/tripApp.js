/* Global Variables */
const addTripDataURL = 'http://localhost:3000/addTripData'
const getPixabayURL = 'http://localhost:3000/pixabay'
const projDataURL = '/all'
mapboxgl.accessToken = `pk.eyJ1IjoiYW1pbGxlcm1hcGJveCIsImEiOiJjazV5bGVka2owMm5zM2dvNGUzM3Z4eGU3In0.fTOD3XRE5dAnUz5Uqx4npQ`

const darkSkyForcastURL = 'http://localhost:3000/darkSkyForecast'

//Mapbox info
var map = {
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-38.557892,32.600626],
    zoom: 1,
    interactive: false
    };
let thismap = new mapboxgl.Map(map);

var geocoder = new MapboxGeocoder({ // Initialize the geocoder
    accessToken: mapboxgl.accessToken, // Set the access token
    mapboxgl: mapboxgl, // Set the mapbox-gl instance
    types: 'place',
    placeholder: 'enter a location for your trip'
    });
thismap.addControl(geocoder,'top-left');

let geoSearchValue = '';
let geoSearchPlaceNameValue = '';
let geoSearchRegionValue = ''; 


if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').then(function(registration) {
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
  }).catch(function(err) {
    //registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}else {
  console.log('No service-worker on this browser');
}

let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();
//temp values for latest reading
let weatherData = {};
var recID = 0;
let destinationLatLong = {};
let tripLatLongDate = {};
var destinationInputName = {};
var imageURL = ``;



/* Function called by event listener */
//needed to call window onload to make sure resourcew load for testing
function addListeners(){
    document.getElementById('submitTrip').addEventListener('click', submitTrip);
    document.getElementById('tripStartDate').addEventListener('input', callDarkSky);
    //document.getElementsByClassName('mapboxgl-ctrl-geocoder--input')[0].addEventListener('input', doSearch);
    buildMap();
};
    
window.onload = addListeners;


function clearForm(){
    //document.getElementById('destinationName').value = ``;
    //need to clear the search window
    document.getElementById('tripStartDate').value = ``;
    document.getElementById('tripNights').value = ``;
    // Removes the forecast element from the document
    var element = document.getElementById('forecast');
    element.parentNode.removeChild(element);
    geocoder.clear();
    thismap.flyTo({ center: [-38.557892,32.600626],zoom:1 });
    document.getElementById('destinationBackgroundImage').style.backgroundImage = "url('compass-3408928_1920.jpg')";

};

function submitTrip(e) {
    e.preventDefault();
    //get last Id to incirment to next ID
    getProjData('http://localhost:3000/all')
        .then(function (data) {
            if (data.length > 0) {
                recID = (data.length);
                postGetTrip(addTripDataURL);
                return;

            } else {
                recID = 0;
                postGetTrip(addTripDataURL);
                console.log('no records found');
            }

        });


}


function postGetTrip(addTripDataURL) {
    //let tripDest = document.getElementById('destinationName').value;
    let tripDest = geoSearchValue;
    let tripStartDate = document.getElementById('tripStartDate').value;
    let tripNights = document.getElementById('tripNights').value;
    if (tripDest == "") {
        alert("Please enter a destination for your trip")
        return;
    } else if (tripStartDate == "") {
        alert("Please enter a start date for your trip")
        return;
    } else if (tripNights == "") {
        alert("Please enter the number of nights for your trip")
        return;
    } else {



    postData(addTripDataURL, { id: recID, location: tripDest, date: tripStartDate, nights: tripNights });
    alert('Trip submitted!')
    clearForm();
    getProjData('http://localhost:3000/all')
        .then(function (data) {
            if (data.length > 0) {
                recID = (data.length - 1);

            } else {
                console.log('no records found');
            }

        })
    }

}


async function getPixabayData(imageSearch) {
    console.log(`image search input:`+ imageSearch);
    let response = await fetch(getPixabayURL, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            input: {
                search: `${imageSearch}`,
            }
        })
    })
    let pixabayListData = await response.json();
    try {
        if (pixabayListData) {
            return pixabayListData;
        } else {
            console.log(`no data returned for` + imageSearch)
        }
    } catch (error) {
        console.log(error);
    }
}




//function to make API call for pixabay data
function callPixbay(destinationName) {
    console.log(destinationName);
    let pixabayDatas = {};
    imageURL = ``;
    getPixabayData(destinationName)
        .then(function (serverpixData) {

            pixabayDatas = serverpixData;
            if (pixabayDatas.totalHits > 0) {


                imageURL = pixabayDatas.hits[0].largeImageURL;

                document.getElementById('destinationBackgroundImage').style.backgroundImage = `url(` + imageURL + `)`;
                return imageURL;
            } else {
                console.log('no data back from pixabay query')
                document.getElementById('destinationBackgroundImage').style.backgroundImage = url("compass-3408928_1920.jpg");
            }
        })

}



//darksky call for forecast
function callDarkSky(e) {
    e.preventDefault();
    if (geoSearchValue == "") {
        alert("please use the map above to find a location")
        return;
    }
    let weatherInfoDiv = document.createElement('DIV');
    weatherInfoDiv.id = 'WeatherInfoDiv';


    //lat long from location(geonames) the time from the form fields
    tripLatLongDate = destinationLatLong;
    tripLatLongDate["date"] = document.getElementById('tripStartDate').value;
    postData(darkSkyForcastURL, tripLatLongDate)
        .then(function (darkSkyData) {

            if (darkSkyData) {
                if (document.getElementById('WeatherInfoDiv')) {
                    document.getElementById('WeatherInfoDiv').remove();
                }
                let darkSkyWeatherIcon = darkSkyData.daily.data[0].icon;
                console.log(darkSkyWeatherIcon);
                let darSkyHiTemp = darkSkyData.daily.data[0].temperatureHigh;
                let darkSkyLowTemp = darkSkyData.daily.data[0].temperatureLow;
                let darkSkyWeatherText = darkSkyData.daily.data[0].summary;
                let travelDate = document.getElementById('tripStartDate').value;
                var weatherInfoDivHelper = `<div class="weatherInfo" id="forecast">The forecast for ${geoSearchValue} on ${travelDate} is ${darkSkyWeatherText} with a high temperature of ${darSkyHiTemp} and a low temperature of ${darkSkyLowTemp}  <canvas id=${darkSkyWeatherIcon} width="64" height="64"></canvas></div>  `;

                weatherInfoDiv.innerHTML = weatherInfoDivHelper;
                document.getElementById('weather').appendChild(weatherInfoDiv);
                //darksky icon support
                var icons = new Skycons(),
                    list  = [
                    "clear-day", "clear-night", "partly-cloudy-day",
                    "partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind",
                    "fog"
                    ],
                    i;

                    for(i = list.length; i--; )
                    icons.set(list[i], list[i]);

                    icons.play();
                
            } else {
                let darkSkyWeatherElement = document.createElement('P');
                let darkSkyWeatherText = document.createTextNode('No weather data available');
                darkSkyWeatherElement.appendChild(darkSkyWeatherText);
                document.getElementById('weather').appendChild(darkSkyWeatherElement);
            }
        })
}


/* Function to GET Project Data */
const getProjData = async (url = '') => {
    const request = await fetch(url);
    try {
        // Transform into JSON

        const allData = await request.json()
        return allData;
        
    }
    catch (error) {
        console.log("error", error);
        //  handle the error
    }
};


function getcurrentData() {
    //e.preventDefault();
    getProjData('http://localhost:3000/all')
        .then(function (data) {
            if (data.length > 0) {
                recID = (data.length);
                return recID;
            } else {
                recID = 0;
                console.log('no records found');
            }

        })

}

/* Function to POST data */

const postData = async (url = '', data = {}) => {

    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        credentials: 'same-origin', // include, *same-origin
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    try {
        const newData = await response.json();
        return newData
    } catch (error) {
        console.log("error", error);
        //  handle the error
    }
}


function buildMap(){
    
    
    

 

     

    //   thismap.on('moveend', function(e){
    //     console.log('moveend done'); 
    //     console.log(thismap.getCenter());
    //     console.log(e);
        
        
    //  });

    geocoder.on('result', function(ev) {

        geoSearchValue = ev.result.place_name;
        geoSearchPlaceNameValue = ev.result.text;
        geoSearchRegionValue = ev.result.context[0].text;
 
        destinationLatLong = { latitude: thismap.getCenter().lat, longitude: thismap.getCenter().lng };

        callPixbay(geoSearchPlaceNameValue);
      });
}


export { getProjData, postData, callPixbay,getPixabayData ,getcurrentData,submitTrip,callDarkSky,buildMap}



