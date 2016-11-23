"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const ramda_1 = require("ramda");
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
function createPrepareStatementForMultipleInsertion(items) {
    const metaColumns = Array.from({ length: Object.keys(items[0]).length });
    return items.map((item, i) => '(' + metaColumns.map((_, j) => `$${i * metaColumns.length + j + 1}`).join(', ') + ')').join(',\n');
    /*return items.map(
                (item, i) => '(' + metaColumns.map(_ => `?`).join(', ') + ')'
            ).join(',\n');*/
}
function default_1(db, tableName, items, propertyNameProjection) {
    return __awaiter(this, void 0, void 0, function* () {
        if (items.length === 0)
            return;
        const properties = propertyNameProjection || Object.keys(items[0]);
        const statement = `INSERT INTO "${tableName}"
							(${properties.map(propName => `"${propName}"`).join(', ')})
						VALUES
							${createPrepareStatementForMultipleInsertion(items)}`;
        const values = ramda_1.flatten(items.map(item => properties.map(propName => item[propName])));
        return yield db.query(statement, values);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
//# sourceMappingURL=multipleInsert.js.map