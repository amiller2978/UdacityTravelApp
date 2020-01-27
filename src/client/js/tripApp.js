/* Global Variables */
const addTripDataURL = 'http://localhost:3000/addTripData'
const getPixabayURL = 'http://localhost:3000/pixabay'
const projDataURL = '/all'


const darkSkyForcastURL = 'http://localhost:3000/darkSkyForecast'


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



//jquery function to handle auto complete for location input
$(document).ready(function () {
    $("#destinationName").autocomplete({
        source: function (request, response) {
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
                success: function (data) {
                    response($.map(data.geonames, function (item) {

                        return {
                            label: item.name + "," + item.adminName1 + "," + item.countryCode,
                            value: item.name + "," + item.adminName1 + "," + item.countryCode,
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
        close: function () {
        },
        change: function () {
        },
        select: function (event, ui) {
            destinationLatLong = { latitude: ui.item.lat, longitude: ui.item.lng };
            destinationInputName = ui.item.name;
            callPixbay(destinationInputName);


        }
    });
});



};
    
window.onload = addListeners;

function clearForm(){
    document.getElementById('destinationName').value = ``;
    document.getElementById('tripStartDate').value = ``;
    document.getElementById('tripNights').value = ``;
};

function submitTrip(e) {
    e.preventDefault();
    //get last Id to incirment to next ID
    getProjData('http://localhost:3000/all')
        .then(function (data) {
            if (data.length > 0) {
                recID = (data.length);
                postGetTrip(addTripDataURL);
                alert('Trip submitted!')
                clearForm();
                return;

            } else {
                recID = 0;
                postGetTrip(addTripDataURL);
                console.log('no records found');
            }

        });


}


function postGetTrip(addTripDataURL) {
    let tripDest = document.getElementById('destinationName').value;
    if (tripDest == "") {
        alert("Please enter a destination for your trip")
        return;
    }
    let tripStartDate = document.getElementById('tripStartDate').value;
    if (tripStartDate == "") {
        alert("Please enter a start date for your trip")
        return;
    }
    let tripNights = document.getElementById('tripNights').value;
    if (tripNights == "") {
        alert("Please enter the number of nights for your trip")
        return;
    }

    postData(addTripDataURL, { id: recID, location: tripDest, date: tripStartDate, nights: tripNights });


    getProjData('http://localhost:3000/all')
        .then(function (data) {
            if (data.length > 0) {
                recID = (data.length - 1);

            } else {
                console.log('no records found');
            }

        })

}


async function getPixabayData(imageSearch) {
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
                document.getElementById('destinationBackgroundImage').style.backgroundImage = url("../img/compass-3408928_1920.jpg");
            }
        })

}



//darksky call for forecast
function callDarkSky(e) {
    e.preventDefault();

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
                let darSkyHiTemp = darkSkyData.daily.data[0].temperatureHigh;
                let darkSkyLowTemp = darkSkyData.daily.data[0].temperatureLow;
                let darkSkyWeatherText = darkSkyData.daily.data[0].summary;
                let travelDate = document.getElementById('tripStartDate').value;
                var weatherInfoDivHelper = `<div class="weatherInfo">The forecast for ${destinationName.value} on ${travelDate} is ${darkSkyWeatherText} with a high temperature of ${darSkyHiTemp} and a low temperature of ${darkSkyLowTemp} </div>`;

                weatherInfoDiv.innerHTML = weatherInfoDivHelper;
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

export { getProjData, postData, callPixbay,getPixabayData ,getcurrentData,submitTrip,callDarkSky}
//export {getcurrentData}


