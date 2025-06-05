import React from 'react';

import { useMatch } from 'react-router';

import PostDetail from '@/components/blogposts/post-detail';
import { cn } from '@/lib/utils';
import {
  useGetComments,
  useGetPost,
  UseGetPostParams,
} from '@/hooks/useGetPost';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useUpdatePostLike } from '@/hooks/useUpdatePost';
import DebugBox from '@/redux/debug-box';
import { BeatLoader } from 'react-spinners';
import { addToLikedPost } from '@/redux/ui-slice';
import { useDispatch } from 'react-redux';
import PostComments from '@/components/blogposts/post-comments';
import PostCommentsDialog from '@/components/blogposts/post-comments-dialog';
import { NavLink } from 'react-router';
import CommentLoggedUser from '@/components/partials/comment-logged-user';

export const PostDetailPage: React.FC = () => {
  const [showAllComments, setShowAllComments] = React.useState(false);

  const uiuxState = useSelector((state: RootState) => state.uiux);
  const dispatch = useDispatch();
  const [likedPost, setLikedPost] = React.useState<number[]>(
    uiuxState.likedPosts
  );

  const match = useMatch('/post/:postId');
  const params: UseGetPostParams = {
    qkey: 'post',
    postId: match?.params.postId,
  };
  const getPostResult = useGetPost(params);

  const paramsComments: UseGetPostParams = {
    qkey: 'post-comments',
    postId: match?.params.postId,
  };
  const getCommentsResult = useGetComments(paramsComments);
  const { mutate: updatePostLikeFn } = useUpdatePostLike();

  async function handleLike(id: number) {
    updatePostLikeFn(id);
    setLikedPost((prev) => [...prev, id]);
    dispatch(addToLikedPost(id));
  }

  return (
    <>
      <DebugBox visible={false} />

      <div className={cn('custom-container max-w-[50rem]')}>
        {getPostResult.isLoading && (
          <div className='flex-center mt-6 flex h-[40vh] flex-col'>
            <p className='text-xs-regular text-neutral-500'>
              Loading article...
            </p>
            <BeatLoader
              color='#d5d7da'
              className='basis-40 text-white'
              size={16}
            />
          </div>
        )}

        {!getPostResult.isLoading && getPostResult.post && (
          <PostDetail
            key={getPostResult.post.id}
            post={getPostResult.post}
            isAlreadyLiked={likedPost.includes(getPostResult.post.id)}
            onLiked={handleLike}
          />
        )}

        <div className='mt-6 mb-10 flex flex-col gap-6'>
          <div className='flex-1 basis-80'>
            <h3 className='text-xl-bold lg:display-xs-bold text-left text-neutral-900'>
              Comments ({getCommentsResult.data?.length || 0})
            </h3>
            <div className='mt-2 flex flex-col gap-2 text-left'>
              <CommentLoggedUser />
            </div>
            {getCommentsResult.isLoading && (
              <div className='flex-center mt-6 flex flex-col'>
                <p className='text-xs-regular text-neutral-500'>
                  Loading comments...
                </p>
                <BeatLoader color='#d5d7da' className='text-white' size={16} />
              </div>
            )}

            {!getCommentsResult.isLoading && getCommentsResult.data && (
              <>
                <PostComments
                  params={getCommentsResult}
                  postId={match?.params.postId}
                />

                <div className='mt-3 lg:mt-4'>
                  <NavLink
                    to='#'
                    className='text-xs-semibold text-primary-300 lg:text-sm-semibold underline'
                    onClick={() => setShowAllComments(true)}
                  >
                    See All Comments
                  </NavLink>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <PostCommentsDialog
        open={showAllComments}
        onOpenChange={setShowAllComments}
        title='Comments'
        postId={match?.params.postId}
      />
    </>
  );
};

export default PostDetailPage;
