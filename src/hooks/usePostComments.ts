import { customAxios } from '@/lib/customAxios';
import type { MutationFunction } from '@tanstack/query-core';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const sendComment: MutationFunction<
  PostCommentParams,
  PostCommentParams
> = async (postComment: PostCommentParams) => {
  const response = await customAxios.post<PostCommentParams>(
    `/comments/${postComment.postId}`,
    postComment.data,
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${postComment.authToken}`,
      },
    }
  );
  return response.data;
};

export type UseSendCommentParams = {
  queryKey: [string, string | number];
};
export type PostCommentParams = {
  postId: string | number;
  authToken: string;
  data: {
    userId: number;
    content: string;
  };
};
export const useSendComment = (invalidateQueryParams: UseSendCommentParams) => {
  const queryClient = useQueryClient();

  const addTodoMutation = useMutation({
    // mutationFn: (postComment: PostCommentParams) => sendComment(postComment),
    mutationFn: sendComment,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: invalidateQueryParams.queryKey,
      });
    },
  });

  return addTodoMutation;
};
