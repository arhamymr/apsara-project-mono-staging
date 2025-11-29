// Core types for Vibe Coding feature

export type ArtifactStatus = 'draft' | 'validated' | 'tested' | 'applied';
export type SandboxStatus =
  | 'creating'
  | 'provisioning'
  | 'ready'
  | 'executing'
  | 'expired'
  | 'terminated';
export type AnalysisStatus = 'pending' | 'analyzing' | 'complete' | 'failed';

export interface GeneratedArtifact {
  id: string;
  prompt: string;
  files: Record<string, string>; // path => content
  metadata: Record<string, unknown>;
  status: ArtifactStatus;
  sandboxSessionId?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface SandboxSession {
  id: string;
  artifactId: string;
  daytonaWorkspaceId?: string;
  e2bSandboxId?: string;
  status: SandboxStatus;
  environment: Record<string, string>;
  previewUrl?: string;
  createdAt: string;
  expiresAt?: string;
  lastActivityAt?: string | null;
}

export interface ExecutionResult {
  success: boolean;
  output: string;
  errors: string;
  exitCode: number;
  executionTime: number;
  logs: ExecutionLog[];
}

export interface DeploymentResult {
  success: boolean;
  filesWritten: string[];
}

export interface ExecutionLog {
  id: number;
  sessionId: string;
  command: string;
  output: string;
  errors: string;
  exitCode: number;
  executionTime: number;
  createdAt: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: string[];
}

export interface ValidationError {
  file: string;
  line?: number;
  column?: number;
  message: string;
  severity: 'error';
}

export interface ValidationWarning {
  file: string;
  line?: number;
  column?: number;
  message: string;
  severity: 'warning';
}

export interface StyleProfile {
  projectType: string;
  namingConventions: NamingConventions;
  architecturalPatterns: ArchitecturalPatterns;
  dependencies: Record<string, string>;
  fileStructure: string[];
  codeExamples: Record<string, string>;
  lastAnalyzed: string;
}

export interface NamingConventions {
  classNaming: string; // e.g., "PascalCase"
  methodNaming: string; // e.g., "camelCase"
  variableNaming: string; // e.g., "camelCase"
  fileNaming: string; // e.g., "PascalCase.php, kebab-case.tsx"
  namespacePatterns: string[];
}

export interface ArchitecturalPatterns {
  usesRepositoryPattern: boolean;
  usesServiceLayer: boolean;
  usesInertia: boolean;
  controllerPatterns: string[];
  modelPatterns: string[];
  componentPatterns: string[];
}

export interface AnalysisJob {
  jobId: string;
  status: AnalysisStatus;
  progress?: number;
  message?: string;
}

// API Request/Response types
export interface GenerateCodeRequest {
  prompt: string;
  exampleFiles?: string[];
}

export interface GenerateCodeResponse {
  artifactId: string;
  files: Record<string, string>;
  metadata?: Record<string, unknown>;
}

export interface RegenerateCodeRequest {
  feedback: string;
}

export interface CreateSandboxRequest {
  artifactId: string;
}

export interface CreateSandboxResponse {
  sessionId: string;
  status: SandboxStatus;
}

export interface DeployCodeRequest {
  files: Record<string, string>;
}

export interface ExecuteCodeRequest {
  commands: string[];
}

export interface ApplyArtifactResponse {
  success: boolean;
  filesCreated: string[];
  message?: string;
}

export interface ActiveSession {
  artifact: GeneratedArtifact;
  sandbox?: SandboxSession;
  executionResults?: ExecutionResult;
}

// ============================================================================
// Mastra Agent API Types
// ============================================================================

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  toolCalls?: ToolCall[];
  timestamp?: Date | string;
}

export interface ToolCall {
  toolName: string;
  args: Record<string, unknown>;
  result?: unknown;
}

export interface SSEEvent {
  type: 'sandbox' | 'step' | 'complete' | 'error';
  sandboxId?: string;
  created?: boolean;
  reused?: boolean;
  stepType?: string;
  text?: string;
  toolCalls?: ToolCall[];
  response?: string;
  sessionId?: string;
  sandboxCreated?: boolean;
  message?: string;
}

export interface ChatResponse {
  status: 'success' | 'error';
  response?: string;
  sessionId: string;
  sandboxId?: string;
  sandboxCreated?: boolean;
  toolCalls?: ToolCall[];
  message?: string;
  errorType?: string;
}

export interface MastraSandboxInfo {
  sandboxId: string;
  status: 'active' | 'terminated';
  createdAt?: string;
}

export interface FileInfo {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  modified?: string;
}
