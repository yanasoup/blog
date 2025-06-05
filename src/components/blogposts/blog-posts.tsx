import type { Post, GetPostsResponse } from '@/models/post';
import { cn, formatDate } from '@/lib/utils';
import {
  useGetMostLikedPosts,
  useGetRecommendedPosts,
} from '@/hooks/useGetPost';
import { BeatLoader } from 'react-spinners';
import { Icon } from '@iconify-icon/react';
import React, { useState } from 'react';
import { useUpdatePostLike } from '@/hooks/useUpdatePost';
const pageSize = import.meta.env.VITE_BLOG_PAGE_SIZE;
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
import { NavLink } from 'react-router';
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

  const { mutate: updatePostLikeFn } = useUpdatePostLike();

  async function handleUpdatePost(id: number) {
    updatePostLikeFn(id);
    setLikedPost((prev) => [...prev, id]);
    dispatch(addToLikedPost(id));
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
      <div className='flex-10 basis-80 border-b-4 border-neutral-300 p-4 md:pr-12 lg:border-b-0'>
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

type PostCardProps = Post & {
  updatePostHandler: (id: number) => void;
  isAlreadyLiked?: boolean;
};
const PostCard: React.FC<PostCardProps> = ({ ...post }) => {
  const [isLiked, setIsLiked] = React.useState(post.isAlreadyLiked);
  const [totalLikes, setTotalLikes] = React.useState(post.likes);

  async function handleLike() {
    setIsLiked(!isLiked);
    setTotalLikes(isLiked ? totalLikes - 1 : totalLikes + 1);
    post.updatePostHandler(post.id);
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='mt-6 flex flex-wrap gap-6'>
        <div className='flex-center h-full w-full flex-1 basis-80 overflow-hidden'>
          <img
            className='flex-1 rounded-xl object-contain'
            src={post.imageUrl}
          />
        </div>
        <div className='flex-1 basis-80'>
          <h3 className='text-md-bold md:text-xl-bold text-neutral-900'>
            <NavLink to={`/post/${post.id}`}>{post.title}</NavLink>
          </h3>
          <div className='mt-3 flex gap-2'>
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className='text-xs-regular rounded-lg border border-neutral-300 px-2 py-0 text-neutral-900'
              >
                {tag}
              </span>
            ))}
          </div>
          <div className='text-xs-regular md:text-sm-regular mt-3 line-clamp-2 text-neutral-900'>
            {post.content}
          </div>
          <div className='mt-3 flex items-center gap-3'>
            <div className='flex-center flex gap-2'>
              <img
                className='size-10 rounded-full object-contain'
                src='https://placehold.co/40'
              />
              <span className='text-xs-medium md:text-sm-medium text-neutral-900'>
                {post.author.name}
              </span>
            </div>
            <div className='size-1 rounded-full bg-neutral-400'></div>
            <div className='flex-center flex'>
              <span className='text-xs-regular md:text-sm-regular text-neutral-600'>
                {formatDate(post.createdAt)}
              </span>
            </div>
          </div>
          <div className='mt-3 flex items-center gap-4'>
            <div className='like-count flex-center gap-1.5'>
              <Icon
                icon={isLiked ? 'streamline:like-1-solid' : 'streamline:like-1'}
                size={20}
                className={cn(
                  'cursor-pointer',
                  isLiked ? 'text-primary-300' : 'text-neutral-600'
                )}
                onClick={handleLike}
              />
              <span className='text-xs-regular md:text-sm-regular text-neutral-600'>
                {totalLikes}
              </span>
            </div>
            <div className='comment-count flex-center gap-1.5'>
              <Icon
                icon='fluent:comment-24-regular'
                size={20}
                className='text-neutral-600'
              />
              <span className='text-xs-regular md:text-sm-regular text-neutral-600'>
                {post.comments}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className='h-0.25 w-full bg-neutral-300' />
    </div>
  );
};
const PostCardLite: React.FC<PostCardProps> = ({ ...post }) => {
  const [isLiked, setIsLiked] = React.useState(post.isAlreadyLiked);
  const [totalLikes, setTotalLikes] = React.useState(post.likes);

  async function handleLike() {
    setIsLiked(!isLiked);
    setTotalLikes(isLiked ? totalLikes - 1 : totalLikes + 1);
    post.updatePostHandler(post.id);
  }

  return (
    <div className='mt-5 flex flex-col gap-5 first:mt-0'>
      <div className='flex flex-wrap gap-6'>
        <div className='flex-1 basis-80'>
          <h3 className='text-md-bold md:text-xl-bold text-neutral-900'>
            {post.title}
          </h3>
          <div className='text-xs-regular md:text-sm-regular mt-3 line-clamp-2 text-neutral-900'>
            {post.content}
          </div>
          <div className='mt-3 flex items-center gap-4'>
            <div className='like-count flex-center gap-1.5'>
              <Icon
                icon={isLiked ? 'streamline:like-1-solid' : 'streamline:like-1'}
                size={20}
                className='cursor-pointer text-neutral-600'
                onClick={handleLike}
              />
              <span className='text-xs-regular md:text-sm-regular text-neutral-600'>
                {totalLikes}
              </span>
            </div>
            <div className='comment-count flex-center gap-1.5'>
              <Icon
                icon='fluent:comment-24-regular'
                size={20}
                className='text-neutral-600'
              />
              <span className='text-xs-regular md:text-sm-regular text-neutral-600'>
                {post.comments}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className='h-0.25 w-full bg-neutral-300' />
    </div>
  );
};

type BlogPostType = 'recommended' | 'most-liked';
type BlogPagerProps = Omit<GetPostsResponse, 'data'> & {
  onPageChange: (page: number, type: BlogPostType) => void;
  type: BlogPostType;
};
const BlogPager: React.FC<BlogPagerProps> = ({
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
    onPageChange(clamped, type);
  };
  const renderPageNumbers = () => {
    const pageButtons = [];

    pageButtons.push(
      <PaginationItem key='prevBtn'>
        <PaginationPrevious
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        />
      </PaginationItem>
    );

    for (let i = 1; i <= lastPage; i++) {
      if (i === 1 || i === lastPage || Math.abs(i - currentPage) <= 1) {
        pageButtons.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => goToPage(i)}
              isActive={i === currentPage}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (
        (i === currentPage - 2 && currentPage > 4) ||
        (i === currentPage + 2 && currentPage < total - 3)
      ) {
        pageButtons.push(
          <PaginationItem key='elipsisBtn'>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    pageButtons.push(
      <PaginationItem key='nextBtn'>
        <PaginationNext
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === lastPage}
        />
      </PaginationItem>
    );

    return pageButtons;
  };

  return (
    <Pagination className='mt-6'>
      <PaginationContent>{renderPageNumbers()}</PaginationContent>
    </Pagination>
  );
};
export default BlogPosts;
