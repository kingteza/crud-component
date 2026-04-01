export function getValueByPath<T = any>(
  obj: T,
  path: (string | number)[] | keyof T
): T[keyof T] | any {
  if (typeof obj !== "object" || obj === null) return obj;
  if (Array.isArray(path)) {
    return path.reduce((acc, curr) => acc[curr], obj);
  }
  return obj[path];
}

export function setValueByPath<T = any>(
  obj: T,
  path: (string | number)[] | keyof T,
  value: any
): T {
  if (typeof obj !== "object" || obj === null) return obj;
  if (Array.isArray(path)) {
    return path.reduce((acc, curr) => acc[curr], obj);
  }
  obj[path] = value;
  return obj;
}
