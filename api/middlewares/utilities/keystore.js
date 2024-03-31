const storage = require('node-persist');

const initializeStorage = () => {
    return storage.init({
        stringify: JSON.stringify,
        parse: JSON.parse,
    });
}

const storeKey = (keyObj, valueObj) => {
    return initializeStorage()
        .then(() => {
            const keyStr = JSON.stringify(keyObj);
            const valueStr = JSON.stringify(valueObj);
            return storage.setItem(keyStr, valueStr);
        })
        .catch(error => {
            console.error('Error storing data:', error);
            throw error;
        });
}

const retrieveKey = (keyObj) => {
    return initializeStorage()
        .then(() => {
            const keyStr = JSON.stringify(keyObj);
            return storage.getItem(keyStr);
        })
        .then(valueStr => {
            return JSON.parse(valueStr);
        })
        .catch(error => {
            console.error('Error retrieving data:', error);
            throw error; 
        });
}

const deleteKey = (keyObj) => {
    return initializeStorage()
        .then(() => {
            const keyStr = JSON.stringify(keyObj);
            return storage.removeItem(keyStr);
        })
        .catch(error => {
            console.error('Error deleting data:', error);
            throw error; // Rethrow the error to propagate it
        });
}

module.exports = {storeKey, retrieveKey, deleteKey};