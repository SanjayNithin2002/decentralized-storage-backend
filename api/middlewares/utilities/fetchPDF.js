const fs = require('fs');

const fetchPDF = (url, filepath) => {
    return new Promise((reject, resolve) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    reject({
                        error: "Failed to read pdf",
                        status: response.status
                    })
                }
                return response.arrayBuffer();
            })
            .then(pdfBytes => {
                fs.writeFile(filepath, Buffer.from(pdfBytes), (err, results) => {
                    if (err) {
                        reject({
                            error: err,
                            status: err.status
                        })
                    }
                    else {
                        resolve({
                            message: `Downloaded Succesfuly at ${filepath}`,
                            status: 200
                        })
                    }
                })
            })
            .catch(err => {
                reject({
                    error: err,
                    status: err.status
                })
            }
            );
    })
}

module.exports = fetchPDF;