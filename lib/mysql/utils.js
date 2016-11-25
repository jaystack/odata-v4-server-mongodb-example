"use strict";
function promisifyWithDdName(client) {
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
exports.promisifyWithDdName = promisifyWithDdName;
function getDeltaObjectInSQL(delta) {
    const deltaKeys = Object.keys(delta);
    if (deltaKeys.length == 1)
        return `${deltaKeys[0]}=${delta[deltaKeys[0]]}`;
    return deltaKeys.reduce((prev, current) => `${prev}=${delta[prev]}, ${current}=${delta[current]}`);
}
exports.getDeltaObjectInSQL = getDeltaObjectInSQL;
function mapDiscontinued(results) {
    return results.map(result => {
        result.Discontinued = (result.Discontinued == 1) ? true : false;
        return result;
    });
}
exports.mapDiscontinued = mapDiscontinued;
function getQuestionMarks(dataKeys) {
    return dataKeys.map(key => '?').join();
}
function getUpdateString(dataKeys) {
    return dataKeys.map(key => key + '=?').join();
}
function getObjectValues(data, dataKeys) {
    return dataKeys.map(key => data[key]);
}
function getUpsertQueryString(key, data) {
    const dataKeys = Object.keys(data);
    return `INSERT INTO Products (Id,${dataKeys.join()}) VALUES (?,${getQuestionMarks(dataKeys)}) ON DUPLICATE KEY UPDATE ${getUpdateString(dataKeys)}`;
}
exports.getUpsertQueryString = getUpsertQueryString;
function getUpsertQueryParameters(key, data) {
    const dataKeys = Object.keys(data);
    const dataValues = getObjectValues(data, dataKeys);
    return [key, ...dataValues, ...dataValues];
}
exports.getUpsertQueryParameters = getUpsertQueryParameters;
//# sourceMappingURL=utils.js.map