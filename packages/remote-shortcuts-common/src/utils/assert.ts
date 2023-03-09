import { Typeguard } from './types';

export function assertExists<T>(value: T, errorMessage: string): asserts value is NonNullable<T> {
  if (value == null) {
    throw new Error(`assertExists: ${errorMessage}`);
  }
}

export function assertUnreachable(_value: never): never {
  throw new Error(`Statement should be unreachable. Value: ${_value}`);
}

export function assertWithTypeguard<T>(value: unknown, typeguard: Typeguard<T>): asserts value is T {
  if (!typeguard(value)) {
    throw new Error(`assertWithTypeguard: value = ${JSON.stringify(value)}`);
  }
}
