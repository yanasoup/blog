import { customAxios } from '@/lib/customAxios';
import type { Post } from '@/models/post';
import { useMutation, useQueryClient } from '@tanstack/react-query';

async function updatePostLike(id: number, authToken: string): Promise<Post> {
  const response = await customAxios.post(
    `/posts/${id}/like`,
    {},
    {
      headers: {
        // 'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  // const response = await customAxios.patch(`/posts/${id}`, data, {
  //   headers: {
  //     'Content-Type': 'multipart/form-data',
  //     Accept: '*/*',
  //     Authorization: `Bearer ${authToken}`,
  //   },
  // });

  return response.data;
}

export const useUpdatePostLike = () => {
  const queryClient = useQueryClient();

  const updatePostLikeMutation = useMutation({
    mutationFn: ({ id, authToken }: { id: number; authToken: string }) =>
      updatePostLike(id, authToken),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });
  return updatePostLikeMutation;
};

export type UpdatePostParams = {
  id: number;
  data: {
    title: string;
    content: string;
    tags: string[];
    image?: any;
  };
  authToken: string;
};
async function updatePost({
  id,
  data,
  authToken,
}: UpdatePostParams): Promise<Post> {
  const response = await customAxios.patch(`/posts/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: '*/*',
      Authorization: `Bearer ${authToken}`,
    },
  });
  return response.data;
}

export const useUpdatePost = () => {
  const updatePostMutation = useMutation({
    mutationFn: (params: UpdatePostParams) => updatePost(params),
  });
  return updatePostMutation;
};
