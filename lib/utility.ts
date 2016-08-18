export function isNullish(value) {
  return value === null || value === undefined || value !== value;
}