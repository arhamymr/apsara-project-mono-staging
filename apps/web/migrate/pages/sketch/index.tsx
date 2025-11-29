import SketchCanvas from '@/components/SketchCanvas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import WindowsWebShell from '@/layouts/os';
import { Head } from '@inertiajs/react';
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

export default function SketchPage() {
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
        alert('Sketch updated successfully!');
      } else {
        const response = await axios.post('/api/sketches', {
          title,
          canvas_data: elements,
          thumbnail,
        });
        setSketches([response.data, ...sketches]);
        setCurrentSketch(response.data);
        alert('Sketch saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save sketch:', error);
      alert('Failed to save sketch. Please try again.');
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
      alert('Failed to delete sketch. Please try again.');
    }
  };

  return (
    <WindowsWebShell>
      <Head title="Sketch - Brainstorm Ideas" />

      <div className="flex h-full flex-col p-6">
        <div className="mb-4 flex flex-shrink-0 items-center justify-between">
          <div className="flex items-center gap-4">
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="max-w-md"
              placeholder="Sketch title..."
            />
            {currentSketch && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Last saved:{' '}
                {new Date(currentSketch.updated_at).toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleNewSketch}>
              <Plus className="mr-2 h-4 w-4" />
              New
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSketches(!showSketches)}
            >
              <FolderOpen className="mr-2 h-4 w-4" />
              My Sketches ({sketches.length})
            </Button>
          </div>
        </div>

        {showSketches && (
          <div className="mb-4 flex-shrink-0 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <h3 className="mb-3 font-semibold dark:text-gray-100">
              My Sketches
            </h3>
            {sketches.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No saved sketches yet.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                {sketches.map((sketch) => (
                  <div
                    key={sketch.id}
                    className="cursor-pointer overflow-hidden rounded-lg border bg-white transition-shadow hover:shadow-lg dark:border-gray-600 dark:bg-gray-700"
                  >
                    <div onClick={() => handleLoadSketch(sketch)}>
                      {sketch.thumbnail ? (
                        <img
                          src={sketch.thumbnail}
                          alt={sketch.title}
                          className="h-32 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-32 w-full items-center justify-center bg-gray-200 dark:bg-gray-600">
                          <span className="text-gray-400 dark:text-gray-300">
                            No preview
                          </span>
                        </div>
                      )}
                      <div className="p-2">
                        <p className="truncate text-sm font-medium dark:text-gray-100">
                          {sketch.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(sketch.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="px-2 pb-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSketch(sketch.id);
                        }}
                        className="w-full"
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

        <div className="min-h-0 flex-1">
          <SketchCanvas
            onSave={handleSave}
            initialElements={currentSketch?.canvas_data || []}
            key={currentSketch?.id || 'new'}
          />
        </div>

        {loading && (
          <div className="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black">
            <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
              <p className="dark:text-gray-100">Saving sketch...</p>
            </div>
          </div>
        )}
      </div>
    </WindowsWebShell>
  );
}
