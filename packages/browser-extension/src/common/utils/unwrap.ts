import { assertExists } from './assert';

export function unwrap<T>(value: T | undefined | null, assertMessage: string): T {
  assertExists(value, assertMessage);
  return value;
}
