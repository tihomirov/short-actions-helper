export function assertExists<T>(value: T, errorMessage: string): asserts value is NonNullable<T> {
  if (value == null) {
    throw new Error(`assertExists: ${errorMessage}`);
  }
}
