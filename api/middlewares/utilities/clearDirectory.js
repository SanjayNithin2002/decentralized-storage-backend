const fs = require('fs');
const path = require('path');

const clearDirectory = (directory) => {
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        const now = Date.now();
        const fiveMinutesAgo = now - (5 * 60 * 1000);

        files.forEach(file => {
            const filePath = path.join(directory, file);

            if (file === 'dont_touch.txt') {
                return;
            }

            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error('Error getting file stats:', err);
                    return;
                }

                if (stats.isFile() && stats.ctimeMs < fiveMinutesAgo) {
                    fs.unlink(filePath, err => {
                        if (err) {
                            console.error('Error deleting file:', err);
                            return;
                        }
                        console.log('Deleted file:', filePath);
                    });
                }
            });
        });
    });
    console.log('Cron Job executed.')
}

module.exports = clearDirectory;
