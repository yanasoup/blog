import React from 'react';
import { formatDate } from '@/lib/utils';
import { Icon } from '@iconify-icon/react';
import { NavLink } from 'react-router';
import type { Post } from '@/models/post';
import { cn } from '@/lib/utils';
type PostCardProps = Post & {
  updatePostHandler: (id: number) => void;
  isAlreadyLiked?: boolean;
  enabled?: boolean;
};
export const PostCard: React.FC<PostCardProps> = ({ ...post }) => {
  const [isLiked, setIsLiked] = React.useState(post.isAlreadyLiked);
  const [totalLikes, setTotalLikes] = React.useState(post.likes);

  async function handleLike() {
    if (post.enabled) {
      setIsLiked(!isLiked);
      setTotalLikes(isLiked ? totalLikes - 1 : totalLikes + 1);
      post.updatePostHandler(post.id);
    }
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
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
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
export const PostCardLite: React.FC<PostCardProps> = ({ ...post }) => {
  const [isLiked] = React.useState(post.isAlreadyLiked);
  const [totalLikes] = React.useState(post.likes);

  // async function handleLike() {
  //   if (post.enabled) {
  //     setIsLiked(!isLiked);
  //     setTotalLikes(isLiked ? totalLikes - 1 : totalLikes + 1);
  //     post.updatePostHandler(post.id);
  //   }
  // }

  return (
    <div className='mt-5 flex flex-col gap-5 first:mt-0'>
      <div className='flex flex-wrap gap-6'>
        <div className='flex-1 basis-80'>
          <h3 className='text-md-bold md:text-xl-bold text-neutral-900'>
            <NavLink to={`/post/${post.id}`}>{post.title}</NavLink>
          </h3>
          <div className='text-xs-regular md:text-sm-regular mt-3 line-clamp-2 text-neutral-900'>
            <span dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
          <div className='mt-3 flex items-center gap-4'>
            <div className='like-count flex-center gap-1.5'>
              <Icon
                icon={isLiked ? 'streamline:like-1-solid' : 'streamline:like-1'}
                size={20}
                className='cursor-default text-neutral-600'
                // onClick={handleLike}
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
