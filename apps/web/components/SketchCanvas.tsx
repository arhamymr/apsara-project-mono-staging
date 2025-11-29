import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Circle,
  Eraser,
  MousePointer,
  Pencil,
  Redo,
  Save,
  Square,
  Trash2,
  Type,
  Undo,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

type Tool =
  | 'select'
  | 'pen'
  | 'line'
  | 'rectangle'
  | 'circle'
  | 'arrow'
  | 'text'
  | 'eraser';

interface Point {
  x: number;
  y: number;
}

interface DrawElement {
  type: Tool;
  points: Point[];
  color: string;
  lineWidth: number;
  text?: string;
}

interface SketchCanvasProps {
  onSave?: (elements: DrawElement[], thumbnail: string) => void;
  initialElements?: DrawElement[];
}

export default function SketchCanvas({
  onSave,
  initialElements = [],
}: SketchCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [elements, setElements] = useState<DrawElement[]>(initialElements);
  const [currentElement, setCurrentElement] = useState<DrawElement | null>(
    null,
  );
  const [history, setHistory] = useState<DrawElement[][]>([initialElements]);
  const [historyStep, setHistoryStep] = useState(0);
  const [selectedElementIndex, setSelectedElementIndex] = useState<
    number | null
  >(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    redrawCanvas();
  }, [elements, selectedElementIndex, tool, isDarkMode, canvasSize]);

  useEffect(() => {
    // Check for dark mode
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    checkDarkMode();

    // Watch for dark mode changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Resize canvas to fit container
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;
        setCanvasSize({ width, height });
      }
    };

    updateCanvasSize();

    // Handle window resize
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for shortcuts we handle
      if (
        (e.ctrlKey || e.metaKey) &&
        ['z', 'y', 's'].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
      }

      // Undo: Ctrl+Z or Cmd+Z
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === 'z' &&
        !e.shiftKey
      ) {
        e.preventDefault();
        undo();
      }

      // Redo: Ctrl+Y or Cmd+Y or Ctrl+Shift+Z
      if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        redo();
      }

      // Save: Ctrl+S or Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave();
      }

      // Delete selected element: Delete or Backspace
      if (
        (e.key === 'Delete' || e.key === 'Backspace') &&
        selectedElementIndex !== null
      ) {
        e.preventDefault();
        const newElements = elements.filter(
          (_, index) => index !== selectedElementIndex,
        );
        setElements(newElements);
        setSelectedElementIndex(null);
        addToHistory(newElements);
      }

      // Escape: Deselect
      if (e.key === 'Escape') {
        setSelectedElementIndex(null);
      }

      // Arrow keys: Move selected element
      if (
        selectedElementIndex !== null &&
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)
      ) {
        e.preventDefault();
        const moveAmount = e.shiftKey ? 10 : 1;
        let deltaX = 0;
        let deltaY = 0;

        switch (e.key) {
          case 'ArrowUp':
            deltaY = -moveAmount;
            break;
          case 'ArrowDown':
            deltaY = moveAmount;
            break;
          case 'ArrowLeft':
            deltaX = -moveAmount;
            break;
          case 'ArrowRight':
            deltaX = moveAmount;
            break;
        }

        moveElement(selectedElementIndex, deltaX, deltaY);
      }

      // Tool shortcuts
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        switch (e.key.toLowerCase()) {
          case 'v':
            setTool('select');
            break;
          case 'p':
            setTool('pen');
            break;
          case 'l':
            setTool('line');
            break;
          case 'r':
            setTool('rectangle');
            break;
          case 'c':
            setTool('circle');
            break;
          case 'a':
            setTool('arrow');
            break;
          case 't':
            setTool('text');
            break;
          case 'e':
            setTool('eraser');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tool, elements, selectedElementIndex, historyStep, history]);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Theme-aware colors
    const bgColor = isDarkMode ? '#1f2937' : '#ffffff';
    const dotColor = isDarkMode ? '#4b5563' : '#d1d5db';

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw dot grid
    const dotSpacing = 20;
    const dotRadius = 1.5;
    ctx.fillStyle = dotColor;

    for (let x = dotSpacing; x < canvas.width; x += dotSpacing) {
      for (let y = dotSpacing; y < canvas.height; y += dotSpacing) {
        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    elements.forEach((element, index) => {
      drawElement(ctx, element);

      // Draw selection box if element is selected
      if (index === selectedElementIndex && tool === 'select') {
        const bounds = getElementBounds(element);
        if (bounds) {
          ctx.strokeStyle = '#3B82F6';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.strokeRect(
            bounds.x - 5,
            bounds.y - 5,
            bounds.width + 10,
            bounds.height + 10,
          );
          ctx.setLineDash([]);
        }
      }
    });
  };

  const drawElement = (ctx: CanvasRenderingContext2D, element: DrawElement) => {
    ctx.strokeStyle = element.color;
    ctx.lineWidth = element.lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    switch (element.type) {
      case 'pen':
        if (element.points.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(element.points[0].x, element.points[0].y);
        element.points.forEach((point) => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
        break;

      case 'line':
      case 'arrow':
        if (element.points.length < 2) return;
        const start = element.points[0];
        const end = element.points[element.points.length - 1];

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

        if (element.type === 'arrow') {
          const angle = Math.atan2(end.y - start.y, end.x - start.x);
          const arrowLength = 15;
          ctx.beginPath();
          ctx.moveTo(end.x, end.y);
          ctx.lineTo(
            end.x - arrowLength * Math.cos(angle - Math.PI / 6),
            end.y - arrowLength * Math.sin(angle - Math.PI / 6),
          );
          ctx.moveTo(end.x, end.y);
          ctx.lineTo(
            end.x - arrowLength * Math.cos(angle + Math.PI / 6),
            end.y - arrowLength * Math.sin(angle + Math.PI / 6),
          );
          ctx.stroke();
        }
        break;

      case 'rectangle':
        if (element.points.length < 2) return;
        const rectStart = element.points[0];
        const rectEnd = element.points[element.points.length - 1];
        ctx.strokeRect(
          rectStart.x,
          rectStart.y,
          rectEnd.x - rectStart.x,
          rectEnd.y - rectStart.y,
        );
        break;

      case 'circle':
        if (element.points.length < 2) return;
        const circleStart = element.points[0];
        const circleEnd = element.points[element.points.length - 1];
        const radius = Math.sqrt(
          Math.pow(circleEnd.x - circleStart.x, 2) +
            Math.pow(circleEnd.y - circleStart.y, 2),
        );
        ctx.beginPath();
        ctx.arc(circleStart.x, circleStart.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
        break;

      case 'text':
        if (element.points.length > 0 && element.text) {
          ctx.font = `${element.lineWidth * 8}px Arial`;
          ctx.fillStyle = element.color;
          ctx.fillText(element.text, element.points[0].x, element.points[0].y);
        }
        break;

      case 'eraser':
        const eraserColor = isDarkMode ? '#1f2937' : '#ffffff';
        ctx.strokeStyle = eraserColor;
        ctx.lineWidth = element.lineWidth * 3;
        if (element.points.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(element.points[0].x, element.points[0].y);
        element.points.forEach((point) => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
        break;
    }
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const getElementBounds = (element: DrawElement) => {
    if (element.points.length === 0) return null;

    const xs = element.points.map((p) => p.x);
    const ys = element.points.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  };

  const isPointInElement = (point: Point, element: DrawElement): boolean => {
    const bounds = getElementBounds(element);
    if (!bounds) return false;

    // Add padding for easier selection
    const padding = 10;
    return (
      point.x >= bounds.x - padding &&
      point.x <= bounds.x + bounds.width + padding &&
      point.y >= bounds.y - padding &&
      point.y <= bounds.y + bounds.height + padding
    );
  };

  const findElementAtPoint = (point: Point): number | null => {
    // Search in reverse order to select topmost element
    for (let i = elements.length - 1; i >= 0; i--) {
      if (isPointInElement(point, elements[i])) {
        return i;
      }
    }
    return null;
  };

  const moveElement = (
    elementIndex: number,
    deltaX: number,
    deltaY: number,
  ) => {
    const newElements = [...elements];
    const element = newElements[elementIndex];

    element.points = element.points.map((point) => ({
      x: point.x + deltaX,
      y: point.y + deltaY,
    }));

    setElements(newElements);
  };

  const deleteSelectedElement = () => {
    if (selectedElementIndex === null) return;
    const newElements = elements.filter(
      (_, index) => index !== selectedElementIndex,
    );
    setElements(newElements);
    setSelectedElementIndex(null);
    addToHistory(newElements);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getMousePos(e);

    if (tool === 'select') {
      const elementIndex = findElementAtPoint(point);
      if (elementIndex !== null) {
        setSelectedElementIndex(elementIndex);
        setIsDragging(true);
        const element = elements[elementIndex];
        const bounds = getElementBounds(element);
        if (bounds) {
          setDragOffset({
            x: point.x - bounds.x,
            y: point.y - bounds.y,
          });
        }
      } else {
        setSelectedElementIndex(null);
      }
      return;
    }

    setIsDrawing(true);
    setSelectedElementIndex(null);

    if (tool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        const newElement: DrawElement = {
          type: tool,
          points: [point],
          color,
          lineWidth,
          text,
        };
        const newElements = [...elements, newElement];
        setElements(newElements);
        addToHistory(newElements);
      }
      setIsDrawing(false);
      return;
    }

    setCurrentElement({
      type: tool,
      points: [point],
      color,
      lineWidth,
    });
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getMousePos(e);

    // Handle dragging selected element
    if (tool === 'select' && isDragging && selectedElementIndex !== null) {
      const element = elements[selectedElementIndex];
      const oldBounds = getElementBounds(element);
      if (oldBounds) {
        const deltaX = point.x - dragOffset.x - oldBounds.x;
        const deltaY = point.y - dragOffset.y - oldBounds.y;
        moveElement(selectedElementIndex, deltaX, deltaY);
      }
      return;
    }

    if (!isDrawing || !currentElement) return;

    if (tool === 'pen' || tool === 'eraser') {
      setCurrentElement({
        ...currentElement,
        points: [...currentElement.points, point],
      });
    } else {
      setCurrentElement({
        ...currentElement,
        points: [currentElement.points[0], point],
      });
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    redrawCanvas();
    if (currentElement.points.length > 0 || point) {
      const tempElement = {
        ...currentElement,
        points:
          tool === 'pen' || tool === 'eraser'
            ? [...currentElement.points, point]
            : [currentElement.points[0], point],
      };
      drawElement(ctx, tempElement);
    }
  };

  const stopDrawing = () => {
    if (tool === 'select' && isDragging) {
      setIsDragging(false);
      addToHistory(elements);
      return;
    }

    if (isDrawing && currentElement && currentElement.points.length > 0) {
      const newElements = [...elements, currentElement];
      setElements(newElements);
      addToHistory(newElements);
    }
    setIsDrawing(false);
    setCurrentElement(null);
  };

  const addToHistory = (newElements: DrawElement[]) => {
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const undo = () => {
    if (historyStep > 0) {
      setHistoryStep(historyStep - 1);
      setElements(history[historyStep - 1]);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep(historyStep + 1);
      setElements(history[historyStep + 1]);
    }
  };

  const clearCanvas = () => {
    if (confirm('Clear all drawings?')) {
      const newElements: DrawElement[] = [];
      setElements(newElements);
      addToHistory(newElements);
    }
  };

  const handleSave = () => {
    if (!onSave) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const thumbnail = canvas.toDataURL('image/png');
    onSave(elements, thumbnail);
  };

  const colors = [
    '#000000',
    '#FF0000',
    '#00FF00',
    '#0000FF',
    '#FFFF00',
    '#FF00FF',
    '#00FFFF',
  ];

  return (
    <div className="relative h-full w-full">
      <div
        ref={containerRef}
        className="h-full w-full overflow-hidden rounded-lg border-2 border-gray-300 dark:border-gray-600"
      >
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className={tool === 'select' ? 'cursor-pointer' : 'cursor-crosshair'}
        />
      </div>

      {/* Keyboard shortcuts hint */}
      {selectedElementIndex !== null && (
        <div className="absolute top-4 left-4 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
          <div className="mb-1 font-semibold">Selected Object</div>
          <div>Arrow keys to move • Shift+Arrow for faster</div>
          <div>Delete/Backspace to remove • Esc to deselect</div>
        </div>
      )}

      {/* Floating Toolbar */}
      <div className="absolute bottom-4 left-1/2 flex max-w-5xl -translate-x-1/2 transform flex-wrap items-center gap-2 rounded-xl border-2 border-gray-200 bg-white p-3 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
        <div className="flex gap-1">
          <Button
            variant={tool === 'select' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('select')}
            title="Select and move objects (V)"
          >
            <MousePointer className="h-4 w-4" />
          </Button>
          <Button
            variant={tool === 'pen' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('pen')}
            title="Pen tool (P)"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant={tool === 'line' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('line')}
            title="Line tool (L)"
          >
            <span className="text-sm">─</span>
          </Button>
          <Button
            variant={tool === 'rectangle' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('rectangle')}
            title="Rectangle tool (R)"
          >
            <Square className="h-4 w-4" />
          </Button>
          <Button
            variant={tool === 'circle' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('circle')}
            title="Circle tool (C)"
          >
            <Circle className="h-4 w-4" />
          </Button>
          <Button
            variant={tool === 'arrow' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('arrow')}
            title="Arrow tool (A)"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant={tool === 'text' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('text')}
            title="Text tool (T)"
          >
            <Type className="h-4 w-4" />
          </Button>
          <Button
            variant={tool === 'eraser' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('eraser')}
            title="Eraser tool (E)"
          >
            <Eraser className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>

        <div className="flex gap-1">
          {colors.map((c) => (
            <button
              key={c}
              className={`h-8 w-8 rounded-full border-2 transition-all ${
                color === c
                  ? 'scale-110 border-gray-800 dark:border-blue-400'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
              title={c}
            />
          ))}
        </div>

        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium dark:text-gray-200">
            Size:
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="w-20"
          />
          <span className="w-4 text-xs text-gray-500 dark:text-gray-400">
            {lineWidth}
          </span>
        </div>

        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>

        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={undo}
            disabled={historyStep === 0}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={redo}
            disabled={historyStep === history.length - 1}
            title="Redo (Ctrl+Y)"
          >
            <Redo className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearCanvas}
            title="Clear all"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          {onSave && (
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              title="Save (Ctrl+S)"
            >
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
