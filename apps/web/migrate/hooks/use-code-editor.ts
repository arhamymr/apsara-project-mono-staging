import { useCallback, useState } from 'react';

export interface EditorState {
  activeFile: string | null;
  files: Record<string, string>;
  modifiedFiles: Set<string>;
  errors: Record<string, string[]>;
}

export function useCodeEditor(initialFiles: Record<string, string> = {}) {
  const [activeFile, setActiveFile] = useState<string | null>(
    Object.keys(initialFiles)[0] || null,
  );
  const [files, setFiles] = useState<Record<string, string>>(initialFiles);
  const [modifiedFiles, setModifiedFiles] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const updateFile = useCallback((path: string, content: string) => {
    setFiles((prev) => ({
      ...prev,
      [path]: content,
    }));
    setModifiedFiles((prev) => new Set(prev).add(path));
  }, []);

  const addFile = useCallback((path: string, content: string = '') => {
    setFiles((prev) => ({
      ...prev,
      [path]: content,
    }));
    setActiveFile(path);
  }, []);

  const removeFile = useCallback(
    (path: string) => {
      setFiles((prev) => {
        const newFiles = { ...prev };
        delete newFiles[path];
        return newFiles;
      });
      setModifiedFiles((prev) => {
        const newModified = new Set(prev);
        newModified.delete(path);
        return newModified;
      });
      if (activeFile === path) {
        const remainingFiles = Object.keys(files).filter((f) => f !== path);
        setActiveFile(remainingFiles[0] || null);
      }
    },
    [activeFile, files],
  );

  const setFileErrors = useCallback((path: string, fileErrors: string[]) => {
    setErrors((prev) => ({
      ...prev,
      [path]: fileErrors,
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const resetModified = useCallback(() => {
    setModifiedFiles(new Set());
  }, []);

  const hasModifications = modifiedFiles.size > 0;
  const hasErrors = Object.keys(errors).length > 0;

  return {
    activeFile,
    files,
    modifiedFiles: Array.from(modifiedFiles),
    errors,
    hasModifications,
    hasErrors,
    setActiveFile,
    updateFile,
    addFile,
    removeFile,
    setFileErrors,
    clearErrors,
    resetModified,
    setFiles,
  };
}
