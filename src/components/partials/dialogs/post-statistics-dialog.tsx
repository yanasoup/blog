import React from 'react';

import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../../ui/dialog';
import { XIcon } from 'lucide-react';
import { BeatLoader } from 'react-spinners';
import { TabsList, Tabs, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn, formatDate } from '@/lib/utils';
import { Icon } from '@iconify-icon/react';
import {
  useGetComments,
  UseGetPostParams,
  useGetLikes,
} from '@/hooks/useGetPost';
import UserBadgeOccupation from '@/components/partials/user-badge-occupation';
import { Comment } from '@/models/post';

interface DialogProps extends React.ComponentProps<typeof Dialog> {
  title: string;
  postId: number;
  // description: string;
}

const PostStatisticDialog: React.FC<DialogProps> = ({
  title = 'Statistic',
  postId,
  // description,
  ...props
}) => {
  const paramsLikes: UseGetPostParams = {
    qkey: 'post-likes',
    postId: postId,
  };

  console.log('paramsLikes', paramsLikes);
  const { isFetching: isFetchingLikes } = useGetLikes(paramsLikes);

  const paramsComments: UseGetPostParams = {
    qkey: 'post-comments',
    postId: postId,
  };
  const {
    data: comments,
    isFetching: isFetchingComments,
    totalData: totalComments,
  } = useGetComments(paramsComments);

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogBody
          className='mx-auto overflow-scroll px-4 py-6 md:px-6 md:py-6'
          style={{
            width: 'clamp(20rem, 42.63vw, 33.25rem)',
          }}
        >
          <DialogTitle className='flex items-center justify-between'>
            <p className='text-md-bold lg:text-xl-bold text-left text-neutral-950'>
              {title}
            </p>
            <DialogClose asChild>
              <XIcon size={24} className='cursor-pointer' />
            </DialogClose>
          </DialogTitle>
          <DialogDescription className='lg:text-md-regular text-sm-regular py-6 text-left text-neutral-600'>
            <div className='mt-5'>
              <Tabs defaultValue='like'>
                <TabsList className='flex items-center border-b border-neutral-300'>
                  <TabsTrigger value='like' className='flex items-center gap-2'>
                    <Icon
                      icon='streamline:like-1'
                      size={20}
                      className={cn('cursor-pointer')}
                    />
                    Like
                  </TabsTrigger>
                  <TabsTrigger
                    value='comment'
                    className='flex items-center gap-2'
                  >
                    <Icon
                      icon='fluent:comment-24-regular'
                      size={20}
                      className={cn('cursor-pointer')}
                    />
                    Comment
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value='like'
                  className='max-h-[50vh] overflow-y-auto py-5'
                >
                  <div className='flex flex-col items-start justify-between gap-4 border-b border-neutral-300 pb-5'>
                    {isFetchingLikes && (
                      <div className='flex-center mt-6 flex flex-col'>
                        <p className='text-xs-regular text-neutral-500'>
                          Loading likes...
                        </p>
                        <BeatLoader
                          color='#d5d7da'
                          className='text-white'
                          size={16}
                        />
                      </div>
                    )}
                    {new Array(8).fill(null).map((_, index) => (
                      <UserBadgeOccupation
                        key={index}
                        name={`Dummy-User-${index + 1}`}
                        avatarUrl='https://placehold.co/50'
                        occupation='Frontend Developer'
                      />
                    ))}
                    {/* {likes?.map((user: BlogUser) => (
                      <UserBadgeOccupation
                        key={user.id}
                        name={user.name}
                        avatarUrl={
                          user.avatarUrl
                            ? user.avatarUrl
                            : 'https://placehold.co/50'
                        }
                        occupation='Frontend Developer'
                      />
                    ))} */}
                  </div>
                </TabsContent>
                <TabsContent value='comment' className='py-5'>
                  <div className='flex flex-col justify-between pb-5'>
                    {isFetchingComments && (
                      <div className='flex-center mt-6 flex flex-col'>
                        <p className='text-xs-regular text-neutral-500'>
                          Loading comments...
                        </p>
                        <BeatLoader
                          color='#d5d7da'
                          className='text-white'
                          size={16}
                        />
                      </div>
                    )}
                    {totalComments === 0 && (
                      <div className='flex flex-col justify-between pb-5'>
                        no comments found
                      </div>
                    )}
                    {comments?.map((comment: Comment) => (
                      <div
                        key={comment.id}
                        className='mt-3 flex flex-col gap-2 border-b border-neutral-300 pb-3 last:border-b-0'
                      >
                        <div className='flex items-center gap-2'>
                          <img
                            src={
                              comment.author.avatarUrl
                                ? comment.author.avatarUrl
                                : 'https://placehold.co/48'
                            }
                            className='size-12 rounded-full'
                          />
                          <div className='flex flex-col'>
                            <span className='text-xs-semibold lg:text-sm-semibold text-neutral-900'>
                              {comment.author.name}
                            </span>
                            <span className='text-xs-regular lg:text-sm-regular text-neutral-600'>
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                        </div>
                        <p className='text-xs-regular lg:text-sm-regular text-neutral-900'>
                          {comment.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </DialogDescription>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export default PostStatisticDialog;
