'use client';

/**
 * Build rich message content with activity log
 */
export function buildStreamingMessageContent(
  textContent: string,
  currentActivity: string | null,
  files: string[],
  reasoning?: string,
): string {
  let message = '';

  // Add reasoning/thinking if available
  if (reasoning && reasoning.trim()) {
    message += `💭 **Thinking:**\n${reasoning}\n\n`;
  }

  // Add current activity
  if (currentActivity) {
    message += `⚙️ ${currentActivity}\n\n`;
  }

  // Add text content
  if (textContent && textContent.trim()) {
    message += textContent;
  }

  // Add file list if files were created
  if (files.length > 0) {
    message += `\n\n📁 **Files Created:**\n`;
    files.forEach((file) => {
      message += `  • ${file}\n`;
    });
  }

  return message;
}

/**
 * Build final message content with file summary
 */
export function buildFinalMessageContent(
  content: string,
  newFileNames: string[],
): string {
  let fullContent = content || '';

  if (newFileNames.length > 0) {
    const fileList = newFileNames.map((f) => `  • ${f}`).join('\n');
    fullContent += `\n\n📁 **Files Created/Updated:**\n${fileList}`;
  }

  return fullContent;
}
