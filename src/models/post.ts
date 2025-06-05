export type Post = {
  id: number;
  title: string;
  content: string;
  tags: string[];
  imageUrl: string;
  createdAt: string;
  likes: number;
  comments: number;
  author: {
    id: number;
    name: string;
    email: string;
  };
};

export type GetPostsResponse = {
  data: Post[];
  total?: number;
  page?: number;
  lastPage?: number;
};

export type CreatePostParams = {
  data: {
    title: string;
    content: string;
    tags: string[];
    image: any;
  };
  requestToken: string;
};
export type UseCreatePostParams = {
  // newPost: CreatePostParams;
  queryKey: [string, { limit: number; page: number }];
};

export type InvalidateQueryParams = [string, { limit: number; page: number }];

export type UpdatePostParams = {
  id: number;
  newData: CreatePostParams;
};

export type DeletePostresponse = {
  success: boolean;
};

export const emptyPostResponse = {
  data: [],
  total: 0,
  page: 0,
  lastPage: 0,
};

export type Comment = {
  id: number;
  content: string;
  createdAt: string;
  author: {
    id: number;
    name: string;
    headline: string;
    avatarUrl: string;
  };
};

export type UseGetCommentsReturn = {
  data: Comment[] | undefined;
  totalData: number;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
};

export type SendCommentResponse = {
  id: number;
  content: string;
  author: {
    id: number;
    name: string;
    email: string;
  };
  post: number;
  createdAt: string;
};
