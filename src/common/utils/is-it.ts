export function isSomething<T>(x: T | undefined | null): x is NonNullable<T> {
  return x != null;
}
