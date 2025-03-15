function captionImage(image) {
    return new Promise((resolve, reject) => { 
        
        fetch('https://sketch2image.netlify.app/test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "image" : image }),
        })
        .then(response => response.text())
        .then(textResponse => {
            if (textResponse.includes("Error")) {
                reject(new Error(textResponse));
                return;
            }
            return resolve(textResponse)
        })
        .catch(error => {
            reject(new Error(error));
            return;
        });
    });
}

export default captionImage;