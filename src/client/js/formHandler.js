// function handleSubmit(event) {
//     event.preventDefault()
//     let form = document.querySelector('form');
//     let urlText = document.getElementById('nalocationme').value;
//         //clear any previous results
//         document.getElementById('location').textContent = `location: working...`;
//         document.getElementById('Start Date').textContent = `start date: working...`;
//         document.getElementById('end Date').textContent = `End date: working...`;
//         document.getElementById('image').textContent = `image Confidence: working...`;
//         document.getElementById('subjectivity_conf').textContent = `subectivity confidence: working...`;
//         //validate the URL, if it fails do not proceed
//         if (validateURL(urlText) != false) {
//         getData(urlText);
//         form.reset();
//     };

// }




  $(document).ready(function() {
	$( "#locationInput" ).autocomplete({
		source: function( request, response ) {
			$.ajax({
				url: "http://api.geonames.org/searchJSON",
				dataType: "jsonp",
				data: {
					style: "medium",
                    maxRows: 10,
                    username: "amiller2978",
					//country: ["US","FR","DE","GB","IT"],
					featureClass: "P",
					//featureCode: "PPL",
					name_startsWith: request.term
					//name_startsWith: function () { return $("#city").val() }
				},
				success: function( data ) {
					response( $.map( data.geonames, function( item ) {

                        //console.log(item.name);
						return {
							label: item.name + (item.adminName1 ? ", " + item.adminName1 : "") + ", " + item.countryCode,
							value: item.name + (item.adminName1 ? ", " + item.adminName1 : "") + ", " + item.countryCode,
							lat: item.lat,
                            lng: item.lng
                            
                        }
                        
					}));
                }
                

			});
		},
		//Start Search after user types...
		minLength: 3,
		close: function() {
			//UI plugin not removing loading gif, lets force it
            $( '#city' ).removeClass( "ui-autocomplete-loading" );
            console.log(data);
            //document.getElementById('destLat').textContent = `Latitude: ` + item.lat;
        }
	});
  });


//end geonames

//dark sky call

//end dark sky


function handleSubmit(event) {
    event.preventDefault()
    console.log("you pushed the button");
    $("p").hide();


    $.getJSON(['https://api.darksky.net/forecast/7143d5c152d680540167ed32e7562387/-35.5,105.7'], {crossDomain: "True"}, function(forecast) {
        console.log(forecast);
    });

}



//call to the server for NLP
async function getData(url) {
    let response = await fetch('http://localhost:3000/getSentiment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            input: {
                url: `${url}`,
            }
        })
    });
    let newsSentimentData = await response.json();
    try {
        console.log(newsSentimentData);
        document.getElementById('inputURL').textContent = `URL tested: ` + url;
        document.getElementById('polarity').textContent = `Polarity: ` + newsSentimentData.polarity;
        document.getElementById('subjectivity').textContent = `Subjectivity: ` + newsSentimentData.subjectivity;
        //future enhancement add calc to show percentage or provide scale to confidece
        document.getElementById('polarity_conf').textContent = `Polarity Confidence: ` + newsSentimentData.polarity_confidence;
        document.getElementById('subjectivity_conf').textContent = `subectivity confidence: ` + newsSentimentData.subjectivity_confidence;

    } catch (error) {
        console.log(error);
    }
}



/* Global Variables */
// Personal API Key for OpenWeatherMap API
const apiKey = ',us&appid=c2da5b47cc5e697eff5e9c844de10474'
///api.openweathermap.org/data/2.5/weather?zip={zip code},{country code} &appid=b6907d289e10d714a6e88b30761fae22
const baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip='
//local node url for adding projectData
const addDataURL = '/addWeatherData'
const projDataURL = '/all'

let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();
//temp values for latest reading
let weatherData = {};
let mostRecentRecord = [];

/* Function called by event listener */

//document.getElementById('generate').addEventListener('click', callOpenWeather);



function postGet(APItemp) {
    ;
    content = document.getElementById('feelings').value;
    postData(addDataURL, { temperature: APItemp, date: newDate, userResponse: content });


    getProjData('/all')
        .then(function (data) {

            let recID = (data.length - 1);
            mostRecentRecord = data[recID];

            document.getElementById('date').innerHTML = 'Date: ' + mostRecentRecord.date;
            document.getElementById('temp').innerHTML = 'Temperature: ' + mostRecentRecord.temperature;
            document.getElementById('content').innerHTML = 'Feelings: ' + mostRecentRecord.userResponse;

        })

}

//function to make API call for openWeather data
function callOpenWeather(e) {

    getWeatherData(baseURL, document.getElementById('zip').value, apiKey)
        .then(function (openWeatherData) {
            postGet(openWeatherData.main.temp);
        })
}

/* Function to GET OpenWeather Data*/
const getWeatherData = async (baseURL, zip, key) => {
    const response = await fetch(baseURL + zip + key);

    try {
        const openWeatherData = await response.json();
        weatherData = openWeatherData;
        return openWeatherData
    } catch (error) {

        console.log("error", error);
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
};




export { handleSubmit, getData }
