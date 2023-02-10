export function assertExists<T>(value: T, errorMessage: string): asserts value is NonNullable<T> {
  if (value == null) {
    throw new Error(`assertExists: ${errorMessage}`);
  }
}

export function assertUnreachable(_value: never): never {
  throw new Error(`Statement should be unreachable. Value: ${_value}`);
}
