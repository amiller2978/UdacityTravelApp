/* Global Variables */
const addDataURL = 'http://localhost:3000/addWeatherData'
const addTripDataURL = 'http://localhost:3000/addTripData'
const getPixabayURL = 'http://localhost:3000/pixabay'
const projDataURL = '/all'


console.log(process.env.PORT);
//const PIXABAY_API_KEY = '14801087-988d62851309b90cbc9d95787'
//const PIXABAYURL = 'http://pixabay.com/api/?key='

const darkSkyForcastURL='http://localhost:3000/darkSkyForecast'


let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();
//temp values for latest reading
let weatherData = {};
let pixabayDatas = {};
var recID = 0;
let mostRecentRecord = [];
let destinationLatLong = {};
let tripLatLongDate = {};
var destinationInputName = {};

/* Function called by event listener */
//document.getElementById('generate').addEventListener('click', callOpenWeather);
document.getElementById('submitTrip').addEventListener('click', submitTrip);
//document.getElementById('submitTrip').addEventListener('click', test);
//document.getElementById('submitDarkSky').addEventListener('click', callDarkSky);
document.getElementById('tripStartDate').addEventListener('input', callDarkSky);

//jquery function to handle auto complete for location input
$(document).ready(function() {
	$( "#destinationName" ).autocomplete({
		source: function( request, response ) {
			$.ajax({
				url: "http://api.geonames.org/searchJSON",
				dataType: "jsonp",
				data: {
					style: "medium",
                    maxRows: 5,
                    username: "amiller2978",
					featureClass: "P",
					name_startsWith: request.term				
				},
				success: function( data ) {
					 response( $.map( data.geonames, function( item ) {

					 	return {
					         label: item.name + "," + item.adminName1  + "," + item.countryCode,
                             value: item.name + "," + item.adminName1  + "," + item.countryCode,
					 		lat: item.lat,
                             lng: item.lng,
                             name: item.name
                            
                         }
                        
                     }));
                    
                }
                

			});
		},
		//Start Search after user types...
		minLength: 3,
		close: function() {     
        },
        change: function(){  
        },
        select: function(event,ui){
            destinationLatLong = {latitude: ui.item.lat, longitude: ui.item.lng};
            destinationInputName = ui.item.name;
            console.log(destinationLatLong);
            callPixbay(destinationInputName);
            
        }
	});
  });



function submitTrip(e){
    e.preventDefault();
    //get last Id to incirment to next ID
    getcurrentData();
    console.log(recID);
    postGetTrip(addTripDataURL);
}

function postGetTrip(addTripDataURL) {
    let tripDest = document.getElementById('destinationName').value;
    if (tripDest == "") { 
        alert("Please enter a destination for your trip")
    return;} 
    let tripStartDate = document.getElementById('tripStartDate').value;
    if (tripStartDate == "") { 
        alert("Please enter a start date for your trip")
    return;} 
    let tripNights = document.getElementById('tripNights').value;
    if (tripNights == "") { 
        alert("Please enter the number of nights for your trip")
    return;} 
    //console.log(data.length);
    getcurrentData
    postData(addTripDataURL, { id: recID, location: tripDest, date: tripStartDate, nights: tripNights });


    getProjData('http://localhost:3000/all')
        .then(function (data) {
            if (data.length > 0){
            recID = (data.length -1);
            mostRecentRecord = data[recID];
            //console.log(mostRecentRecord);
            } else {
                console.log('no records found');
        }

        })

}


async function getPixabayData(imageSearch) {
    let response = await fetch('http://localhost:3000/pixabay', {
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
});
    let pixabayListData = await response.json();
    try {
        
        console.log(pixabayListData);
        return pixabayListData;
    } catch (error) {
        console.log(error);
    }
}

//function to make API call for pixabay data
function callPixbay(destinationName) {
    //e.preventDefault();
   let pixabayDatas = {};
    getPixabayData(destinationName)
    .then(function (serverpixData) {
        //postGetTrip(addTripDataURL);
        console.log(serverpixData);
        pixabayDatas = serverpixData;
        if (pixabayDatas.totalHits > 0) {
            console.log(pixabayDatas.hits[0].largeImageURL);
            document.getElementById('destinationBackgroundImage').style.backgroundImage=`url(` + pixabayDatas.hits[0].largeImageURL + `)`;
        } else {
            console.log('no data back from pixabay query')
            document.getElementById('destinationBackgroundImage').style.backgroundImage=url("../img/compass-3408928_1920.jpg");
        }
    })
    // getPixbayData(PIXABAYURL, PIXABAY_API_KEY,destinationName)
    //     .then(function (pixData) {
    //         //postGetTrip(addTripDataURL);
    //         console.log(pixData);
    //         pixabayDatas = pixData;
    //         if (pixData.totalHits > 0) {
    //             console.log(pixData.hits[0].largeImageURL);
    //             document.getElementById('destinationBackgroundImage').style.backgroundImage=`url(` + pixData.hits[0].largeImageURL + `)`;
    //         } else {
    //             document.getElementById('destinationBackgroundImage').style.backgroundImage=`url(https://pixabay.com/get/54e3d2404d50ab14f6d1867dda6d49214b6ac3e456567940732e7ed290/airport-2373727_1920.jpg)`;
    //         }
    //     })
}

// /* Function to GET pixabay Data*/
// const getPixbayData = async (pixbaseURL,pixapikey,search) => {
//     console.log(pixbaseURL + pixapikey + `&q=` + search + `&category=travel&image_type=photo&pretty=true`);
//      const response = await fetch(pixbaseURL + pixapikey + `&q=` + search + `&category=travel&image_type=photo&pretty=true`);

//     try {
//         const pixData = await response.json();
//             pixabayDatas = pixData;
//         return pixData
//     } catch (error) {
//         console.log("error", error);
//     }
// }


//darksky call for forecast
function callDarkSky(e) {
    e.preventDefault();
    
    let weatherInfoDiv = document.createElement('DIV');
    weatherInfoDiv.id = 'WeatherInfoDiv';
    
    //console.log(document.getElementById('WeatherInfoDiv').innerHTML)



    //lat long should come from the location(geonames) the time from the form fields
    //need logic for different timescales
    console.log(destinationInputName);
    if (destinationInputName !== {}){
        console.log('not null')
    }
    tripLatLongDate = destinationLatLong;
    tripLatLongDate["date"] = document.getElementById('tripStartDate').value;
    console.log(tripLatLongDate);
    postData(darkSkyForcastURL,tripLatLongDate)
        .then(function (darkSkyData) {
            
         if (darkSkyData) {
            if (document.getElementById('WeatherInfoDiv')) {
                document.getElementById('WeatherInfoDiv').remove();
            }
            let darkSkyWeatherIcon = darkSkyData.daily.data[0].icon; 
            let darSkyHiTemp =  darkSkyData.daily.data[0].temperatureHigh;
            let darkSkyLowTemp = darkSkyData.daily.data[0].temperatureLow;
            let darkSkyWeatherText = darkSkyData.daily.data[0].summary;
            let travelDate = document.getElementById('tripStartDate').value;
            console.log(darkSkyData.daily.data[0].summary, darkSkyWeatherIcon, travelDate);
            var weatherInfoDivHelper = `<div class="weatherInfo">The forecast for ${destinationName.value} on ${travelDate} is ${darkSkyWeatherText} with a high temperature of ${darSkyHiTemp} and a low temperature of ${darkSkyLowTemp} </div>`;
            
            weatherInfoDiv.innerHTML=weatherInfoDivHelper;
            
            console.log(weatherInfoDiv);
             document.getElementById('weather').appendChild(weatherInfoDiv);
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
        console.log(allData);
    }
    catch (error) {
        console.log("error", error);
        //  handle the error
    }
};

function test (e){
    e.preventDefault();
    getcurrentData();
    console.log(recID);
}

function getcurrentData(){
 //e.preventDefault();
  getProjData('http://localhost:3000/all')
    .then(function (data) {
        if (data.length > 0){
        recID = (data.length -1);
        mostRecentRecord = data[recID];
        //console.log(mostRecentRecord);
        console.log(data.length)
        return recID;
        } else {
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

callPixbay('travel');



//export { getTrips, removeTrip,postTrip }
export { getProjData, postData, callPixbay }



