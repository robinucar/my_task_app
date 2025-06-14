/**
 * Removes all keys with `undefined` values from an object.
 *
 * @param obj - The object to clean
 * @returns A new object with only defined values
 */
export const stripUndefined = <T extends object>(obj: T): Partial<T> => {
  const result: Partial<T> = {};

  for (const key of Object.keys(obj) as (keyof T)[]) {
    const value = obj[key];
    if (value !== undefined) {
      result[key] = value;
    }
  }

  return result;
};
