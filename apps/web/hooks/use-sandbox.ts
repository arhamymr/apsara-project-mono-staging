'use client';
import * as api from '@/layouts/os/apps/vibe-coding/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export function useSandbox(sessionId: string | null) {
  const [selectedLanguage, setSelectedLanguage] = useState<
    'python' | 'javascript' | 'typescript'
  >('python');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  // Fetch sandbox logs (on demand only)
  const { data: logsData, refetch: refetchLogs } = useQuery({
    queryKey: ['vibe-coding', 'sandbox', sessionId, 'logs'],
    queryFn: () => api.getSandboxLogs(sessionId!),
    enabled: !!sessionId,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  // Fetch sandbox files (on demand only)
  const {
    data: filesData,
    refetch: refetchFiles,
    isLoading: isLoadingFiles,
  } = useQuery({
    queryKey: ['vibe-coding', 'sandbox', sessionId, 'files'],
    queryFn: () => api.listSandboxFiles(sessionId!, '/'),
    enabled: !!sessionId,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  // Deploy code mutation
  const deployMutation = useMutation({
    mutationFn: (files: Record<string, string>) =>
      api.deploySandbox(sessionId!, files),
    onSuccess: () => {
      refetchFiles();
      refetchLogs();
    },
  });

  // Execute code mutation
  const executeMutation = useMutation({
    mutationFn: ({
      code,
      language,
    }: {
      code: string;
      language?: 'python' | 'javascript' | 'typescript';
    }) => api.executeCode(sessionId!, code, language || selectedLanguage),
    onSuccess: () => {
      // Refetch logs after execution
      refetchLogs();
    },
  });


  // Run command mutation
  const runCommandMutation = useMutation({
    mutationFn: ({
      command,
      workingDirectory,
    }: {
      command: string;
      workingDirectory?: string;
    }) => api.runCommand(sessionId!, command, workingDirectory),
    onSuccess: (_, variables) => {
      setCommandHistory((prev) => [...prev, variables.command]);
      // Refetch logs after command execution
      refetchLogs();
    },
  });

  // Read file mutation
  const readFileMutation = useMutation({
    mutationFn: (path: string) => api.readSandboxFile(sessionId!, path),
  });

  // Write file mutation
  const writeFileMutation = useMutation({
    mutationFn: ({ path, content }: { path: string; content: string }) =>
      api.writeSandboxFile(sessionId!, path, content),
    onSuccess: () => {
      refetchFiles();
    },
  });

  // Get file info mutation
  const getFileInfoMutation = useMutation({
    mutationFn: (path: string) => api.getFileInfo(sessionId!, path),
  });

  // List files mutation
  const listFilesMutation = useMutation({
    mutationFn: (path: string) => api.listSandboxFiles(sessionId!, path),
  });

  // Terminate sandbox mutation
  const terminateMutation = useMutation({
    mutationFn: () => api.terminateSandbox(sessionId!),
  });

  return {
    logs: logsData?.logs || [],
    files: filesData?.files.filter((f) => f.path.startsWith('/code')) || [],
    selectedLanguage,
    commandHistory,
    setSelectedLanguage,
    deploy: (files: Record<string, string>) =>
      deployMutation.mutateAsync(files),
    execute: (
      code: string,
      language?: 'python' | 'javascript' | 'typescript',
    ) => executeMutation.mutateAsync({ code, language }),
    runCommand: (command: string, workingDirectory?: string) =>
      runCommandMutation.mutateAsync({ command, workingDirectory }),
    readFile: (path: string) => readFileMutation.mutateAsync(path),
    writeFile: (path: string, content: string) =>
      writeFileMutation.mutateAsync({ path, content }),
    getFileInfo: (path: string) => getFileInfoMutation.mutateAsync(path),
    listFiles: async (path: string) => {
      const result = await listFilesMutation.mutateAsync(path);
      return result.files.map((file) => ({
        ...file,
        type: file.type as 'file' | 'directory',
      }));
    },
    terminate: () => terminateMutation.mutateAsync(),
    refetchLogs,
    refetchFiles,
    isDeploying: deployMutation.isPending,
    isExecuting: executeMutation.isPending,
    isRunningCommand: runCommandMutation.isPending,
    isTerminating: terminateMutation.isPending,
    isLoadingFiles,
    isReadingFile: readFileMutation.isPending,
    isWritingFile: writeFileMutation.isPending,
    isListingFiles: listFilesMutation.isPending,
    executionResult: executeMutation.data,
    commandResult: runCommandMutation.data,
    fileContent: readFileMutation.data,
  };
}
