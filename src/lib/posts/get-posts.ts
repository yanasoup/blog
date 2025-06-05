import { useQuery } from '@tanstack/react-query';
import { customAxios } from '@/lib/customAxios';
import type { Post, PostsResponse } from '@/models/post';

export const useGetRecommendedPosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async (): Promise<PostsResponse> => {
      const response = await customAxios.get(
        '/posts/recommended?limit=10&page=1'
      );
      return response.data;
    },
  });
};
