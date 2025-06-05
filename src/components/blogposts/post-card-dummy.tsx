import React from 'react';
import { Icon } from '@iconify-icon/react';
export const PostCardDummy = () => {
  const [isLiked, setIsLiked] = React.useState(false);
  const totalLike = 20;

  return (
    <div className='flex flex-col gap-6'>
      <div className='mt-6 flex flex-wrap gap-6'>
        <div className='flex-center h-full w-full flex-1 basis-80 overflow-hidden'>
          <img
            className='flex-1 rounded-xl object-contain'
            src='https://placehold.co/340x258'
          />
        </div>
        <div className='flex-1 basis-80'>
          <h3 className='text-md-bold md:text-xl-bold text-neutral-900'>
            5 Reasons to Learn Frontend Development in 2025
          </h3>
          <div className='mt-3 flex gap-2'>
            <span className='text-xs-regular rounded-lg border border-neutral-300 px-2 py-0 text-neutral-900'>
              Programming
            </span>
            <span className='text-xs-regular rounded-lg border border-neutral-300 px-2 py-0 text-neutral-900'>
              Frontend
            </span>
            <span className='text-xs-regular rounded-lg border border-neutral-300 px-2 py-0 text-neutral-900'>
              Coding
            </span>
          </div>
          <div className='text-xs-regular md:text-sm-regular mt-3 line-clamp-2 text-neutral-900'>
            Frontend development is more than just building beautiful user
            interfaces — it's about crafting user experiences that are fast,
            accessible, and intuitive. As we move into 2025, the demand for
            skilled frontend developers continues to rise.
          </div>
          <div className='mt-3 flex items-center gap-3'>
            <div className='flex-center flex gap-2'>
              <img
                className='size-10 rounded-full object-contain'
                src='https://placehold.co/40'
              />
              <span className='text-xs-medium md:text-sm-medium text-neutral-900'>
                John Doe
              </span>
            </div>
            <div className='size-1 rounded-full bg-neutral-400'></div>
            <div className='flex-center flex'>
              <span className='text-xs-regular md:text-sm-regular text-neutral-600'>
                30 May 2025
              </span>
            </div>
          </div>
          <div className='mt-3 flex items-center gap-4'>
            <div className='like-count flex-center gap-1.5'>
              <Icon
                icon={isLiked ? 'streamline:like-1-solid' : 'streamline:like-1'}
                size={20}
                className='cursor-pointer text-neutral-600'
                onClick={() => setIsLiked(!isLiked)}
              />
              <span className='text-xs-regular md:text-sm-regular text-neutral-600'>
                {isLiked ? totalLike + 1 : totalLike}
              </span>
            </div>
            <div className='comment-count flex-center gap-1.5'>
              <Icon
                icon='fluent:comment-24-regular'
                size={20}
                className='text-neutral-600'
              />
              <span className='text-xs-regular md:text-sm-regular text-neutral-600'>
                Comment
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className='h-0.25 w-full bg-red-300'></div>
    </div>
  );
};
