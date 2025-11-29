/**
 * Utility functions for formatting and processing code strings
 */

/**
 * Format code string for display by normalizing whitespace and indentation
 * @param code - Raw code string
 * @returns Formatted code string
 */
export function formatCode(code: string): string {
  if (!code) return '';

  // Remove leading/trailing whitespace
  let formatted = code.trim();

  // Find the minimum indentation level (excluding empty lines)
  const lines = formatted.split('\n');
  const nonEmptyLines = lines.filter((line) => line.trim().length > 0);

  if (nonEmptyLines.length === 0) return formatted;

  const minIndent = Math.min(
    ...nonEmptyLines.map((line) => {
      const match = line.match(/^(\s*)/);
      return match && match[1] ? match[1].length : 0;
    }),
  );

  // Remove the minimum indentation from all lines
  if (minIndent > 0) {
    formatted = lines
      .map((line) => {
        if (line.trim().length === 0) return '';
        return line.slice(minIndent);
      })
      .join('\n');
  }

  return formatted;
}

/**
 * Extract import statements from code string
 * @param code - Code string containing imports
 * @returns Array of import statement strings
 */
export function extractImports(code: string): string[] {
  if (!code) return [];

  const imports: string[] = [];
  const lines = code.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Match various import patterns
    if (
      trimmedLine.startsWith('import ') ||
      trimmedLine.startsWith('import{') ||
      trimmedLine.startsWith('import{') ||
      trimmedLine.startsWith('import type ')
    ) {
      imports.push(trimmedLine);
    }
  }

  return imports;
}

/**
 * Remove import statements from code string
 * @param code - Code string
 * @returns Code string without imports
 */
export function removeImports(code: string): string {
  if (!code) return '';

  const lines = code.split('\n');
  const filteredLines = lines.filter((line) => {
    const trimmedLine = line.trim();
    return !(
      trimmedLine.startsWith('import ') ||
      trimmedLine.startsWith('import{') ||
      trimmedLine.startsWith('import type ')
    );
  });

  return filteredLines.join('\n').trim();
}

/**
 * Get the language identifier from a file path
 * @param filePath - File path
 * @returns Language identifier for syntax highlighting
 */
export function getLanguageFromPath(filePath: string): string {
  const extension = filePath.split('.').pop()?.toLowerCase();

  const languageMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'tsx',
    js: 'javascript',
    jsx: 'jsx',
    json: 'json',
    css: 'css',
    scss: 'scss',
    html: 'html',
    md: 'markdown',
    py: 'python',
    php: 'php',
    sql: 'sql',
    sh: 'bash',
    yml: 'yaml',
    yaml: 'yaml',
  };

  return languageMap[extension || ''] || 'typescript';
}

/**
 * Add line numbers to code string
 * @param code - Code string
 * @param startLine - Starting line number (default: 1)
 * @returns Code string with line numbers
 */
export function addLineNumbers(code: string, startLine: number = 1): string {
  if (!code) return '';

  const lines = code.split('\n');
  const maxLineNumberWidth = String(startLine + lines.length - 1).length;

  return lines
    .map((line, index) => {
      const lineNumber = String(startLine + index).padStart(
        maxLineNumberWidth,
        ' ',
      );
      return `${lineNumber} | ${line}`;
    })
    .join('\n');
}

/**
 * Highlight specific lines in code by adding markers
 * @param code - Code string
 * @param highlightLines - Array of line numbers to highlight (1-indexed)
 * @returns Code string with highlight markers
 */
export function highlightLines(code: string, highlightLines: number[]): string {
  if (!code || highlightLines.length === 0) return code;

  const lines = code.split('\n');
  return lines
    .map((line, index) => {
      const lineNumber = index + 1;
      if (highlightLines.includes(lineNumber)) {
        return `> ${line}`; // Add marker for highlighted lines
      }
      return `  ${line}`;
    })
    .join('\n');
}

/**
 * Escape HTML special characters in code
 * @param code - Code string
 * @returns HTML-escaped code string
 */
export function escapeHtml(code: string): string {
  if (!code) return '';

  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Count lines in code string
 * @param code - Code string
 * @returns Number of lines
 */
export function countLines(code: string): number {
  if (!code) return 0;
  return code.split('\n').length;
}

/**
 * Truncate code to a maximum number of lines
 * @param code - Code string
 * @param maxLines - Maximum number of lines
 * @param ellipsis - Text to append when truncated (default: '...')
 * @returns Truncated code string
 */
export function truncateCode(
  code: string,
  maxLines: number,
  ellipsis: string = '...',
): string {
  if (!code) return '';

  const lines = code.split('\n');
  if (lines.length <= maxLines) return code;

  return lines.slice(0, maxLines).join('\n') + '\n' + ellipsis;
}
