"use strict";
function promisifyWithDbName(client) {
    return new Proxy(client, {
        get(target, name) {
            if (name !== 'query')
                return target[name];
            return function (...args) {
                return new Promise((resolve, reject) => {
                    target.query(`USE northwind_mysql_test_db`, (error, res) => {
                        if (error)
                            return reject(error);
                        target.query(...args, (err, result) => {
                            if (err)
                                return reject(err);
                            resolve(result);
                        });
                    });
                });
            };
        }
    });
}
exports.promisifyWithDbName = promisifyWithDbName;
function promisify(client) {
    return new Proxy(client, {
        get(target, name) {
            if (name !== 'query')
                return target[name];
            return function (...args) {
                return new Promise((resolve, reject) => {
                    target.query(...args, (err, result) => {
                        if (err)
                            return reject(err);
                        resolve(result);
                    });
                });
            };
        }
    });
}
exports.promisify = promisify;
function getDeltaObjectInSQL(delta) {
    const deltaKeys = Object.keys(delta);
    if (deltaKeys.length == 1)
        return `${deltaKeys[0]}=${delta[deltaKeys[0]]}`;
    return deltaKeys.reduce((prev, current) => `${prev}=${delta[prev]}, ${current}=${delta[current]}`);
}
exports.getDeltaObjectInSQL = getDeltaObjectInSQL;
function mapDiscontinued(results) {
    return results.map(result => {
        if (!result.hasOwnProperty('Discontinued'))
            return result;
        result.Discontinued = (result.Discontinued == 1) ? true : false;
        return result;
    });
}
exports.mapDiscontinued = mapDiscontinued;
function filterRow(item) {
    const newItem = {};
    Object.keys(item)
        .filter(key => item[key] !== null)
        .forEach(key => newItem[key] = item[key]);
    return newItem;
}
function filterNullValues(rows) {
    return rows.map(row => filterRow(row));
}
exports.filterNullValues = filterNullValues;
function getUpdateParameters(deltaKeys) {
    return deltaKeys.map(key => key + '=?').join();
}
function getObjectValues(delta, deltaKeys) {
    return deltaKeys.map(key => delta[key]);
}
function getPatchQueryString(tableName, delta) {
    const deltaKeys = Object.keys(delta);
    return `UPDATE ${tableName} SET ${getUpdateParameters(deltaKeys)} WHERE Id = ?`;
}
exports.getPatchQueryString = getPatchQueryString;
function getPatchQueryParameters(key, delta) {
    const dataKeys = Object.keys(delta);
    const dataValues = getObjectValues(delta, dataKeys);
    return [...dataValues, key];
}
exports.getPatchQueryParameters = getPatchQueryParameters;
//# sourceMappingURL=utils.js.map