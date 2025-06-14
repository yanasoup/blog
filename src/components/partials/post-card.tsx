import React from 'react';
import { formatDate } from '@/lib/utils';
import { Icon } from '@iconify-icon/react';
import { NavLink } from 'react-router';
import type { Post } from '@/models/post';
import { cn } from '@/lib/utils';
import { BeatLoader } from 'react-spinners';
import DOMPurify from 'dompurify';
import { UserBadge } from './user-badge-occupation';

type PostCardProps = Post & {
  updatePostHandler: (id: number) => void;
  isAlreadyLiked?: boolean;
  enabled?: boolean;
  isFetching?: boolean;
  showImageCover?: boolean;
};
export const PostCard: React.FC<PostCardProps> = ({
  showImageCover = true,
  ...post
}) => {
  const [isLiked, setIsLiked] = React.useState(post.isAlreadyLiked);
  const [totalLikes, setTotalLikes] = React.useState(post.likes);
  const [isImagedLoaded, setIsImagedLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  async function handleLike() {
    if (post.enabled) {
      setIsLiked(!isLiked);
      setTotalLikes(isLiked ? totalLikes - 1 : totalLikes + 1);
      post.updatePostHandler(post.id);
    }
  }

  const htmlContent = DOMPurify.sanitize(post.content);
  return (
    <div className='flex flex-col gap-6'>
      <div className='mt-6 flex flex-wrap gap-6'>
        <div
          className={cn(
            // 'relative flex shrink-0 basis-80 items-center justify-center lg:flex lg:justify-start',
            'relative max-lg:flex-1',
            `${!showImageCover ? 'hidden' : ''}`
          )}
        >
          {post.imageUrl !== '' && !isImagedLoaded && (
            <div className='absolute inset-0 flex h-64.5 w-auto flex-col items-center justify-center gap-0 text-neutral-200'>
              <BeatLoader color='#ded6d6' />
              <p className='text-xs-regular text-neutral-400'>
                Loading image...
              </p>
            </div>
          )}
          <NavLink
            to={`/post/${post.id}`}
            className={cn(
              'relative flex shrink-0 basis-80 items-center justify-center lg:flex lg:justify-start',
              'max-lg:flex-1'
            )}
          >
            <img
              className={cn(
                'rounded-xl border-0 object-cover',
                'max-w-21.215rem w-[27.24vw] min-w-[20rem]',
                'max-h-16.13rem h-[20.67vw] min-h-[12.69rem]',
                'md:min-h-64.5 md:min-w-85',
                'max-lg:flex-1'
              )}
              src={
                imageError
                  ? `https://placehold.co/400x300?text=${post.title}`
                  : post.imageUrl
              }
              onLoad={() => setIsImagedLoaded(true)}
              onError={() => setImageError(true)}
              style={{
                width: 'clamp(20rem,27.24vw,21.215rem)',
                height: 'clamp(12.69rem, 20.67vw, 16.13rem)',
              }}
            />
          </NavLink>
        </div>
        <div
          className={cn('basis-109 overflow-hidden')}
          style={{
            width: 'clamp(20rem, 34.94vw, 27.25rem)',
            // height: 'clamp(12.69rem, 20.67vw, 16.13rem)',
          }}
        >
          <h3 className='text-md-bold md:text-xl-bold line-clamp-2 text-neutral-900'>
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
          <div className='mt-3'>
            <p
              dangerouslySetInnerHTML={{ __html: htmlContent }}
              className='text-xs-regular md:text-sm-regular line-clamp-2 overflow-hidden text-neutral-900'
            />
          </div>
          <div className='mt-3 flex items-center gap-3'>
            <div className='flex-center flex gap-2'>
              <UserBadge avatarUrl={post.author.avatarUrl || ''} size={10} />
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
  const htmlContent = DOMPurify.sanitize(post.content);

  return (
    <div className='mt-5 flex flex-col gap-5 first:mt-0'>
      <div className='flex flex-wrap gap-6'>
        <div className='flex-1 basis-80'>
          <h3 className='text-md-bold md:text-xl-bold text-neutral-900'>
            <NavLink to={`/post/${post.id}`}>{post.title}</NavLink>
          </h3>
          <div className='text-xs-regular md:text-sm-regular mt-3 line-clamp-2 flex-1 text-neutral-900'>
            <span
              className='w-full flex-1'
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
          <div className='mt-3 flex items-center gap-4'>
            <div className='like-count flex-center gap-1.5'>
              <Icon
                icon={isLiked ? 'streamline:like-1-solid' : 'streamline:like-1'}
                size={20}
                className='cursor-default text-neutral-600'
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
