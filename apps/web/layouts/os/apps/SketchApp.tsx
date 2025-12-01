import SketchCanvas from '@/components/SketchCanvas';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import axios from 'axios';
import { FolderOpen, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DrawElement {
  type: string;
  points: { x: number; y: number }[];
  color: string;
  lineWidth: number;
  text?: string;
}

interface Sketch {
  id: number;
  title: string;
  canvas_data: DrawElement[];
  thumbnail: string | null;
  created_at: string;
  updated_at: string;
}

export default function SketchApp() {
  const [sketches, setSketches] = useState<Sketch[]>([]);
  const [currentSketch, setCurrentSketch] = useState<Sketch | null>(null);
  const [title, setTitle] = useState('Untitled Sketch');
  const [showSketches, setShowSketches] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSketches();
  }, []);

  const loadSketches = async () => {
    try {
      const response = await axios.get('/api/sketches');
      setSketches(response.data);
    } catch (error) {
      console.error('Failed to load sketches:', error);
    }
  };

  const handleSave = async (elements: DrawElement[], thumbnail: string) => {
    setLoading(true);
    try {
      if (currentSketch) {
        const response = await axios.patch(
          `/api/sketches/${currentSketch.id}`,
          {
            title,
            canvas_data: elements,
            thumbnail,
          },
        );
        setSketches(
          sketches.map((s) => (s.id === currentSketch.id ? response.data : s)),
        );
        setCurrentSketch(response.data);
        alert('Sketch updated!');
      } else {
        const response = await axios.post('/api/sketches', {
          title,
          canvas_data: elements,
          thumbnail,
        });
        setSketches([response.data, ...sketches]);
        setCurrentSketch(response.data);
        alert('Sketch saved!');
      }
    } catch (error) {
      console.error('Failed to save sketch:', error);
      alert('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewSketch = () => {
    setCurrentSketch(null);
    setTitle('Untitled Sketch');
    setShowSketches(false);
  };

  const handleLoadSketch = (sketch: Sketch) => {
    setCurrentSketch(sketch);
    setTitle(sketch.title);
    setShowSketches(false);
  };

  const handleDeleteSketch = async (id: number) => {
    if (!confirm('Delete this sketch?')) return;

    try {
      await axios.delete(`/api/sketches/${id}`);
      setSketches(sketches.filter((s) => s.id !== id));
      if (currentSketch?.id === id) {
        handleNewSketch();
      }
    } catch (error) {
      console.error('Failed to delete sketch:', error);
      alert('Failed to delete. Please try again.');
    }
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-900">
      <div className="flex flex-shrink-0 items-center justify-between border-b bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-1 items-center gap-2">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="max-w-xs text-sm"
            placeholder="Sketch title..."
          />
          {currentSketch && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Saved {new Date(currentSketch.updated_at).toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleNewSketch}>
            <Plus className="mr-1 h-3 w-3" />
            New
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSketches(!showSketches)}
          >
            <FolderOpen className="mr-1 h-3 w-3" />
            My Sketches ({sketches.length})
          </Button>
        </div>
      </div>

      {showSketches && (
        <div className="max-h-48 flex-shrink-0 overflow-y-auto border-b bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-2 text-sm font-semibold dark:text-gray-100">
            My Sketches
          </h3>
          {sketches.length === 0 ? (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              No saved sketches yet.
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {sketches.map((sketch) => (
                <div
                  key={sketch.id}
                  className="cursor-pointer overflow-hidden rounded border bg-white transition-shadow hover:shadow dark:border-gray-600 dark:bg-gray-700"
                >
                  <div onClick={() => handleLoadSketch(sketch)}>
                    {sketch.thumbnail ? (
                      <img
                        src={sketch.thumbnail}
                        alt={sketch.title}
                        className="h-20 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-full items-center justify-center bg-gray-200 dark:bg-gray-600">
                        <span className="text-xs text-gray-400 dark:text-gray-300">
                          No preview
                        </span>
                      </div>
                    )}
                    <div className="p-1">
                      <p className="truncate text-xs font-medium dark:text-gray-100">
                        {sketch.title}
                      </p>
                    </div>
                  </div>
                  <div className="px-1 pb-1">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSketch(sketch.id);
                      }}
                      className="h-6 w-full text-xs"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="min-h-0 flex-1 p-3">
        <SketchCanvas
          onSave={handleSave}
          initialElements={currentSketch?.canvas_data || []}
          key={currentSketch?.id || 'new'}
        />
      </div>

      {loading && (
        <div className="bg-opacity-25 absolute inset-0 flex items-center justify-center bg-black">
          <div className="rounded bg-white p-3 shadow dark:bg-gray-800">
            <p className="text-sm dark:text-gray-100">Saving...</p>
          </div>
        </div>
      )}
    </div>
  );
}
