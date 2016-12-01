export default function remove(items, _id) {
  const index = items.findIndex(doc => doc._id === _id);
  if (index === -1)
    return items;
  
  return [
    ...items.slice(0, index),
    ...items.slice(index+1)
  ];
}