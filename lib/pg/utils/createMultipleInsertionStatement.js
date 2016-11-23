"use strict";
const createPrepareStatementForMultipleInsertion_1 = require("./createPrepareStatementForMultipleInsertion");
function default_1(tableName, items, properties, types) {
    return `
		INSERT INTO "${tableName}"
			(${properties.map(propertyName => `"${propertyName}"`).join(', ')})
		VALUES
			${createPrepareStatementForMultipleInsertion_1.default(items, types)}
		
	`;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
//# sourceMappingURL=createMultipleInsertionStatement.js.map