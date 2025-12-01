/* eslint-disable @typescript-eslint/no-explicit-any */
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
import SlugField from './slug-field';
import { WebsiteFormData } from './validation';

export const GeneralForm = ({
  form,
}: {
  form: UseFormReturn<WebsiteFormData>;
}) => {
  return (
    <Form {...form}>
      <div className="prose w-full space-y-2 rounded-md border p-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Insert Website Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SlugField form={form} />
      </div>
    </Form>
  );
};
