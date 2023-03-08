import { isSomething } from './is-it';

export function optionalMap<T, K>(
  optionalValue: T | undefined | null,
  mapper: (nonOpt: NonNullable<T>) => K,
): K | undefined {
  return isSomething(optionalValue) ? mapper(optionalValue) : undefined;
}
