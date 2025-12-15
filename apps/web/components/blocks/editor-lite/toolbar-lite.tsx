'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHeadingNode, $createQuoteNode, HeadingTagType } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
} from '@lexical/list';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Minus,
  Undo,
  Redo,
  Pilcrow,
} from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@workspace/ui/components/tooltip';

export function ToolbarLite() {
  const [editor] = useLexicalComposerContext();

  const formatHeading = (headingSize: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      }
    });
  };

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b p-1">
      {/* History */}
      <ToolbarButton icon={Undo} tooltip="Undo" onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)} />
      <ToolbarButton icon={Redo} tooltip="Redo" onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)} />

      <Separator orientation="vertical" className="mx-1 !h-6" />

      {/* Block format */}
      <ToolbarButton icon={Pilcrow} tooltip="Paragraph" onClick={formatParagraph} />
      <ToolbarButton icon={Heading1} tooltip="Heading 1" onClick={() => formatHeading('h1')} />
      <ToolbarButton icon={Heading2} tooltip="Heading 2" onClick={() => formatHeading('h2')} />
      <ToolbarButton icon={Heading3} tooltip="Heading 3" onClick={() => formatHeading('h3')} />

      <Separator orientation="vertical" className="mx-1 !h-6" />

      {/* Text format */}
      <ToolbarButton icon={Bold} tooltip="Bold" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')} />
      <ToolbarButton icon={Italic} tooltip="Italic" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')} />
      <ToolbarButton icon={Underline} tooltip="Underline" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')} />
      <ToolbarButton icon={Strikethrough} tooltip="Strikethrough" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')} />
      <ToolbarButton icon={Code} tooltip="Code" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')} />

      <Separator orientation="vertical" className="mx-1 !h-6" />

      {/* Lists */}
      <ToolbarButton icon={List} tooltip="Bullet List" onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)} />
      <ToolbarButton icon={ListOrdered} tooltip="Numbered List" onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)} />
      <ToolbarButton icon={CheckSquare} tooltip="Check List" onClick={() => editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)} />

      <Separator orientation="vertical" className="mx-1 !h-6" />

      {/* Block insert */}
      <ToolbarButton icon={Quote} tooltip="Quote" onClick={formatQuote} />
      <ToolbarButton icon={Minus} tooltip="Divider" onClick={() => editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)} />
    </div>
  );
}

function ToolbarButton({
  icon: Icon,
  tooltip,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tooltip: string;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClick}>
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}
