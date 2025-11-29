export function formatSize(size?: number | null) {
  if (size === undefined || size === null) return '—';
  if (size === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = size;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  const precision = value >= 10 || index === 0 ? 0 : 1;
  return `${value.toFixed(precision)} ${units[index]}`;
}

export function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString();
  } catch (err) {
    return value;
  }
}
