import EditingNavigation from '../partials/editing-navigation';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useCreatePost } from '@/hooks/useCreatePost';
import type { CreatePostParams, UseCreatePostParams } from '@/models/post';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { AxiosError } from 'axios';
const pageSize = import.meta.env.VITE_BLOG_PAGE_SIZE;
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '../ui/input';
import { CloudUploadIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { BeatLoader } from 'react-spinners';

import React, { useEffect } from 'react';
import DebugBox from '@/redux/debug-box';
const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
// import { HtmlEditor } from '../editor/html-editor';
import { toast } from 'sonner';

const formSchema = z.object({
  title: z
    .string({
      required_error: 'Please enter a title',
    })
    .max(255),
  content: z
    .string({
      required_error: 'Please enter your content',
    })
    .min(10, 'Konten minimal 10 karakter')
    .refine((val) => val.replace(/<[^>]*>/g, '').trim().length > 0, {
      message: 'Please enter your content',
    }),
  image: z
    .any()
    .refine((files) => {
      return files?.[0]?.size <= MAX_FILE_SIZE;
    }, `Max image size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
      'Only .jpg, .jpeg, and .png formats are supported.'
    ),
  tags: z
    .string({
      required_error: 'Please enter tags',
    })
    .max(255),
});
type FormData = z.infer<typeof formSchema>;

const defaultPagingParam: UseCreatePostParams = {
  queryKey: [
    'posts',
    {
      limit: pageSize,
      page: 1,
    },
  ],
};

const BlogPostEdit = () => {
  // console.log('render');
  const uiuxState = useSelector((state: RootState) => state.uiux);
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      image: '',
      tags: '',
    },
  });

  const {
    // data,
    error,
    isPending,
    isSuccess,
    mutate: createPost,
  } = useCreatePost(defaultPagingParam);

  useEffect(() => {
    if (isSuccess) {
      toast.success('Post Saved', {
        description: `your post has been successfully saved!`,
      });
    } else if (error instanceof AxiosError) {
      toast.error('Failed!!', {
        description: `oops failed to save you post!`,
      });
    }
  });

  const onSubmit = () => {
    const formData = form.getValues();
    // const newTags = formData.tags.split(',').forEach((item) => item.trim());

    const newPost = {
      ...formData,
      image: selectedImage,
      tags: formData.tags.split(','),
    };
    console.log('newPost', newPost);
    const createParams: CreatePostParams = {
      data: newPost,
      requestToken: uiuxState.apiToken!,
    };
    createPost(createParams);
  };

  return (
    <>
      <EditingNavigation title='Edit Post' />
      <DebugBox visible={false} />
      <div className='custom-container mt-12 flex flex-wrap'>
        <Form {...form}>
          <form
            className='mx-auto max-w-180 flex-1 space-y-4 md:space-y-6'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem className='mt-5 gap-1'>
                  <FormLabel>Title</FormLabel>
                  <Input
                    {...field}
                    className='text-sm-regular'
                    placeholder='Enter your title'
                    disabled={isPending}
                    type='text'
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem className='mt-5 gap-1'>
                  <FormLabel>Content</FormLabel>
                  {/* <HtmlEditor /> */}
                  <ReactQuill
                    theme='snow'
                    value={field.value}
                    onChange={field.onChange}
                    className='mb-12 h-[200px]'
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='image'
              render={({ field }) => (
                <FormItem className='mt-5 gap-1'>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <div className='flex-center flex flex-col gap-1 rounded-2xl border border-dashed border-neutral-400 bg-neutral-50 p-4'>
                      <input
                        type='file'
                        className='hidden'
                        id='fileInput'
                        accept='image/*'
                        onBlur={field.onBlur}
                        name={field.name}
                        onChange={(e) => {
                          field.onChange(e.target.files);
                          setSelectedImage(e.target.files?.[0] || null);
                        }}
                        ref={field.ref}
                      />
                      {selectedImage && (
                        <div className='md:max-w-[200px]'>
                          <img
                            src={URL.createObjectURL(selectedImage)}
                            alt='Selected'
                          />
                        </div>
                      )}

                      <label
                        htmlFor='fileInput'
                        className='text-neutral-90 inline-flex cursor-pointer items-center rounded-md border border-neutral-300 bg-transparent p-2'
                      >
                        <CloudUploadIcon className='size-10 text-neutral-900' />
                      </label>
                      <p className='flex gap-1'>
                        <span className='text-primary-300 text-sm-semibold'>
                          Click to upload
                        </span>
                        <span className='text-sm-regular text-neutral-700'>
                          or drag and drop
                        </span>
                      </p>
                      <p className='text-xs-regular text-neutral-700'>
                        PNG or JPG (max. 5mb)
                      </p>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='tags'
              render={({ field }) => (
                <FormItem className='mt-5 gap-1'>
                  <FormLabel>Tags</FormLabel>
                  <Input
                    {...field}
                    className='text-sm-regular'
                    placeholder='Enter your title'
                    disabled={isPending}
                    type='text'
                  />

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='mt-5 flex items-center justify-end'>
              <Button
                disabled={isPending}
                type='submit'
                className='w-fit px-28.5'
              >
                {isPending ? (
                  <BeatLoader
                    color='#d5d7da'
                    className='text-white'
                    size={16}
                  />
                ) : (
                  'Finish'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default BlogPostCreate;
