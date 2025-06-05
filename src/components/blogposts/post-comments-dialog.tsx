import React from 'react';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../ui/dialog';
import { UseGetPostParams } from '@/hooks/useGetPost';
import { BeatLoader } from 'react-spinners';
import PostComments from './post-comments';
import { XIcon } from 'lucide-react';

interface FormStatusDialogProps extends React.ComponentProps<typeof Dialog> {
  title: string;
  postId: string | undefined;
}
import { useGetComments } from '@/hooks/useGetPost';
import { Icon } from 'lucide-react';

const PostCommentsDialog: React.FC<FormStatusDialogProps> = ({
  title,
  postId,
  ...props
}) => {
  const paramsComments: UseGetPostParams = {
    qkey: 'post-comments-list',
    postId: postId,
  };
  const getCommentsResult = useGetComments(paramsComments);

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogBody
          className='mx-auto overflow-scroll px-4 py-6 md:px-6 md:py-6'
          style={{
            width: 'clamp(21.56rem, 49.12vw, 38.31rem)',
            height: 'clamp(41.13rem, 72.28vw, 56.38rem)',
          }}
        >
          <DialogTitle className='flex items-center justify-between'>
            <h3 className='text-xl-bold lg:display-xs-bold text-left text-neutral-900'>
              Comments ({getCommentsResult.data?.length || 0})
            </h3>
            <DialogClose asChild>
              <XIcon size={24} className='cursor-pointer' />
            </DialogClose>
          </DialogTitle>
          <DialogDescription>
            {getCommentsResult.isLoading && (
              <div className='flex-center mt-6 flex h-[40vh] flex-col'>
                <p className='text-xs-regular text-neutral-500'>
                  Loading comments...
                </p>
                <BeatLoader color='#d5d7da' className='text-white' size={16} />
              </div>
            )}
            {!getCommentsResult.isLoading && getCommentsResult.data && (
              <PostComments params={getCommentsResult} postId={postId} />
            )}
          </DialogDescription>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export default PostCommentsDialog;
