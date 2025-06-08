import React from 'react';
import { UseGetCommentsReturn } from '@/models/post';
import { formatDate } from '@/lib/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';

import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { BeatLoader } from 'react-spinners';
import { useSendComment, UseSendCommentParams } from '@/hooks/usePostComments';
import { PostCommentParams } from '@/hooks/usePostComments';
import { toast } from 'sonner';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  comment: z
    .string({
      required_error: 'Please enter a valid email',
    })
    .min(2)
    .max(1000),
});
type FormData = z.infer<typeof formSchema>;
type PostCommentsProps = {
  postId: string | undefined;
  params: UseGetCommentsReturn;
};
const PostComments: React.FC<PostCommentsProps> = ({ params, postId }) => {
  const useCommentParams: UseSendCommentParams = {
    queryKey: ['posts-comments', postId!],
  };

  const {
    isPending: isPostComentLoading,
    isSuccess: isPostComentSuccess,
    mutate: sendComment,
  } = useSendComment(useCommentParams);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: '',
    },
  });

  const handlePostComment = async (data: FormData) => {
    if (!postId) {
      console.error('postId is undefined');
      return;
    }
    // const formData = form.getValues();
    const postData: PostCommentParams = {
      postId,
      authToken: uiuxState.apiToken!,
      data: {
        userId: uiuxState.authUser?.id!,
        content: data.comment,
      },
    };
    sendComment(postData);
  };

  {
    isPostComentSuccess &&
      toast('Comment Saved', {
        description: `Thanks for your comment`,
        action: {
          label: 'Ok',
          onClick: () => console.log('Ok'),
        },
      });
  }
  const uiuxState = useSelector((state: RootState) => state.uiux);
  return (
    <>
      <Form {...form}>
        <form
          className='mx-auto max-w-180 space-y-4 md:space-y-6'
          onSubmit={form.handleSubmit(handlePostComment)}
        >
          <FormField
            control={form.control}
            name='comment'
            render={({ field }) => (
              <FormItem className='mt-5 gap-1 text-left'>
                <FormLabel className='text-sm-semibold text-neutral-950'>
                  Give your Comments
                </FormLabel>
                <Textarea
                  {...field}
                  className='text-sm-regular h-40 w-full rounded-xl border-neutral-300 px-4 py-2 text-left'
                  placeholder='Enter your comment'
                  disabled={isPostComentLoading}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='mt-3 flex items-center justify-end'>
            <Button
              disabled={isPostComentLoading}
              type='submit'
              className='w-fit px-21'
            >
              {isPostComentLoading ? (
                <BeatLoader color='#d5d7da' className='text-white' size={16} />
              ) : (
                'Send'
              )}
            </Button>
          </div>
        </form>
      </Form>

      {params.data && (
        <>
          {params.data.map((comment) => (
            <div
              key={comment.id}
              className='mt-4 flex flex-col gap-2 border-t border-neutral-300 pt-4'
            >
              <div className='flex items-center justify-start gap-2'>
                <img
                  className='size-10 rounded-full object-contain'
                  src={
                    comment.author.avatarUrl
                      ? `${apiBaseUrl}${comment?.author?.avatarUrl}`
                      : 'https://placehold.co/40'
                  }
                />
                <div className='flex flex-col items-start justify-center'>
                  <span className='text-xs-medium md:text-sm-medium text-left text-neutral-900'>
                    {comment.author.name}
                  </span>
                  <span className='text-xs-regular md:text-sm-regular text-left text-neutral-600'>
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
              </div>
              <p className='text-xs-regular md:text-sm-regular text-left text-neutral-900'>
                {comment.content}
              </p>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default PostComments;
