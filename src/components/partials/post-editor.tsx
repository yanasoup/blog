import React from 'react';
import { Post } from '@/models/post';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Icon } from '@iconify-icon/react';
import { Badge } from '@/components/ui/badge';
import { CloudUploadIcon } from 'lucide-react';

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

const formSchema = z
  .object({
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
    imageUrl: z.string().optional(),
    image: z
      .any()
      .optional()
      .refine((files: FileList | undefined) => {
        if (!files || files.length === 0) return true;
        return files[0].size <= MAX_FILE_SIZE;
      }, `Max image size is 5MB.`)
      .refine((files: FileList | undefined) => {
        if (!files || files.length === 0) return true;
        return ACCEPTED_IMAGE_MIME_TYPES.includes(files[0].type);
      }, 'Only .jpg, .jpeg, and .png formats are supported.'),
    tags: z
      .array(z.string().min(1, 'Tag can not be empty'))
      .min(1, 'Please enter at least 1 tag')
      .max(5, 'you can only input maximum 5 tags'),
  })
  .refine(
    (data) => {
      return !!data.imageUrl || (!!data.image && data.image.length > 0);
    },
    {
      message: 'Cover image can not be empty',
      path: ['image'],
    }
  );

export type EditorFormData = z.infer<typeof formSchema>;

type PostEditorProps = {
  post: Post | undefined;
  isFetching: boolean;
  onSave: (data: EditorFormData) => void;
  isPending: boolean;
  editorMode: 'create' | 'edit';
};

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'strike', 'italic'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['link', 'image'],
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'align',
  'indent',
  'link',
  'image',
];

export const PostEditor: React.FC<PostEditorProps> = ({
  post,
  isFetching,
  onSave,
  isPending,
  editorMode = 'create',
}) => {
  const [tagsValue, setTagsValue] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);

  const titleRef = React.useRef<HTMLInputElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<EditorFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      imageUrl: '',
      image: null,
      tags: [],
    },
  });

  React.useEffect(() => {
    if (!post) return;
    form.setValue('title', post?.title || '');
    form.setValue('content', post?.content || '');
    setImageUrl(post?.imageUrl || '');
    form.setValue('imageUrl', post?.imageUrl || '');
    form.setValue('image', null);
    form.setValue('tags', post?.tags || []);
  }, [post]);

  const onSubmit = (formData: EditorFormData) => {
    const updatedPost = {
      ...formData,
      image: selectedImage,
      tags: formData.tags,
    };

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
  const deleteCoverImage = () => {
    setSelectedImage(null);
    setImageUrl(null);
    form.setValue('imageUrl', undefined);
  };

  return (
    <div className='custom-container mt-12 flex flex-wrap'>
      <div className='relative mx-auto flex w-212 pb-12'>
        {(isFetching || isPending) && (
          <div className='flex-center absolute inset-0 top-0 left-0 z-5 rounded-lg bg-neutral-500 opacity-50'>
            <BeatLoader color='#d5d7da' className='text-white' size={16} />
          </div>
        )}
        <Form {...form}>
          <form
            className='mx-auto max-w-200 flex-1 lg:min-w-180'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem className='gap-1'>
                  <FormLabel>Title</FormLabel>
                  <Input
                    {...field}
                    className={cn(
                      'text-sm-regular',
                      form.formState.errors?.title ? 'border-[#EE1D52]' : ''
                    )}
                    placeholder='Enter your title'
                    disabled={isPending}
                    type='text'
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
                  <div
                    className={cn(
                      'rounded-lg border border-neutral-300',
                      form.formState.errors?.content ? 'border-[#EE1D52]' : ''
                    )}
                  >
                    <ReactQuill
                      theme='snow'
                      modules={modules}
                      formats={formats}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='image'
              render={({ field }) => (
                <FormItem className='mt-5 gap-1'>
                  <FormLabel>Cover Image</FormLabel>
                  <FormControl>
                    <div>
                      {editorMode === 'create' && (
                        <div
                          className={cn(
                            'flex-center flex flex-col gap-1 rounded-2xl border border-dashed border-neutral-400 bg-neutral-50 p-4',
                            form.formState.errors?.image
                              ? 'border-[#EE1D52]'
                              : ''
                          )}
                        >
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
                      )}
                      {editorMode === 'edit' && (
                        <div
                          className={cn(
                            'flex-center flex flex-col gap-1 rounded-2xl border border-dashed border-neutral-400 bg-neutral-50 p-4',
                            form.formState.errors?.image
                              ? 'border-[#EE1D52]'
                              : ''
                          )}
                        >
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
                            <div className='max-w-[200px]'>
                              <img
                                src={URL.createObjectURL(selectedImage)}
                                alt='Selected'
                              />
                            </div>
                          )}
                          {!selectedImage && (
                            <div className='md:max-w-[200px]'>
                              {imageUrl && (
                                <img src={imageUrl} alt='Selected' />
                              )}
                            </div>
                          )}

                          <p className='flex-center mt-3 gap-2'>
                            <label
                              htmlFor='fileInput'
                              className='inline-flex cursor-pointer items-center'
                            >
                              <span className='text-xs-regular lg:text-sm-regular flex-center h-10 shrink-0 gap-1.5 rounded-md border border-neutral-300 bg-transparent px-3 py-1.5 text-neutral-950'>
                                <Icon
                                  icon='lucide:arrow-up-to-line'
                                  size={20}
                                />
                                Change Image
                              </span>
                            </label>
                            <span
                              className='text-xs-regular lg:text-sm-regular flex-center h-10 shrink-0 cursor-pointer gap-1.5 rounded-md border border-neutral-300 bg-transparent px-3 py-1.5 text-[#EE1D52]'
                              onClick={deleteCoverImage}
                            >
                              <Icon icon='mage:trash' size={20} />
                              Delete Image
                            </span>
                          </p>
                          <p className='text-xs-regular text-neutral-700'>
                            PNG or JPG (max. 5mb)
                          </p>
                        </div>
                      )}
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
                        className={cn(
                          'flex min-h-10 flex-wrap items-center gap-2 rounded-md border px-3 py-0 focus-within:ring-0',
                          form.formState.errors.tags
                            ? 'border border-[#EE1D52] ring-[#EE1D52]'
                            : 'border-input focus-within:ring-ring'
                        )}
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
                className='w-full px-28.5 md:w-fit'
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
