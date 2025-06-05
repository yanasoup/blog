import { customAxios } from '../customAxios';
import type { Post, PostsResponse } from '@/models/post';
import { useQuery } from '@tanstack/react-query';

export const updatePost = (id: number, data: Post) => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async (): Promise<PostsResponse> => {
      const response = await customAxios.patch(`/posts/${id}`, data);
      return response.data;
    },
  });
};
