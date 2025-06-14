import type { Post } from '@/models/post';
import { useSearchPosts, SearchPostParams } from '@/hooks/useGetPost';
import { BeatLoader } from 'react-spinners';

import React, { useEffect, useState } from 'react';
import { useUpdatePostLike } from '@/hooks/useUpdatePost';
import { PostCard } from '@/components/partials/post-card';
const pageSize = import.meta.env.VITE_BLOG_PAGE_SIZE;
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import DebugBox from '@/redux/debug-box';
import { addToLikedPost, setSearchTerm } from '@/redux/ui-slice';
import { useDispatch } from 'react-redux';

import { BlogPager } from '@/components/blogposts/blog-posts';

import IconDoc from '@/assets/icons/icon-empyt-document.svg';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { useNavigate } from 'react-router';
import { cn } from '@/lib/utils';
import { useMatch, NavLink } from 'react-router';

const SearchResult = () => {
  const match = useMatch('/search/:searchTerm');
  const q = match?.params.searchTerm;

  const fsearch = React.useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const currentSearchTerm = useSelector(
    (state: RootState) => state.uiux.currentSearchTerm
  );

  const [likedPost, setLikedPost] = React.useState<number[]>([]);
  const dispatch = useDispatch();
  const [postsCurrentPage, setPostsCurrentPage] = useState(1);

  const {
    post,
    isFetching,
    mutate: searchPostFn,
    totalData,
    error,
  } = useSearchPosts();

  const uiuxState = useSelector((state: RootState) => state.uiux);
  const { mutate: updatePostLikeFn } = useUpdatePostLike();

  function handleSearchIputChange(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch(setSearchTerm(e.target.value));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = currentSearchTerm.trim();
    fsearch.current?.reset();
    navigate(`/search/${encodeURIComponent(q)}`);
  }

  async function handleUpdatePost(id: number) {
    if (uiuxState.apiToken !== null) {
      updatePostLikeFn({ id: id, authToken: uiuxState.apiToken! });
      setLikedPost((prev) => [...prev, id]);
      dispatch(addToLikedPost(id));
    }
  }

  function handlePageChange(page: number) {
    setPostsCurrentPage(page);
  }

  useEffect(() => {
    dispatch(setSearchTerm(q || ''));
    if (q) {
      const searchPostsParams2: SearchPostParams = {
        query: q,
        limit: pageSize,
        page: postsCurrentPage,
      };

      searchPostFn(searchPostsParams2);
    }
  }, [q]);

  return (
    <div className='custom-container relative mt-4 flex flex-wrap'>
      <DebugBox visible={false} />

      <div className='flex-center w-full lg:hidden'>
        <form
          onSubmit={handleSubmit}
          className='item-center flex flex-1 lg:hidden'
        >
          <SearchInput
            value={currentSearchTerm}
            onChange={handleSearchIputChange}
          />
        </form>
      </div>

      {isFetching && q && (
        <div className='flex-center mt-6 flex w-full'>
          <BeatLoader color='#d5d7da' className='text-white' size={16} />
        </div>
      )}

      {totalData !== undefined && totalData > 0 && q && (
        <div className={cn('relative mx-auto flex-1 basis-213 xl:pb-12')}>
          {!uiuxState.isAuthenticated && (
            <div className='absolute inset-0 top-0 left-0 z-5 bg-neutral-50 opacity-30' />
          )}

          <h3 className='text-xl-bold md:display-sm-bold mt-3 text-neutral-900'>
            Result For "<span className='border-b-4 border-[#57edd7]'>{q}</span>
            "
          </h3>
          {post?.data.map((post: Post) => (
            <PostCard
              {...post}
              updatePostHandler={handleUpdatePost}
              key={post.id}
              isAlreadyLiked={likedPost.includes(post.id)}
              enabled={uiuxState.isAuthenticated}
              isFetching={isFetching}
            />
          ))}

          {error && (
            <div className='text-xs-regular md:text-sm-regular text-neutral-900'>
              failed to fetch blog posts!
            </div>
          )}
          {totalData !== undefined && totalData > pageSize && (
            <BlogPager
              total={post?.total}
              page={post?.page}
              lastPage={post?.lastPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}

      {totalData === 0 && q && !isFetching && (
        <div
          className='flex-center absolute inset-0 left-1/2 h-[calc(100vh-80px-48px)] w-full basis-80 -translate-x-[50%] flex-col'
          style={{
            width: 'clamp(20rem, 29.81vw, 23.25rem)',
          }}
        >
          <img src={IconDoc} />
          <p className='lg:text-sm-semibold text-xs-semibold mt-6 text-neutral-950'>
            No results found
          </p>
          <p className='lg:text-sm-regular text-xs-regular text-neutral-950'>
            Try using different keywords
          </p>
          <Button asChild className='mt-6 w-fit'>
            <NavLink className='text-sm-semibold h-11 px-13.75 py-2' to='/'>
              Back to Home
            </NavLink>
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchResult;
