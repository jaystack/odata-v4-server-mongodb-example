export default function (items, item) {
  const index = items.findIndex(doc => doc._id === item._id);
  if (index === -1)
    return items;

  return [
    ...items.slice(0, index),
    item,
    ...items.slice(index+1)
  ];
}