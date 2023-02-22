export function isSomething<T>(x: T | undefined | null): x is NonNullable<T> {
  return x != null;
}

export function isString<T = unknown>(value: string | T): value is string {
  return typeof value === 'string';
}
