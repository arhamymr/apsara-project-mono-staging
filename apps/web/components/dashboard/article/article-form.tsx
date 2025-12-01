/* eslint-disable @typescript-eslint/no-explicit-any */
import { CategorySelect } from '@/components/category-select';
import { ImageUpload } from '@/components/image-upload';
import TextEditor from '@/components/text-editor';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
import { UseFormReturn } from 'react-hook-form';
import { ArticleFormData } from './validation';

const ArticleForm = ({ form }: { form: UseFormReturn<ArticleFormData> }) => {
  return (
    <Form {...form}>
      <div className="text-foreground flex gap-4">
        {/* Left column */}
        <div className="prose prose-zinc dark:prose-invert w-full flex-1 space-y-6">
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Image</FormLabel>
                <FormControl>
                  <div className="border-border bg-card/50 rounded-md border p-2">
                    <ImageUpload {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Insert title"
                    {...field}
                    className="placeholder:text-muted-foreground"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={() => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <CategorySelect
                    name="category"
                    placeholder="Select category"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Right column */}
        <div className="max-w-[700px] flex-[2]">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <div className="border-border bg-card rounded-md border">
                    {/* If your editor supports className, pass it through */}
                    <TextEditor value={field.value} onChange={field.onChange} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </Form>
  );
};

export default ArticleForm;
