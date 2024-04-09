const fs = require('fs');

const fetchPDF = (url, filepath) => {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    console.log('Failed to read pdf from URL.');
                    reject('Failed to read pdf from URL.');
                }
                return response.arrayBuffer();
            })
            .then(pdfBytes => {
                fs.writeFile(filepath, Buffer.from(pdfBytes), (err, results) => {
                    if (err) {
                        console.log(err);
                        console.log('Failed to write pdf in local storage.');
                        reject('Failed to write pdf in local storage.');
                    }
                    else {
                        console.log(`Downloaded Succesfuly at ${filepath}`);
                        resolve(`Downloaded Succesfuly at ${filepath}`);
                    }
                })
            })
            .catch(err => {
                console.log(err);
                console.log('Failed to read pdf from URL.');
                reject('Failed to read pdf from URL.');
            }
            );
    })
}

module.exports = fetchPDF;