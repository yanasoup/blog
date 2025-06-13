import React from 'react';
import { Post } from '@/models/post';

import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

import { Icon } from '@iconify-icon/react';
import { useGetUser } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { BeatLoader } from 'react-spinners';
import DOMPurify from 'dompurify';
import { UserBadge } from '../partials/user-badge-occupation';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

type PostDetailProps = {
  post: Post;
  onLiked: (id: number) => void;
  isAlreadyLiked: boolean;
  isEnabled?: boolean;
  isLikedSuccess?: boolean;
  isError?: boolean;
  error?: Error;
};
const PostDetail: React.FC<PostDetailProps> = ({
  post,
  onLiked,
  isAlreadyLiked,
  isEnabled,
}) => {
  const [isLiked, setIsLiked] = React.useState(isAlreadyLiked);
  const [totalLikes, setTotalLikes] = React.useState(post.likes);
  const [isImagedLoaded, setIsImagedLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const { data: articlleAuthor } = useGetUser(post.author.email);
  const htmlContent = DOMPurify.sanitize(post.content);

  async function handleLike() {
    if (isEnabled) {
      setIsLiked(!isLiked);
      setTotalLikes(isLiked ? totalLikes - 1 : totalLikes + 1);
      onLiked(post.id);
    } else {
      toast.error('please login first to like this post');
    }
  }

  // useEffect(() => {
  //   if (!isLikedSuccess) {
  //     toast.error('failed to like post');
  //     setTotalLikes(isLiked ? totalLikes - 1 : totalLikes + 1);
  //     onLiked(post.id);
  //   }
  // }, [isLikedSuccess]);

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
            <UserBadge
              avatarUrl={
                articlleAuthor?.avatarUrl
                  ? `${apiBaseUrl}${articlleAuthor?.avatarUrl}`
                  : ''
              }
              size={10}
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
          {post.imageUrl !== '' && !isImagedLoaded && (
            <div className='flex h-full w-full flex-col items-center justify-center gap-2 text-neutral-200'>
              <BeatLoader color='#ded6d6' />
              <p className='text-xs-regular text-neutral-400'>
                Loading image...
              </p>
            </div>
          )}

          <img
            // className='h-65 w-auto flex-1 rounded-xl object-cover'
            className='min-h-64.5 flex-1 rounded-xl border-0 bg-neutral-300 object-cover md:h-auto md:w-85'
            src={
              imageError
                ? `https://placehold.co/400x300?text=${post.title}`
                : post.imageUrl
            }
            onLoad={() => setIsImagedLoaded(true)}
            onError={() => setImageError(true)}
          />
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          className='text-xs-regular md:text-sm-regular mt-4 text-neutral-900'
        />
      </div>
    </div>
  );
};

export default PostDetail;
