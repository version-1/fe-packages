export type SerializeKeysFunc = (data: Record<string | number | symbol, any>) => any;

export const serializeKeys = (cb: (key: string) => string) => {
  return (data: Record<string | number | symbol, any>): any => {
    const keys = Object.keys(data);
    const serialize = serializeKeys(cb)

    return keys.reduce((acc, key) => {
      const value = data[key];
      const newKey = cb(key);

      if (typeof data[key] === "object") {
        let v = data[key]
        v = v ? serialize(v) : v

        return {
          ...acc,
          [newKey]: Array.isArray(data[key]) ? Object.values(v) : v,
        }
      }

      return {
        ...acc,
        [newKey]: value,
      }
    }, {});
  };
}

export const snakeCase = (key: string) => key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
export const camelCase = (key: string) => {
  for (let i = 0; i < key.length; i++) {
    if (key[i] === "_") {
      key = key.slice(0, i) + key[i + 1].toUpperCase() + key.slice(i + 2);
    }
  }

  return key;
};

export const camelCaseKeys = serializeKeys(camelCase);
