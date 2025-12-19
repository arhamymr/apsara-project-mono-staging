'use client';

import type { StreamEvent } from './types';

/**
 * Parse SSE data line - handles multiple data: entries on same line
 */
export function parseSSELine(line: string): StreamEvent[] {
  const events: StreamEvent[] = [];
  // Split by 'data: ' but keep the delimiter for parsing
  const dataParts = line.split(/(?=data: )/);

  for (const part of dataParts) {
    if (part.startsWith('data: ')) {
      try {
        const jsonStr = part.slice(6).trim();
        if (jsonStr) {
          events.push(JSON.parse(jsonStr));
        }
      } catch {
        // Skip malformed JSON
      }
    }
  }
  return events;
}

/**
 * Process SSE stream buffer and extract complete lines
 */
export function extractCompleteLines(buffer: string): {
  lines: string[];
  remaining: string;
} {
  const lines = buffer.split('\n');
  const remaining = lines.pop() || '';
  return { lines, remaining };
}
