import { customAxios } from '@/lib/customAxios';
import type { MutationFunction } from '@tanstack/query-core';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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

export type UseDeleteParams = {
  queryKey: [string, string | number];
};
export type DeletePostParams = {
  postId: string | number;
  authToken: string;
};
export const useDeletePost = (invalidateQueryParams: UseDeleteParams) => {
  const queryClient = useQueryClient();

  const mutationResult = useMutation({
    mutationFn: deletePost,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: invalidateQueryParams.queryKey,
      });
    },
  });

  return mutationResult;
};
