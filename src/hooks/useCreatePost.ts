import { customAxios } from '@/lib/customAxios';
import type { CreatePostParams } from '@/models/post';
import type { MutationFunction } from '@tanstack/query-core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseCreatePostParams } from '@/models/post';

export const createPost: MutationFunction<
  CreatePostParams,
  CreatePostParams
> = async (newPostParams: CreatePostParams) => {
  const response = await customAxios.post<CreatePostParams>(
    '/posts',
    newPostParams.data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
        Authorization: `Bearer ${newPostParams.requestToken}`,
      },
    }
  );
  return response.data;
};

export const useCreatePost = (invalidateQueryParams: UseCreatePostParams) => {
  const queryClient = useQueryClient();

  const addTodoMutation = useMutation({
    mutationFn: (newPost: CreatePostParams) => createPost(newPost),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: invalidateQueryParams.queryKey,
      });
    },
  });

  return addTodoMutation;
};
