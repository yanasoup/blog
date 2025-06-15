import { customAxios } from '@/lib/customAxios';
import { Post } from '@/models/post';
import type { MutationFunction } from '@tanstack/query-core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GetPostsResponse } from '@/models/post';

export type UseDeleteParams = {
  queryKey: [
    string,
    {
      limit: number;
      page: number;
    },
    string,
  ];
};
export type DeletePostParams = {
  postId: string | number;
  authToken: string;
};
type MyPostsReturn = {
  data: Post[];
  total: number;
  page: boolean;
  isFetching: boolean;
  error: Error | null;
};

export const useDeletePost = (invalidateQueryParams: UseDeleteParams) => {
  const queryClient = useQueryClient();
  const mutationResult = useMutation({
    mutationFn: deletePost,
    onMutate: async (params: DeletePostParams) => {
      await queryClient.cancelQueries({
        queryKey: invalidateQueryParams.queryKey,
      });
      const previousData = queryClient.getQueryData(
        invalidateQueryParams.queryKey
      );
      queryClient.setQueryData(
        invalidateQueryParams.queryKey,
        (oldData: MyPostsReturn) => {
          if (oldData) {
            const newData = {
              ...oldData,
              data: oldData.data.filter((post) => post.id !== params.postId),
            };
            return newData;
          }
          return [];
        }
      );
      return { previousData, queryKey: invalidateQueryParams.queryKey };
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

export const deletePost: MutationFunction<
  DeletePostParams,
  DeletePostParams
> = async (postParams: DeletePostParams) => {
  // await wait(5000);
  const response = await customAxios.delete<DeletePostParams>(
    `/posts/${postParams.postId}`,
    {
      data: {},
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${postParams.authToken}`,
      },
    }
  );
  return response.data;
};
