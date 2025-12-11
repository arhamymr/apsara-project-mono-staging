'use client';

import type { FileSystemTree } from './types';

/**
 * Convert flat file map to WebContainer's nested file tree structure
 */
export function convertToWebContainerFiles(files: Record<string, string>): FileSystemTree {
  const result: FileSystemTree = {};

  for (const [path, content] of Object.entries(files)) {
    const parts = path.split('/').filter(Boolean);
    let current: FileSystemTree = result;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]!;
      const isFile = i === parts.length - 1;

      if (isFile) {
        current[part] = { file: { contents: content } };
      } else {
        if (!current[part]) {
          current[part] = { directory: {} };
        }
        const node = current[part];
        if ('directory' in node) {
          current = node.directory;
        }
      }
    }
  }

  return result;
}

/**
 * Generate a hash of files to detect changes
 */
export function getFilesHash(files: Record<string, string>): string {
  return JSON.stringify(Object.entries(files).sort());
}

/**
 * Check if project has package.json
 */
export function hasPackageJson(files: Record<string, string>): boolean {
  return Object.keys(files).some(f => f === 'package.json' || f.endsWith('/package.json'));
}
