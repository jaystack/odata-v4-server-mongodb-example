"use strict";
const odata_v4_pg_1 = require("odata-v4-pg");
function extendSelectionWithId(sqlQuery) {
    if (sqlQuery.select === '*')
        return sqlQuery;
    const originalSelections = sqlQuery.select.split(', ');
    const selections = !originalSelections.includes('"Id"') ?
        ['"Id"', ...originalSelections] :
        originalSelections;
    sqlQuery.select = selections.join(', ');
    return sqlQuery;
}
function default_1(query) {
    return extendSelectionWithId(odata_v4_pg_1.createQuery(query));
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
//# sourceMappingURL=createQuery.js.map