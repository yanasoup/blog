import React from 'react';
import { Post } from '@/models/post';

import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

import { Icon } from '@iconify-icon/react';
import { useGetUser } from '@/hooks/useAuth';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

type PostDetailProps = {
  post: Post;
  onLiked: (id: number) => void;
  isAlreadyLiked: boolean;
};
const PostDetail: React.FC<PostDetailProps> = ({
  post,
  onLiked,
  isAlreadyLiked,
}) => {
  const [isLiked, setIsLiked] = React.useState(isAlreadyLiked);
  const [totalLikes, setTotalLikes] = React.useState(post.likes);

  const { data: articlleAuthor } = useGetUser(post.author.email);
  // console.log('isLiked', isLiked);

  async function handleLike() {
    setIsLiked(!isLiked);
    setTotalLikes(isLiked ? totalLikes - 1 : totalLikes + 1);
    onLiked(post.id);
  }

  return (
    <div className='mt-6 flex flex-col gap-6'>
      <div className='flex-1 basis-80'>
        <h1 className='text-md-bold md:text-xl-bold text-neutral-900'>
          {post.title}
        </h1>
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
        <div className='flex items-center gap-3 border-b border-neutral-300 py-4'>
          <div className='flex-center flex gap-2'>
            <img
              className='size-10 rounded-full object-contain'
              src={
                articlleAuthor?.avatarUrl
                  ? `${apiBaseUrl}${articlleAuthor?.avatarUrl}`
                  : 'https://placehold.co/40'
              }
            />
            <span className='text-xs-medium md:text-sm-medium text-neutral-900'>
              {post.author.name}
            </span>
          </div>
          <div className='size-1 rounded-full bg-neutral-400' />
          <div className='flex-center flex'>
            <span className='text-xs-regular md:text-sm-regular text-neutral-600'>
              {formatDate(post.createdAt)}
            </span>
          </div>
        </div>
        <div className='flex items-center gap-4 border-b border-neutral-300 py-4'>
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
        <div className='flex-center mt-4 h-auto w-full flex-1 basis-80 overflow-hidden'>
          <img
            className='flex-1 rounded-xl object-contain'
            src={post.imageUrl}
          />
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: post.content }}
          className='text-xs-regular md:text-sm-regular mt-4 text-neutral-900'
        />
      </div>
    </div>
  );
};

export default PostDetail;
