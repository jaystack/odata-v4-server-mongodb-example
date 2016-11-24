import { createQuery } from "odata-v4-pg";

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

export default function(query) {
    return extendSelectionWithId(createQuery(query));
}