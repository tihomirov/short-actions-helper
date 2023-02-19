export function truncate(string: string, maxLength = 20): string {
  return string.length > maxLength ? `${string.substring(0, maxLength)}...` : string;
}
