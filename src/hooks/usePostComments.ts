import { customAxios } from '@/lib/customAxios';
import type { MutationFunction } from '@tanstack/query-core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Comment } from '@/models/post';
import { wait } from './useGetPost';

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
  queryKey: [string, string];
  optimisticData: Comment;
};

export const sendCommentOptimistic: MutationFunction<
  PostCommentParams,
  PostCommentParams
> = async (postComment: PostCommentParams) => {
  await wait(500);
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

export const useSendCommentOptimistic = (
  invalidateQueryParams: UseSendCommentParams
) => {
  const queryClient = useQueryClient();

  const mutationResult = useMutation({
    mutationFn: sendCommentOptimistic,
    onMutate: async (params: PostCommentParams) => {
      await queryClient.cancelQueries({ queryKey: params.queryKey });
      const previousData = queryClient.getQueryData(params.queryKey);
      queryClient.setQueryData(params.queryKey, (oldData: Comment[]) => {
        if (oldData) {
          return [...oldData, params.optimisticData];
        }
        return [params.optimisticData];
      });
      return { previousData, queryKey: params.queryKey };
    },
    onError: (error, newData, context) => {
      if (context) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      } else {
        console.log(error, newData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: invalidateQueryParams.queryKey,
      });
    },
  });

  return mutationResult;
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
