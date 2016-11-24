/**
 * This function provides a statement string such as:
 * ($1:int, $2:varchar, $3:boolean),
 * ($2:int, $3:varchar, $4:boolean),
 * ($5:int, $5:varchar, $7:boolean)
 *
 * The parameters are The
 * 	1) the items in Object[] format: [{Id: 1, Name: 'foo', Active: true}]
 * 	2) the types in String[] format: ['int', 'varchar', 'boolean']
 */
"use strict";
function default_1(items, types) {
    const metaColumns = Array.from({ length: Object.keys(items[0]).length });
    return items.map((item, i) => '(' + metaColumns.map((_, j) => `$${i * metaColumns.length + j + 1}`).join(', ') + ')').join(',\n');
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
//# sourceMappingURL=createPrepareStatementForMultipleInsertion.js.map