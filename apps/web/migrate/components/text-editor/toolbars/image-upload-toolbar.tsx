import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { isValidUrl } from '@/lib/utils';
import axios from 'axios';
import { Image } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useToolbar } from './toolbar-provider';

export const ImageUploadToolbar = () => {
  const { editor } = useToolbar();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');

  const uploadImage = async (imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await axios.post('/dashboard/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      });

      const data = response.data;

      editor?.chain().focus().setImage({ src: data.url }).run();

      setOpen(false);
      toast.success('Image uploaded');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      uploadImage(selectedFile);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidUrl(url)) {
      editor?.chain().focus().setImage({ src: url }).run();

      setOpen(false);
      setUrl('');
    } else {
      toast.error('Invalid URL');
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          <Image className="mr-2 h-4 w-4" />
          Image
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px]">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="image-upload"
              className="mb-2 block text-sm font-medium"
            >
              Upload Image
            </label>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div>
            <form onSubmit={handleUrlSubmit} className="space-y-2">
              <label className="block text-sm font-medium">
                Or Paste Image URL
              </label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              <Button type="submit" size="sm" className="w-full">
                Embed Image
              </Button>
            </form>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
