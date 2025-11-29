/**
 * Intent detector for opening apps from natural language commands
 */

export type AppIntent = {
  type: 'open-app';
  appId: string;
  appName: string;
};

type AppMapping = {
  id: string;
  keywords: string[];
  aliases: string[];
};

// Map of apps with their keywords and aliases
const APP_MAPPINGS: AppMapping[] = [
  {
    id: 'articles',
    keywords: ['article', 'artikel', 'post', 'blog'],
    aliases: ['article manager', 'article-manager', 'articles'],
  },
  {
    id: 'notes',
    keywords: ['note', 'notes', 'catatan', 'notepad'],
    aliases: ['notes app', 'note-taking'],
  },
  {
    id: 'settings-hub',
    keywords: ['settings', 'setting', 'pengaturan', 'config', 'konfigurasi'],
    aliases: ['settings hub', 'preferences'],
  },
  {
    id: 'desktop-settings',
    keywords: ['desktop', 'wallpaper', 'background', 'tema', 'theme'],
    aliases: ['desktop settings', 'appearance'],
  },
  {
    id: 'website-builder',
    keywords: ['website', 'site', 'builder', 'web', 'situs'],
    aliases: ['website builder', 'site builder'],
  },
  {
    id: 'vibe-coding',
    keywords: ['code', 'coding', 'kode', 'editor', 'vibe'],
    aliases: ['vibe coding', 'code editor'],
  },
];

/**
 * Detect if user wants to open an app from their message
 */
export function detectAppIntent(message: string): AppIntent | null {
  const normalized = message.toLowerCase().trim();

  // Check for open/launch/buka commands
  const openPatterns = [
    /^(open|launch|start|buka|jalankan)\s+(.+)$/i,
    /^(.+?)\s+(app|aplikasi)$/i,
    /^saya\s+ingin\s+membuka\s+(.+)$/i,
    /^i\s+want\s+to\s+open\s+(.+)$/i,
  ];

  let targetText = '';

  for (const pattern of openPatterns) {
    const match = normalized.match(pattern);
    if (match) {
      // Extract the app name from the match
      targetText = match[match.length - 1] || match[2] || match[1];
      break;
    }
  }

  if (!targetText) {
    return null;
  }

  // Clean up the target text
  targetText = targetText.replace(/\s+(app|aplikasi|the)$/i, '').trim();

  // Find matching app
  for (const mapping of APP_MAPPINGS) {
    // Check exact ID match
    if (mapping.id === targetText) {
      return {
        type: 'open-app',
        appId: mapping.id,
        appName: mapping.keywords[0],
      };
    }

    // Check keywords
    for (const keyword of mapping.keywords) {
      if (targetText.includes(keyword) || keyword.includes(targetText)) {
        return {
          type: 'open-app',
          appId: mapping.id,
          appName: keyword,
        };
      }
    }

    // Check aliases
    for (const alias of mapping.aliases) {
      if (targetText === alias.toLowerCase()) {
        return {
          type: 'open-app',
          appId: mapping.id,
          appName: alias,
        };
      }
    }
  }

  return null;
}

/**
 * Get list of available apps for suggestions
 */
export function getAvailableApps(): string[] {
  return APP_MAPPINGS.map((m) => m.keywords[0]);
}
