import { FileCode } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full">
        <FileCode className="text-muted-foreground h-10 w-10" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No Artifacts Yet</h3>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm">
        Artifacts are saved versions of your generated code. Ask the agent to
        save your work to create your first artifact.
      </p>
    </div>
  );
}
