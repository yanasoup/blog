import EditingNavigation from '../partials/editing-navigation';

import { useCreatePost } from '@/hooks/useCreatePost';
import type { CreatePostParams, UseCreatePostParams } from '@/models/post';
import { AxiosError } from 'axios';
const pageSize = import.meta.env.VITE_BLOG_PAGE_SIZE;
import { useEffect } from 'react';
import DebugBox from '@/redux/debug-box';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { toast } from 'sonner';
import { PostEditor, EditorFormData } from '../partials/post-editor';

const defaultPagingParam: UseCreatePostParams = {
  queryKey: [
    'posts',
    {
      limit: pageSize,
      page: 1,
    },
  ],
};

const BlogPostCreate = () => {
  // console.log('render');
  const uiuxState = useSelector((state: RootState) => state.uiux);
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
  }, [isSuccess, error]);

  const onSubmit = (formData: EditorFormData) => {
    const createParams: CreatePostParams = {
      data: formData,
      requestToken: uiuxState.apiToken!,
    };
    createPost(createParams);
  };

  return (
    <>
      <EditingNavigation title='Write Post' />
      <DebugBox visible={false} />
      <PostEditor
        post={undefined}
        isFetching={false}
        onSave={onSubmit}
        isPending={isPending}
        editorMode='create'
      />
    </>
  );
};

export default BlogPostCreate;
