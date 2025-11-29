export function shortId(len = 8): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, len);
}
