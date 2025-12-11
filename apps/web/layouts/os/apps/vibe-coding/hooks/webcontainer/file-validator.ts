'use client';

/**
 * Validate and fix package.json files for WebContainer compatibility
 */
export function validateAndFixFiles(files: Record<string, string>): Record<string, string> {
  const result = { ...files };

  for (const [path, content] of Object.entries(result)) {
    if (path === 'package.json' || path.endsWith('/package.json')) {
      try {
        const pkg = JSON.parse(content);

        // Fix scripts that use bare 'vite' command (causes prompt in WebContainer)
        if (pkg.scripts) {
          let modified = false;
          for (const [scriptName, scriptCmd] of Object.entries(pkg.scripts)) {
            if (typeof scriptCmd === 'string') {
              if (scriptCmd === 'vite' || scriptCmd.startsWith('vite ')) {
                pkg.scripts[scriptName] = scriptCmd.replace(/^vite/, 'npx -y vite');
                modified = true;
                console.log(
                  `[Sandbox Debug] Fixed script "${scriptName}": "${scriptCmd}" -> "${pkg.scripts[scriptName]}"`
                );
              }
            }
          }
          if (modified) {
            result[path] = JSON.stringify(pkg, null, 2);
          }
        }
      } catch {
        console.warn(`[Sandbox Debug] Invalid package.json at ${path}, creating minimal version`);
        result[path] = JSON.stringify(
          {
            name: 'preview-app',
            version: '1.0.0',
            scripts: {
              dev: 'npx -y vite',
              start: 'npx -y vite preview',
              build: 'npx -y vite build',
            },
            dependencies: {},
          },
          null,
          2
        );
      }
    }
  }

  return result;
}

/**
 * Debug helper to log file details
 */
export function debugLogFiles(files: Record<string, string>, label: string): void {
  console.group(`[Sandbox Debug] ${label}`);
  console.log('Total files:', Object.keys(files).length);
  console.log('File list:', Object.keys(files));

  for (const [path, content] of Object.entries(files)) {
    const size = content?.length ?? 0;
    const preview = content?.slice(0, 200) ?? '(empty)';
    console.log(`📄 ${path} (${size} bytes):`);
    console.log(`   Preview: ${preview}${size > 200 ? '...' : ''}`);

    if (path === 'package.json' || path.endsWith('/package.json')) {
      try {
        const pkg = JSON.parse(content);
        console.log('   📦 package.json parsed:', {
          name: pkg.name,
          scripts: pkg.scripts,
          dependencies: Object.keys(pkg.dependencies || {}),
          devDependencies: Object.keys(pkg.devDependencies || {}),
        });
      } catch (e) {
        console.error(`   ❌ package.json parse error:`, e);
      }
    }
  }
  console.groupEnd();
}
