"use client"

import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { EditorState, SerializedEditorState } from "lexical"
import { useMemo } from "react"

import { editorTheme } from "@/components/editor/themes/editor-theme"
import { TooltipProvider } from "@workspace/ui/components/tooltip"

import { nodes } from "./nodes"
import { LitePlugins } from "./lite-plugins"
import { Plugins } from "./plugins"

const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes,
  onError: (error: Error) => {
    console.error(error)
  },
}

// Check if serialized state has valid content
function isValidEditorState(state?: SerializedEditorState): boolean {
  if (!state) return false
  if (!state.root) return false
  if (!state.root.children || state.root.children.length === 0) return false
  return true
}

export function Editor({
  editorState,
  editorSerializedState,
  onChange,
  onSerializedChange,
  lite = false,
}: {
  editorState?: EditorState
  editorSerializedState?: SerializedEditorState
  onChange?: (editorState: EditorState) => void
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void
  lite?: boolean
}) {
  // Memoize the initial config to prevent unnecessary re-renders
  const initialConfig = useMemo(() => {
    const config = { ...editorConfig }

    if (editorState) {
      return { ...config, editorState }
    }

    // Only use serialized state if it's valid (has non-empty root)
    if (isValidEditorState(editorSerializedState)) {
      return { ...config, editorState: JSON.stringify(editorSerializedState) }
    }

    // Return config without editorState - Lexical will create default empty state
    return config
  }, [editorState, editorSerializedState])

  return (
    <div className="bg-background overflow-hidden rounded-lg border shadow">
      <LexicalComposer initialConfig={initialConfig}>
        <TooltipProvider>
          {lite ? <LitePlugins /> : <Plugins />}

          <OnChangePlugin
            ignoreSelectionChange={true}
            onChange={(editorState) => {
              onChange?.(editorState)
              onSerializedChange?.(editorState.toJSON())
            }}
          />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  )
}
