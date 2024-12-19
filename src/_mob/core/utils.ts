export const sortObjs = <T extends Record<string, any>>(obj: T): T => {
    return Object.keys(obj)
      .sort()
      .reduce((acc, key) => {
        return {
          ...acc,
          [key]: obj[key],
        };
      }, {} as T);
  };