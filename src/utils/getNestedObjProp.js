export const getNestedObjProp = (obj, path) => {
  const pathItems = path.split(/\./g);
  let currentPathIndex = 0;
  let currentPathItem = pathItems[currentPathIndex++];
  let result = obj[currentPathItem];

  while ( typeof result !== 'undefined' && currentPathIndex < pathItems.length ) {
    currentPathItem = pathItems[currentPathIndex++];
    result = typeof result === 'object' ? result[currentPathItem] : undefined;
  }

  return result;
};