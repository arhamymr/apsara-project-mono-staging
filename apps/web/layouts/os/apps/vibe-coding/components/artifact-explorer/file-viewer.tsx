import { getLanguageFromPath } from '@/lib/file-utils';
import Editor from '@monaco-editor/react';
import { Eye, File, Loader2 } from 'lucide-react';

interface FileViewerProps {
  selectedFile: string | null;
  fileContent: string | undefined;
  isLoading: boolean;
  hasArtifact: boolean;
}

export function FileViewer({
  selectedFile,
  fileContent,
  isLoading,
  hasArtifact,
}: FileViewerProps) {
  if (!selectedFile || !hasArtifact) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <div className="text-center">
          <Eye className="text-muted-foreground mx-auto h-12 w-12" />
          <p className="text-muted-foreground mt-4">
            {hasArtifact
              ? 'Select a file to view its content'
              : 'Select an artifact to explore files'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="bg-muted/50 flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <File size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium">{selectedFile}</span>
        </div>
      </div>
      <div className="flex-1">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Editor
            height="100%"
            language={getLanguageFromPath(selectedFile)}
            value={fileContent || ''}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        )}
      </div>
    </div>
  );
}
