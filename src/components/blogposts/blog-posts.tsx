import type { Post, GetPostsResponse } from '@/models/post';
import { cn } from '@/lib/utils';
import {
  useGetMostLikedPosts,
  useGetRecommendedPosts,
} from '@/hooks/useGetPost';
import { BeatLoader } from 'react-spinners';

import React, { useState } from 'react';
import { useUpdatePostLike } from '@/hooks/useUpdatePost';
import { PostCard, PostCardLite } from '../partials/post-card';
const pageSize = import.meta.env.VITE_BLOG_PAGE_SIZE;
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import type { UseGetPostsParams } from '@/hooks/useGetPost';

import DebugBox from '@/redux/debug-box';
import { addToLikedPost } from '@/redux/ui-slice';
import { useDispatch } from 'react-redux';

const BlogPosts = () => {
  const [likedPost, setLikedPost] = React.useState<number[]>([]);
  const dispatch = useDispatch();
  const [recommendedPostsCurrentPage, setRecommendedPostsCurrentPage] =
    useState(1);
  const [likedPostsCurrentPage, setLikedPostsCurrentPage] = useState(1);
  const defaultPagingParam = {
    limit: pageSize,
    page: recommendedPostsCurrentPage,
  };
  const recommendedPostsParams: UseGetPostsParams = [
    'recommended-posts',
    defaultPagingParam,
  ];
  const {
    Posts: recommendedPosts,
    totalData: totalRecommendedData,
    error,
    isFetching,
  } = useGetRecommendedPosts(recommendedPostsParams);

  const mostLikedPostsParams: UseGetPostsParams = [
    'most-liked-posts',
    { limit: 5, page: likedPostsCurrentPage },
  ];
  const {
    Posts: mostLikedPosts,
    error: mostLikedPostsError,
    isFetching: mostLikedPostsIsFetching,
  } = useGetMostLikedPosts(mostLikedPostsParams);

  const uiuxState = useSelector((state: RootState) => state.uiux);
  const { mutate: updatePostLikeFn } = useUpdatePostLike();

  async function handleUpdatePost(id: number) {
    if (uiuxState.apiToken !== null) {
      updatePostLikeFn({ id: id, authToken: uiuxState.apiToken! });
      setLikedPost((prev) => [...prev, id]);
      dispatch(addToLikedPost(id));
    }
  }

  function handlePageChange(page: number, type: BlogPostType) {
    if (type === 'recommended') {
      setRecommendedPostsCurrentPage(page);
    } else {
      setLikedPostsCurrentPage(page);
    }
  }

  return (
    <div className='custom-container mt-12 flex flex-wrap'>
      <DebugBox visible={false} />
      <div className='relative flex-10 basis-80 border-b-4 border-neutral-300 p-4 md:pr-12 lg:border-b-0'>
        {!uiuxState.isAuthenticated && (
          <div className='absolute inset-0 top-0 left-0 z-5 bg-neutral-50 opacity-30' />
        )}

        <h3 className='text-xl-bold md:display-sm-bold text-neutral-900'>
          Recommend For You
        </h3>
        {isFetching && (
          <div className='flex-center mt-6 flex'>
            <BeatLoader color='#d5d7da' className='text-white' size={16} />
          </div>
        )}
        {recommendedPosts.data.map((post: Post) => (
          <PostCard
            {...post}
            updatePostHandler={handleUpdatePost}
            key={post.id}
            isAlreadyLiked={likedPost.includes(post.id)}
            enabled={uiuxState.isAuthenticated}
          />
        ))}

        {error && (
          <div className='text-xs-regular md:text-sm-regular text-neutral-900'>
            failed to fetch blog posts!
          </div>
        )}

        {totalRecommendedData > 1 && (
          <BlogPager
            total={recommendedPosts?.total}
            page={recommendedPosts?.page}
            lastPage={recommendedPosts?.lastPage}
            onPageChange={handlePageChange}
            type='recommended'
          />
        )}
      </div>
      <div className='w-[345px] shrink-0 flex-grow p-4 text-neutral-800 md:border-l md:border-neutral-300 md:pl-12 lg:flex-grow-0'>
        <h3 className='display-xs-bold mb-5 text-neutral-900'>Most Liked</h3>
        {mostLikedPostsIsFetching && (
          <div className='flex-center mt-6 flex'>
            <BeatLoader color='#d5d7da' className='text-white' size={16} />
          </div>
        )}
        {mostLikedPosts &&
          mostLikedPosts.data.map((post) => (
            <PostCardLite
              {...post}
              updatePostHandler={handleUpdatePost}
              key={post.id}
              isAlreadyLiked={likedPost.includes(post.id)}
              enabled={uiuxState.isAuthenticated}
            />
          ))}

        {mostLikedPostsError && (
          <div className='text-xs-regular md:text-sm-regular text-neutral-900'>
            failed to fetch blog posts!
          </div>
        )}
      </div>
    </div>
  );
};

export type BlogPostType = 'recommended' | 'most-liked' | 'my-posts';
type BlogPagerProps = Omit<GetPostsResponse, 'data'> & {
  onPageChange: (page: number, type: BlogPostType) => void;
  type?: BlogPostType;
};
export const BlogPager: React.FC<BlogPagerProps> = ({
  total = 0,
  page = 0,
  lastPage = 0,
  onPageChange,
  type,
}) => {
  const [currentPage, setCurrentPage] = React.useState(page);
  const goToPage = (page: number) => {
    const clamped = Math.max(1, Math.min(lastPage, page));
    setCurrentPage(clamped);
    onPageChange(clamped, type || 'recommended');
  };
  const renderPageNumbers = () => {
    const pageButtons = [];

    pageButtons.push(
      <PaginationItem key='prevBtn'>
        <PaginationPrevious
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className='lg:text-sm-regular text-xs-regular'
        />
      </PaginationItem>
    );

    for (let i = 1; i <= lastPage; i++) {
      // if (i === 1 || i === lastPage || Math.abs(i - currentPage) <= 1) {
      // if (i === 1 || i === lastPage || i === currentPage) {
      if (i === 1 || i === lastPage || i === currentPage) {
        pageButtons.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => goToPage(i)}
              isActive={i === currentPage}
              className={cn(
                'lg:text-sm-regular text-xs-regular',
                i === currentPage ? 'text-white' : 'text-neutral-900'
              )}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (
        (i === currentPage - 1 && currentPage > 1) ||
        (i === currentPage + 1 && currentPage < total - 3)
      ) {
        pageButtons.push(
          <PaginationItem key={i}>
            <PaginationEllipsis className='lg:text-sm-regular text-xs-regular' />
          </PaginationItem>
        );
      }
    }

    pageButtons.push(
      <PaginationItem key='nextBtn'>
        <PaginationNext
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === lastPage}
          className='lg:text-sm-regular text-xs-regular'
        />
      </PaginationItem>
    );

    return pageButtons;
  };

  return (
    <Pagination className='flex-center mt-6 flex-wrap'>
      <PaginationContent className='flex-center basis-80'>
        {renderPageNumbers()}
      </PaginationContent>
    </Pagination>
  );
};
export default BlogPosts;
