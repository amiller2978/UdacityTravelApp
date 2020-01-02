function handleSubmit(event) {
    event.preventDefault()
    let form = document.querySelector('form');
    let urlText = document.getElementById('name').value;
        //clear any previous results
        document.getElementById('inputURL').textContent = `URL tested: working...`;
        document.getElementById('polarity').textContent = `Polarity: working...`;
        document.getElementById('subjectivity').textContent = `Subjectivity: working...`;
        document.getElementById('polarity_conf').textContent = `Polarity Confidence: working...`;
        document.getElementById('subjectivity_conf').textContent = `subectivity confidence: working...`;
        //validate the URL, if it fails do not proceed
        if (validateURL(urlText) != false) {
        getData(urlText);
        form.reset();
    };

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


import { validateURL } from "./validateURL";
export { handleSubmit, getData }
