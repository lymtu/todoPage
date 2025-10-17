function partialDeepClone(obj, level = 1, hash = new WeakMap()) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (hash.has(obj)) {
    return hash.get(obj);
  }

  if (level === 0) {
    return obj;
  }

  let cloneObj = Array.isArray(obj) ? [] : {};
  hash.set(obj, cloneObj);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloneObj[key] = partialDeepClone(obj[key], level - 1, hash);
    }
  }

  return cloneObj;
}

export { partialDeepClone };
