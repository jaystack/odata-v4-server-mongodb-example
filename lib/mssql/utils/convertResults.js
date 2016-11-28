"use strict";
function filterNullValues(item) {
    const newItem = {};
    Object.keys(item)
        .filter(key => item[key] !== null)
        .forEach(key => newItem[key] = item[key]);
    return newItem;
}
function default_1(data) {
    const rows = (Array.isArray(data)) ? data : [data];
    return rows.map(row => Object.assign({}, filterNullValues(row)));
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
//# sourceMappingURL=convertResults.js.map