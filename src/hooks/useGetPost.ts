import { useQuery } from '@tanstack/react-query';
import type { QueryFunction } from '@tanstack/react-query';
import { customAxios } from '@/lib/customAxios';
import type { GetPostsResponse } from '@/models/post';
import type { AxiosRequestConfig } from 'axios';
import { emptyPostResponse, Post } from '@/models/post';
import type { Comment } from '@/models/post';
import { UseGetCommentsReturn } from '@/models/post';

const pageSize = import.meta.env.VITE_BLOG_PAGE_SIZE;

export function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export const getComments: QueryFunction<Comment[]> = async ({
  queryKey,
  signal,
}) => {
  // await wait(5000);
  const axiosRequestConfig: AxiosRequestConfig = {
    signal,
  };

  const response = await customAxios.get<Comment[]>(
    `/comments/${queryKey[1]}`,
    axiosRequestConfig
  );

  return response.data;
};

export const useGetComments = ({
  qkey,
  postId,
}: UseGetPostParams): UseGetCommentsReturn => {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: [qkey, postId],
    queryFn: getComments,
  });

  const respData = data ?? undefined;
  const totalData = data ? data.length : 0;

  return {
    data: respData,
    totalData,
    isLoading,
    isFetching,
    error,
  };
};

export type UseGetPostsParams = [string, { limit: number; page: number }];

type UseGetPostsReturn = {
  Posts: GetPostsResponse;
  totalData: number;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
};

export const getPost: QueryFunction<Post> = async ({ queryKey, signal }) => {
  const axiosRequestConfig: AxiosRequestConfig = {
    signal,
  };

  const response = await customAxios.get<Post>(
    `/posts/${queryKey[1]}`,
    axiosRequestConfig
  );

  return response.data;
};
export type UseGetPostParams = {
  qkey: string;
  postId: number | string | undefined;
};

export type UseGetPostReturn = {
  post: Post | undefined;
  totalData: number;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
};

export const useGetPost = ({
  qkey,
  postId,
}: UseGetPostParams): UseGetPostReturn => {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: [qkey, postId],
    queryFn: getPost,
  });

  const post = data ?? undefined;
  const totalData = data ? 1 : 0;

  return {
    post: post,
    totalData,
    isLoading,
    isFetching,
    error,
  };
};

export const getRecommendedPosts: QueryFunction<
  GetPostsResponse,
  UseGetPostsParams
> = async ({ queryKey, signal }) => {
  // const [qKey, { page:inpPage, limit:inpLimit }] = queryKey;
  const axiosRequestConfig: AxiosRequestConfig = {
    signal,
    params: { page: queryKey[1].page, limit: queryKey[1].limit },
  };

  const response = await customAxios.get<GetPostsResponse>(
    '/posts/recommended',
    axiosRequestConfig
  );

  return response.data;
};

export const useGetRecommendedPosts = ([
  qkey,
  { limit = pageSize, page = 1 },
]: UseGetPostsParams): UseGetPostsReturn => {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: [qkey, { limit: limit, page: page }],
    queryFn: getRecommendedPosts,
  });

  const recommendedPosts = data ?? emptyPostResponse;
  const totalData = data?.total ?? 0;

  return {
    Posts: recommendedPosts,
    totalData,
    isLoading,
    isFetching,
    error,
  };
};

export const getMostLikedPosts: QueryFunction<
  GetPostsResponse,
  UseGetPostsParams
> = async ({ queryKey, signal }) => {
  // const [qKey, { page:inpPage, limit:inpLimit }] = queryKey;
  const axiosRequestConfig: AxiosRequestConfig = {
    signal,
    params: { page: queryKey[1].page, limit: queryKey[1].limit },
  };

  const response = await customAxios.get<GetPostsResponse>(
    '/posts/most-liked',
    axiosRequestConfig
  );
  return response.data;
};

export const useGetMostLikedPosts = ([
  qkey,
  { limit = pageSize, page = 1 },
]: UseGetPostsParams): UseGetPostsReturn => {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: [qkey, { limit: limit, page: page }],
    queryFn: getMostLikedPosts,
  });

  const mostLikedPosts = data ?? emptyPostResponse;
  const totalData = data?.total ?? 0;

  return {
    Posts: mostLikedPosts,
    totalData,
    isLoading,
    isFetching,
    error,
  };
};

export const useGetMyPosts = ([
  qkey,
  { limit = pageSize, page = 1 },
]: UseGetPostsParams): UseGetPostsReturn => {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: [qkey, { limit: limit, page: page }],
    queryFn: getMyPosts,
  });

  const Posts = data ?? emptyPostResponse;
  const totalData = data?.total ?? 0;

  return {
    Posts: Posts,
    totalData,
    isLoading,
    isFetching,
    error,
  };
};

export const getMyPosts: QueryFunction<
  GetPostsResponse,
  UseGetPostsParams
> = async ({ queryKey, signal }) => {
  const axiosRequestConfig: AxiosRequestConfig = {
    signal,
    params: { page: queryKey[1].page, limit: queryKey[1].limit },
  };

  const response = await customAxios.get<GetPostsResponse>(
    '/posts/most-liked',
    axiosRequestConfig
  );
  return response.data;
};

import type { BlogUser } from '@/models/post';
type UseGetLikesReturn = {
  data: BlogUser[] | undefined;
  totalData: number;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
};
export const useGetLikes = ({
  qkey,
  postId,
}: UseGetPostParams): UseGetLikesReturn => {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: [qkey, postId],
    queryFn: getLikes,
    enabled: postId !== 0,
  });

  const respData = data ?? undefined;
  const totalData = Array.isArray(data) ? data.length : 0;

  return {
    data: respData,
    totalData,
    isLoading,
    isFetching,
    error,
  };
};

export const getLikes: QueryFunction<BlogUser[]> = async ({
  queryKey,
  signal,
}) => {
  // await wait(5000);
  const axiosRequestConfig: AxiosRequestConfig = {
    signal,
  };

  const response = await customAxios.get(
    `/posts/${queryKey[1]}/likes`,
    axiosRequestConfig
  );

  return response.data;
};
