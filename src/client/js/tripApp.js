

/* Global Variables */
// Personal API Key for OpenWeatherMap API
//local node url for adding projectData
const addDataURL = 'http://localhost:3000/addWeatherData'
const addTripDataURL = 'http://localhost:3000/addTripData'
const projDataURL = '/all'

const PIXABAY_API_KEY = '14801087-988d62851309b90cbc9d95787'
const PIXABAYURL = 'http://pixabay.com/api/?key='

const darkSkyForcastURL='http://localhost:3000/darkSkyForecast'

//https://pixabay.com/api/?key=14801087-988d62851309b90cbc9d95787&q=yellow+flowers&image_type=photo&pretty=true
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();
//temp values for latest reading
let weatherData = {};
let pixabayDatas = {};
let mostRecentRecord = [];

/* Function called by event listener */

//document.getElementById('generate').addEventListener('click', callOpenWeather);
document.getElementById('submitTrip').addEventListener('click', callPixbay);
document.getElementById('submitDarkSky').addEventListener('click', callDarkSky);



// function postGet(APItemp) {
//     let content = document.getElementById('feelings').value;
//     postData(addDataURL, { temperature: APItemp, date: newDate, userResponse: content });


//     getProjData('http://localhost:3000/all')
//         .then(function (data) {

//             let recID = (data.length - 1);
//             mostRecentRecord = data[recID];

//             document.getElementById('date').innerHTML = 'Date: ' + mostRecentRecord.date;
//             document.getElementById('temp').innerHTML = 'Temperature: ' + mostRecentRecord.temperature;
//             document.getElementById('content').innerHTML = 'Feelings: ' + mostRecentRecord.userResponse;

//         })

// }

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

    postData(addTripDataURL, { id: 1, location: tripDest, date: tripStartDate, nights: tripNights });


    getProjData('http://localhost:3000/all')
        .then(function (data) {
            if (data.length > 0){
            let recID = (data.length -1);
            mostRecentRecord = data[recID];
            console.log(mostRecentRecord);
            } else {
                console.log('no records found');
        }

        })

}


// //function to make API call for openWeather data
// function callOpenWeather(e) {
    
//     getWeatherData(baseURL, document.getElementById('zip').value, apiKey)
//         .then(function (openWeatherData) {
//             postGet(openWeatherData.main.temp);
//         })
// }

// /* Function to GET OpenWeather Data*/
// const getWeatherData = async (baseURL, zip, key) => {
//     const response = await fetch(baseURL + zip + key);

//     try {
//         const openWeatherData = await response.json();
//         weatherData = openWeatherData;
//         return openWeatherData
//     } catch (error) {
//         console.log("error", error);
//     }
// }

//function to make API call for pixabay data
function callPixbay(e) {
    e.preventDefault();
    getPixbayData(PIXABAYURL, PIXABAY_API_KEY,'london')
        .then(function (pixData) {
            postGetTrip(addTripDataURL);
            console.log(pixData);
            if (pixData.totalHits > 0) {
                console.log(pixData.hits[0].largeImageURL);
                document.getElementById('destinationBackgroundImage').style.backgroundImage=`url(` + pixData.hits[0].largeImageURL + `)`;
            }
        })
}

/* Function to GET pixabay Data*/
const getPixbayData = async (pixbaseURL,pixapikey,search) => {
     const response = await fetch(pixbaseURL + pixapikey + `&q=` + search + `&image_type=photo&pretty=true`);

    try {
        const pixData = await response.json();
            pixabayDatas = pixData;
        return pixData
    } catch (error) {
        console.log("error", error);
    }
}


//darksky call for forecast
function callDarkSky(e) {
    e.preventDefault();
    postData(darkSkyForcastURL,{latitude: "37.8267", longitude: "-122.423",time:'2020-01-01'})
        .then(function (darkSkyData) {
            //postGetTrip(addTripDataURL);
            //console.log(darkSkyData);
         if (darkSkyData) {
             console.log(darkSkyData.daily.data[0].summary);
                //document.getElementById('destinationBackgroundImage').style.backgroundImage=`url(` + pixData.hits[0].largeImageURL + `)`;
             }
        })
}

/* Function to GET OpenWeather Data*/
const getDarkSkyData = async (darkSkyBaseURL,darkSkyapiKey, location, dateRange) => {
     const response = await fetch('https://api.darksky.net/forecast/7143d5c152d680540167ed32e7562387/42.3601,-71.0589');

    try {
        const darkSkyData = await response.json();
            darkSkyDatas = darkSkyData;
        return darkSkyData
    } catch (error) {
        console.log("error", error);
    }
}

const postDarkSky = async (url = '', data = {}) => {

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




//export { getTrips, removeTrip,postTrip }
export { getProjData, postData, callPixbay }



