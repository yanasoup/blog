import EditingNavigation from '../partials/editing-navigation';

import { AxiosError } from 'axios';
import { useMatch } from 'react-router';
import { useGetPostNoQKey } from '@/hooks/useGetPost';

import { useEffect } from 'react';
import DebugBox from '@/redux/debug-box';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { toast } from 'sonner';
import { UpdatePostParams, useUpdatePost } from '@/hooks/useUpdatePost';
import { EditorFormData, PostEditor } from '../partials/post-editor';
import { useNavigate } from 'react-router';
const BlogPostEdit = () => {
  const navigate = useNavigate();
  const match = useMatch('/edit-post/:postId');
  const uiuxState = useSelector((state: RootState) => state.uiux);
  const postId = match?.params.postId;

  const {
    error,
    isPending,
    isSuccess: isUpdateSuccess,
    mutate: updatePost,
  } = useUpdatePost();

  const { getPostData, post, isFetching } = useGetPostNoQKey();

  const onSubmit = (updatedPost: EditorFormData) => {
    const updateParams: UpdatePostParams = {
      id: postId as unknown as number,
      data: updatedPost,
      authToken: uiuxState.apiToken!,
    };
    // console.log('updatedPost', updatedPost);

    updatePost(updateParams);
  };

  useEffect(() => {
    if (postId) {
      getPostData(postId);
    }
  }, [postId]);

  useEffect(() => {
    if (isUpdateSuccess) {
      toast.success('Post Updated', {
        description: `your post has been successfully updated!`,
      });
      navigate('/myprofile');
    } else if (error instanceof AxiosError) {
      toast.error('Failed!!', {
        description: `oops failed to update you post!`,
      });
    }
  }, [isUpdateSuccess, error]);

  return (
    <>
      <EditingNavigation title='Edit Post' />
      <DebugBox visible={false} />
      <PostEditor
        post={post}
        isFetching={isFetching}
        onSave={onSubmit}
        isPending={isPending}
        editorMode='edit'
      />
    </>
  );
};

export default BlogPostEdit;
