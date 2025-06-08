import EditingNavigation from '../partials/editing-navigation';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { AxiosError } from 'axios';
import { useMatch } from 'react-router';
import { UseGetPostParams, useGetPost } from '@/hooks/useGetPost';
import { Icon } from '@iconify-icon/react';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '../ui/input';

import { Button } from '../ui/button';
import { BeatLoader } from 'react-spinners';

import React, { useEffect } from 'react';
import DebugBox from '@/redux/debug-box';
const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { toast } from 'sonner';
import { UpdatePostParams, useUpdatePost } from '@/hooks/useUpdatePost';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { UseGetPostReturn } from '@/hooks/useGetPost';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  title: z
    .string({
      required_error: 'Please enter a title',
    })
    .min(1, 'Please enter a title')
    .max(255),
  content: z
    .string({
      required_error: 'Please enter your content',
    })
    .min(50, 'Content should have minimum 50 letters')
    .refine((val) => val.replace(/<[^>]*>/g, '').trim().length > 0, {
      message: 'Please enter your content',
    }),
  image: z
    .any()
    .refine((files) => {
      return files?.[0]?.size <= MAX_FILE_SIZE;
    }, `Max image size is 5MB. `)
    .refine(
      (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
      'Only .jpg, .jpeg, and .png formats are supported.'
    ),
  tags: z
    .array(z.string().min(1, 'Tag tidak boleh kosong'))
    .min(1, 'Minimal 1 tag harus diisi')
    .max(5, 'Maksimal hanya 5 tag'), // tags: z
  //   .string({
  //     required_error: 'Please enter tags',
  //   })
  //   .max(255),
});
type FormData = z.infer<typeof formSchema>;

const BlogPostEdit = () => {
  // const [tags, setTags] = React.useState<string[]>([]);
  const match = useMatch('/edit-post/:postId');
  const uiuxState = useSelector((state: RootState) => state.uiux);

  const { error, isPending, isSuccess, mutate: updatePost } = useUpdatePost();

  const params: UseGetPostParams = {
    qkey: 'post',
    postId: match?.params.postId,
  };
  const getPostResult = useGetPost(params);

  const onSubmit = (updatedPost: FormData) => {
    // console.log('updatedPost', updatedPost);

    const updateParams: UpdatePostParams = {
      id: match?.params.postId as unknown as number,
      data: updatedPost,
      authToken: uiuxState.apiToken!,
    };
    // console.log('updateParams', updateParams);

    updatePost(updateParams);
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success('Post Updated', {
        description: `your post has been successfully updated!`,
      });
    } else if (error instanceof AxiosError) {
      toast.error('Failed!!', {
        description: `oops failed to update you post!`,
      });
    }
  }, [isSuccess, error]);

  return (
    <>
      <EditingNavigation title='Edit Post' />
      <DebugBox visible={false} />
      <PostEditor
        getPostResult={getPostResult}
        onSave={onSubmit}
        isPending={isPending}
      />
    </>
  );
};

type PostEditorProps = {
  getPostResult: UseGetPostReturn;
  onSave: (data: FormData) => void;
  isPending: boolean;
};

const PostEditor: React.FC<PostEditorProps> = ({
  getPostResult,
  onSave,
  isPending,
}) => {
  const [tagsValue, setTagsValue] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);

  const titleRef = React.useRef<HTMLInputElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      image: '',
      tags: [],
    },
  });

  React.useEffect(() => {
    // console.log('useEffect getPostResult', getPostResult);
    form.setValue('title', getPostResult.post?.title || '');
    form.setValue('content', getPostResult.post?.content || '');
    setImageUrl(getPostResult.post?.imageUrl || '');
    form.setValue('tags', getPostResult.post?.tags || []);
  }, [getPostResult]);

  const onSubmit = (formData: FormData) => {
    // const formData = form.getValues();

    const updatedPost = {
      ...formData,
      image: selectedImage,
      tags: formData.tags,
    };
    // console.log('newPost', newPost);

    onSave(updatedPost);
  };

  const addTag = (tag: string) => {
    const currentTags = form.getValues('tags');
    if (tag && !currentTags.includes(tag) && currentTags.length < 5) {
      form.setValue('tags', [...currentTags, tag], { shouldValidate: true });
      setTagsValue('');
    }
  };

  const removeTag = (index: number) => {
    const currentTags = form.getValues('tags');
    const updated = [
      ...currentTags.slice(0, index),
      ...currentTags.slice(index + 1),
    ];
    form.setValue('tags', updated, { shouldValidate: true });
  };

  return (
    <div className='custom-container mt-12 flex flex-wrap'>
      <div className='relative mx-auto p-4'>
        {getPostResult.isFetching && (
          <div className='flex-center absolute inset-0 top-0 left-0 z-5 rounded-lg bg-neutral-500 opacity-50'>
            <BeatLoader color='#d5d7da' className='text-white' size={16} />
          </div>
        )}
        <Form {...form}>
          <form
            className='mx-auto max-w-180 flex-1 space-y-4 md:space-y-6 lg:min-w-180'
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
                    className={cn(
                      'text-sm-regular',
                      form.formState.errors?.title
                        ? 'border-[#EE1D52] focus:ring-[#EE1D52]'
                        : ''
                    )}
                    placeholder='Enter your title'
                    disabled={isPending}
                    // value={title}
                    type='text'
                    // onChange={(e) => setTitle(e.target.value)}
                    ref={titleRef}
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
                    className={cn(
                      'mb-12 h-[200px]',
                      form.formState.errors?.content
                        ? 'border-[#EE1D52] focus:ring-[#EE1D52]'
                        : ''
                    )}
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
                      {!selectedImage && (
                        <div className='md:max-w-[200px]'>
                          {imageUrl && <img src={imageUrl} alt='Selected' />}
                        </div>
                      )}

                      <label
                        htmlFor='fileInput'
                        className='mt-3 inline-flex cursor-pointer items-center gap-3'
                      >
                        <span className='text-xs-regular lg:text-sm-regular flex-center h-10 gap-1.5 rounded-md border border-neutral-300 bg-transparent px-3 py-1.5 text-neutral-950'>
                          <Icon icon='lucide:arrow-up-to-line' size={20} />
                          Change Image
                        </span>
                        <span className='text-xs-regular lg:text-sm-regular flex-center h-10 gap-1.5 rounded-md border border-neutral-300 bg-transparent px-3 py-1.5 text-[#EE1D52]'>
                          <Icon icon='mage:trash' size={20} />
                          Delete Image
                        </span>
                      </label>
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
              render={({}) => (
                <FormItem className='mt-5 gap-1'>
                  <FormLabel>Tags</FormLabel>
                  <Controller
                    control={form.control}
                    name='tags'
                    render={() => (
                      <div
                        className={`flex min-h-10 flex-wrap items-center gap-2 rounded-md border px-3 py-0 focus-within:ring-2 ${
                          form.formState.errors.tags
                            ? 'border-red-500 ring-red-500'
                            : 'border-input focus-within:ring-ring'
                        }`}
                        onClick={() => inputRef.current?.focus()}
                      >
                        {form.getValues('tags').map((tag, index) => (
                          <Badge
                            key={index}
                            variant='secondary'
                            className='flex items-center gap-1 px-2 py-0.5'
                          >
                            {tag}
                            <X
                              className='ml-1 h-3 w-3 cursor-pointer'
                              onClick={(e) => {
                                e.stopPropagation();
                                removeTag(index);
                              }}
                            />
                          </Badge>
                        ))}
                        <input
                          ref={inputRef}
                          type='text'
                          value={tagsValue}
                          className='text-sm-regular min-w-[100px] flex-1 border-none bg-transparent focus:outline-none'
                          placeholder='Enter tag and press enter'
                          onChange={(e) => setTagsValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (
                              (e.key === 'Enter' || e.key === ',') &&
                              tagsValue.trim()
                            ) {
                              e.preventDefault();
                              addTag(tagsValue.trim());
                            }

                            if (e.key === 'Backspace' && !tagsValue) {
                              removeTag(form.getValues('tags').length - 1);
                            }
                          }}
                        />
                      </div>
                    )}
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
    </div>
  );
};
export default BlogPostEdit;
