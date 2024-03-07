const fs = require('fs');

const loadData = (filepath) => {
    try {
        const data = fs.readFileSync(filepath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

const saveData = (filepath, data) => {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
}

const createRecord = (filepath, newRecord) => {
    const data = loadData(filepath);
    data.push(newRecord);
    saveData(filepath, data);
    return true;
}

const getAllRecords = (filepath) => {
    return loadData(filepath);
}

const getByEmail = (filepath, email) => {
    const data = loadData(filepath);
    const index = data.findIndex(record => record.email === email);
    return index !== -1 ? data[index] : {} 
}

const getById = (filepath, id) => {
    const data = loadData(filepath);
    const index = data.findIndex(record => record.id === id);
    return index !== -1 ? data[index] : {} 
}

const updateRecord = (filepath, id, updatedFields) => {
    const data = loadData(filepath);
    const index = data.findIndex(record => record.id === id);
    if (index !== -1) {
        data[index] = { ...data[index], ...updatedFields };
        saveData(filepath, data);
        return true;
    }
    return false;
}

const deleteRecord = (filepath, id) => {
    const data = loadData(filepath);
    const filteredData = data.filter(record => record.id !== id);
    if (filteredData.length !== data.length) {
        saveData(filepath, filteredData);
        return true;
    }
    return false;
}

module.exports = {loadData, saveData, createRecord, getAllRecords, getByEmail, getById, updateRecord, deleteRecord};

