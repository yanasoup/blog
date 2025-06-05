import { customAxios } from '@/lib/customAxios';
import type { Post } from '@/models/post';
import { useMutation, useQueryClient } from '@tanstack/react-query';

async function updatePostLike(id: number): Promise<Post> {
  const response = await customAxios.post(`/posts/${id}/like`);
  return response.data;
}

export const useUpdatePostLike = () => {
  const queryClient = useQueryClient();

  const updatePostLikeMutation = useMutation({
    mutationFn: (id: number) => updatePostLike(id),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });
  return updatePostLikeMutation;
};
