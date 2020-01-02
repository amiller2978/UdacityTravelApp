function validateURL(inputURL) {
    let urlRGEX = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
    if (urlRGEX.test(inputURL)) {
        return true
    } else {
        alert(`Your URL fails validation, please enter a valid url to proceed`);
        return false

    }
}

export { validateURL }

