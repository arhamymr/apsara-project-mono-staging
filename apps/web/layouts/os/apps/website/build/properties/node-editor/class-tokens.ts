// Utilities for working with Tailwind-like class token strings

export function parseClassTokens(value: string): Set<string> {
  const tokens = value
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
  return new Set(tokens);
}

export function joinTokens(tokens: Set<string>): string {
  return Array.from(tokens).join(' ');
}
