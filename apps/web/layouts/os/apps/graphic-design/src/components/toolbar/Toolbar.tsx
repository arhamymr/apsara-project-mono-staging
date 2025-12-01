import { Separator } from '@workspace/ui/components/separator';
import {
  Circle,
  Hand,
  Image as ImageIcon,
  MousePointer2,
  PenTool,
  Square,
  Type as TypeIcon,
  Upload,
} from 'lucide-react';
import { useRef } from 'react';

import type { Tool } from '../../core/model';
import { useCanvasStore } from '../../store/canvas.store';
import { ToolButton } from './ToolButton';

export function Toolbar() {
  const activeTool = useCanvasStore((state) => state.activeTool);
  const setTool = useCanvasStore((state) => state.setTool);
  const addNode = useCanvasStore((state) => state.addNode);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectTool = (tool: Tool | 'select' | 'pan') => {
    setTool(tool);
  };

  const handleDragStart = (e: React.DragEvent, tool: Tool) => {
    e.dataTransfer.setData('tool', tool);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      addNode('image', { x: 100, y: 100, src } as any);
    };
    reader.readAsDataURL(file);

    // Reset input
    e.target.value = '';
  };

  return (
    <div className="bg-background/60 flex w-16 shrink-0 flex-col items-center gap-2 border-r p-2 backdrop-blur">
      <ToolButton
        label="Select (V)"
        active={activeTool === 'select'}
        onClick={() => handleSelectTool('select')}
      >
        <MousePointer2 className="h-5 w-5" />
      </ToolButton>
      <ToolButton
        label="Pan (H)"
        active={activeTool === 'pan'}
        onClick={() => handleSelectTool('pan')}
      >
        <Hand className="h-5 w-5" />
      </ToolButton>
      <Separator className="my-1" />
      <ToolButton
        label="Rectangle (R)"
        active={activeTool === 'rect'}
        onClick={() => handleSelectTool('rect')}
        onDragStart={(e) => handleDragStart(e, 'rect')}
      >
        <Square className="h-5 w-5" />
      </ToolButton>
      <ToolButton
        label="Circle (C)"
        active={activeTool === 'circle'}
        onClick={() => handleSelectTool('circle')}
        onDragStart={(e) => handleDragStart(e, 'circle')}
      >
        <Circle className="h-5 w-5" />
      </ToolButton>
      <ToolButton
        label="Text (T)"
        active={activeTool === 'text'}
        onClick={() => handleSelectTool('text')}
        onDragStart={(e) => handleDragStart(e, 'text')}
      >
        <TypeIcon className="h-5 w-5" />
      </ToolButton>
      <ToolButton
        label="Image"
        active={activeTool === 'image'}
        onClick={() => handleSelectTool('image')}
        onDragStart={(e) => handleDragStart(e, 'image')}
      >
        <ImageIcon className="h-5 w-5" />
      </ToolButton>
      <ToolButton
        label="Path (P)"
        active={activeTool === 'path'}
        onClick={() => handleSelectTool('path')}
        onDragStart={(e) => handleDragStart(e, 'path')}
      >
        <PenTool className="h-5 w-5" />
      </ToolButton>

      <Separator className="my-1" />

      <ToolButton
        label="Import Image"
        active={false}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-5 w-5" />
      </ToolButton>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  );
}
