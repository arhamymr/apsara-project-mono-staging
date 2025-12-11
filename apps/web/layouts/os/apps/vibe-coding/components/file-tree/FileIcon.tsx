import {
  File,
  FileCode,
  FileCode2,
  FileImage,
  FileJson,
  FileText,
  FileType,
  Settings,
} from 'lucide-react';

interface FileIconProps {
  filename: string;
  size?: number;
}

export function FileIcon({ filename, size = 16 }: FileIconProps) {
  const ext = filename.split('.').pop()?.toLowerCase() || '';

  // TypeScript/JavaScript
  if (['ts', 'tsx'].includes(ext)) {
    return <FileCode2 size={size} className="text-blue-500 shrink-0" />;
  }
  if (['js', 'jsx', 'mjs', 'cjs'].includes(ext)) {
    return <FileCode2 size={size} className="text-yellow-500 shrink-0" />;
  }

  // Web files
  if (['html', 'htm'].includes(ext)) {
    return <FileCode size={size} className="text-orange-500 shrink-0" />;
  }
  if (['css', 'scss', 'sass', 'less'].includes(ext)) {
    return <FileCode size={size} className="text-purple-500 shrink-0" />;
  }

  // Data/Config files
  if (ext === 'json') {
    return <FileJson size={size} className="text-yellow-600 shrink-0" />;
  }
  if (['yaml', 'yml', 'toml'].includes(ext)) {
    return <Settings size={size} className="text-gray-500 shrink-0" />;
  }

  // Images
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico'].includes(ext)) {
    return <FileImage size={size} className="text-green-500 shrink-0" />;
  }

  // Text/Docs
  if (['md', 'mdx', 'txt', 'readme'].includes(ext)) {
    return <FileText size={size} className="text-gray-400 shrink-0" />;
  }

  // Python
  if (ext === 'py') {
    return <FileCode2 size={size} className="text-green-600 shrink-0" />;
  }

  // Other code files
  if (['php', 'rb', 'go', 'rs', 'java', 'c', 'cpp', 'h', 'hpp'].includes(ext)) {
    return <FileCode size={size} className="text-blue-400 shrink-0" />;
  }

  // Config files by name
  if (filename.startsWith('.') || ['config', 'rc'].some((s) => filename.includes(s))) {
    return <Settings size={size} className="text-gray-500 shrink-0" />;
  }

  // Font files
  if (['woff', 'woff2', 'ttf', 'otf', 'eot'].includes(ext)) {
    return <FileType size={size} className="text-pink-500 shrink-0" />;
  }

  return <File size={size} className="text-muted-foreground shrink-0" />;
}
