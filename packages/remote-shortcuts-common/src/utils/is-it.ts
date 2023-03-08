import { PlainObject, Typeguard } from './types';

export function isSomething<T>(x: T | undefined | null): x is NonNullable<T> {
  return x != null;
}

export function isString<T = unknown>(value: string | T): value is string {
  return typeof value === 'string';
}

export function isBoolean<T = unknown>(value: boolean | T): value is boolean {
  return typeof value === 'boolean';
}

export function isObject(item: unknown): item is PlainObject | readonly unknown[] {
  return item !== null && typeof item === 'object';
}

export function isNonArrayObject(item: unknown): item is NonNullable<PlainObject> {
  return isObject(item) && !Array.isArray(item);
}

export function typeguard<T>(
  ...props: Array<keyof T | [keyof T, (value: unknown) => boolean, boolean?]>
): Typeguard<T> {
  return (object): object is T =>
    isNonArrayObject(object) &&
    props.every((prop) => {
      if (Array.isArray(prop)) {
        const [name, validator, optional = false] = prop;
        const value = object[name as string];
        return isSomething(value) ? validator(value) : optional;
      } else {
        return prop in object;
      }
    });
}
