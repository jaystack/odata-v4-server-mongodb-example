function filterNullValues(item) {
  const newItem = {};
  Object.keys(item)
    .filter(key => item[key] !== null)
    .forEach(key => newItem[key] = item[key]);
  return newItem;
}

export default function (data: any): any {
  const rows: any[] = (Array.isArray(data)) ? data : [data];
  return rows.map(row =>
    Object.assign({}, filterNullValues(row))
  );
}