const makeUrlFriendly = (filename) => {
    const [fileExt, ...filenameArray] = filename.split('.').reverse();
    const trimmedFilename = filenameArray.reverse().join('.');
    const urlFriendlyFilename = trimmedFilename.replace(/[^a-zA-Z0-9_-]/g, '_') + '.' + fileExt;
    return urlFriendlyFilename;
}

module.exports = makeUrlFriendly;