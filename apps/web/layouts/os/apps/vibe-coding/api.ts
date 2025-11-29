'use client';

// Stub API functions for vibe-coding sandbox
// These will be implemented when the backend integration is set up

export interface SandboxFile {
  path: string;
  type: 'file' | 'directory';
  size?: number;
  modifiedAt?: string;
}

export interface SandboxLogsResponse {
  logs: string[];
}

export interface SandboxFilesResponse {
  files: SandboxFile[];
}

export interface ExecutionResult {
  output: string;
  error?: string;
  exitCode: number;
}

export interface CommandResult {
  output: string;
  error?: string;
  exitCode: number;
}

export interface FileContent {
  content: string;
  path: string;
}

export interface FileInfo {
  path: string;
  type: 'file' | 'directory';
  size: number;
  modifiedAt: string;
}

// Stub implementations - these will call the actual backend when available
export async function getSandboxLogs(_sessionId: string): Promise<SandboxLogsResponse> {
  return { logs: [] };
}

export async function listSandboxFiles(_sessionId: string, _path: string): Promise<SandboxFilesResponse> {
  return { files: [] };
}

export async function deploySandbox(_sessionId: string, _files: Record<string, string>): Promise<void> {
  // Stub implementation
}

export async function executeCode(
  _sessionId: string,
  _code: string,
  _language: 'python' | 'javascript' | 'typescript'
): Promise<ExecutionResult> {
  return { output: '', exitCode: 0 };
}

export async function runCommand(
  _sessionId: string,
  _command: string,
  _workingDirectory?: string
): Promise<CommandResult> {
  return { output: '', exitCode: 0 };
}

export async function readSandboxFile(_sessionId: string, _path: string): Promise<FileContent> {
  return { content: '', path: _path };
}

export async function writeSandboxFile(
  _sessionId: string,
  _path: string,
  _content: string
): Promise<void> {
  // Stub implementation
}

export async function getFileInfo(_sessionId: string, _path: string): Promise<FileInfo> {
  return {
    path: _path,
    type: 'file',
    size: 0,
    modifiedAt: new Date().toISOString(),
  };
}

export async function terminateSandbox(_sessionId: string): Promise<void> {
  // Stub implementation
}
