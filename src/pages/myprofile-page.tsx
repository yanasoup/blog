import React from 'react';
import Navigation from '@/components/partials/navigation';
import DebugBox from '@/redux/debug-box';

import { RootState } from '@/redux/store';
import { NavLink } from 'react-router';
import { TabsList, Tabs, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import { useGetMyPosts } from '@/hooks/useGetPost';
import { BeatLoader } from 'react-spinners';
import { Post } from '@/models/post';
import { formatDateTime } from '@/lib/utils';
import { BlogPager } from '@/components/blogposts/blog-posts';

import { PenLineIcon } from 'lucide-react';

import type { UseGetPostsParams } from '@/hooks/useGetPost';

import MyConfirmationDialog from '@/components/partials/dialogs/confirmation-dialog';

import { DeletePostParams, useDeletePost } from '@/hooks/useDeletePost';
import PostStatisticDialog from '@/components/partials/dialogs/post-statistics-dialog';
import { useSelector } from 'react-redux';
import UserBadgeOccupation from '@/components/partials/user-badge-occupation';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import UpdatePasswordForm from '@/components/forms/update-password-form';
import { useUpdatePasswordParams, useUpdatePassword } from '@/hooks/useAuth';
import EditProfileDialog from '@/components/partials/dialogs/edit-profile-dialog';
import { useUpdateProfile, UpdateProfileParams } from '@/hooks/useAuth';
import { customAxios } from '@/lib/customAxios';
import { setAuthUser } from '@/redux/ui-slice';
import { useDispatch } from 'react-redux';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
export const MyProfilelPage: React.FC = () => {
  const dispatch = useDispatch();
  const [showStatsDialog, setShowStatsDialog] = React.useState(false);
  const uiuxState = useSelector((state: RootState) => state.uiux);
  const [currentPage, setcurrentPage] = React.useState(1);
  const [showEditProfileDlg, setShowEditProfileDlg] = React.useState(false);
  const [showDeleteDlg, setShowDeleteDlg] = React.useState(false);
  const [selectedPostId, setSelectedPostId] = React.useState<number | null>(
    null
  );

  const {
    error: deleteError,
    isSuccess: isDeleteSuccess,
    isPending: isDeleting,
    mutate: deletePostFn,
  } = useDeletePost({
    queryKey: ['my-posts', currentPage],
  });

  const getPostsParams: UseGetPostsParams = [
    'my-posts',
    { limit: 2, page: currentPage },
  ];
  const {
    Posts: posts,
    error,
    isFetching,
    totalData,
  } = useGetMyPosts(getPostsParams);

  const showDeleteDlgHandler = (postId: number) => {
    setShowDeleteDlg(true);
    setSelectedPostId(postId);
  };

  const confirmDeleteHandler = (postId: number) => {
    const deleteParams: DeletePostParams = {
      postId: postId,
      authToken: uiuxState?.apiToken || '',
    };
    deletePostFn(deleteParams);
  };

  function handlePageChange(page: number) {
    setcurrentPage(page);
  }

  const showStatsDlgHandler = (postId: number) => {
    setShowStatsDialog(true);
    setSelectedPostId(postId);
  };

  const {
    mutate: updatePassFn,
    isSuccess: changePassSuccess,
    error: changePassError,
    isPending: changePassPending,
  } = useUpdatePassword();
  type UpdatePassParams = Omit<useUpdatePasswordParams, 'authToken'>;

  const onUpdatePasswordFormSubmit = (updateparams: UpdatePassParams) => {
    const data = { ...updateparams, authToken: uiuxState?.apiToken || '' };
    updatePassFn(data);
  };

  const {
    mutate: updateProfileFn,
    isSuccess: changeProfileSuccess,
    isPending: changeProfilePending,
  } = useUpdateProfile();
  type UpdateUserProfileParams = Omit<UpdateProfileParams, 'authToken'>;
  const onUpdateProfileFormSubmit = (updateparams: UpdateUserProfileParams) => {
    const data = { ...updateparams, authToken: uiuxState?.apiToken || '' };
    updateProfileFn(data);
  };

  React.useEffect(() => {
    if (changePassSuccess) {
      toast.success('Update Success', {
        description: `Your password successfully updated`,
      });
    } else if (changePassError instanceof AxiosError) {
      toast.error('Update Failed!', {
        description: `${changePassError?.response?.data?.message}`,
      });
    }
  }, [changePassSuccess, changePassError]);

  React.useEffect(() => {
    if (isDeleteSuccess) {
      setShowDeleteDlg(false);
    }
  }, [isDeleteSuccess]);

  React.useEffect(() => {
    if (isDeleteSuccess) {
      setShowDeleteDlg(false);
      toast('Delete Success', {
        description: `Post successfully deleted`,
        action: {
          label: 'Ok',
          onClick: () => {},
        },
      });
    } else if (deleteError instanceof AxiosError) {
      toast('Delete Failed!', {
        description: `${deleteError?.response?.data?.message}`,
        action: {
          label: 'Ok',
          onClick: () => {},
        },
      });
    }
  }, [isDeleteSuccess]);

  React.useEffect(() => {
    {
      deleteError &&
        toast('Delete Failed', {
          description: `Error: ${deleteError}`,
          action: {
            label: 'Ok',
            onClick: () => console.log('Ok'),
          },
        });
    }
  }, [deleteError]);

  React.useEffect(() => {
    if (changeProfileSuccess) {
      toast.success('Update profile Success');

      const getUsersHandler = async (email: string) => {
        const response = await customAxios.get(`/users/${email}`);
        return response.data;
      };
      getUsersHandler(uiuxState.authUser?.email || '').then((authUser) => {
        dispatch(
          setAuthUser({
            id: authUser.id,
            name: authUser.name,
            email: authUser.email,
            avatarUrl: `${apiBaseUrl}${authUser.avatarUrl}`,
            headline: authUser.headline,
          })
        );
        setShowEditProfileDlg(false);
      });
    }
  }, [changeProfileSuccess]);
  return (
    <div>
      <Navigation />
      <DebugBox visible={false} />
      <div className='custom-container max-w-[53rem] pt-12'>
        <div className='flex items-center justify-between rounded-xl border border-neutral-300 px-4 py-3 lg:px-6 lg:py-4'>
          <UserBadgeOccupation
            name={uiuxState.authUser?.name || 'Guest'}
            avatarUrl={
              uiuxState.authUser?.avatarUrl
                ? uiuxState.authUser?.avatarUrl
                : 'https://placehold.co/50'
            }
            occupation={uiuxState.authUser?.headline || 'Frontend Developer'}
          />
          <NavLink
            to='#'
            onClick={() => setShowEditProfileDlg(true)}
            className='text-primary-300 text-xs-semibold lg:text-sm-semibold underline'
          >
            Edit Profile
          </NavLink>
        </div>

        <div className='mt-5'>
          <Tabs defaultValue='post'>
            <TabsList>
              <TabsTrigger value='post'>Your Post</TabsTrigger>
              <TabsTrigger value='password'>Change Password</TabsTrigger>
            </TabsList>
            <TabsContent value='post' className='py-5'>
              <div className='flex items-center justify-between border-b border-neutral-300 pb-5'>
                <span>({posts.total}) Post</span>
                <NavLink
                  to='/write-post'
                  className='bg-primary-300 text-xs-semibold lg:text-sm-semibold flex-center h-11 gap-2 rounded-full px-11 py-3'
                >
                  <PenLineIcon className='size-6 text-white' />
                  <span className='text-xs-semibold lg:text-sm-semibold text-white'>
                    Write Post
                  </span>
                </NavLink>
              </div>
              {isFetching && (
                <div className='flex-center mt-5 flex'>
                  <BeatLoader
                    color='#d5d7da'
                    className='text-white'
                    size={16}
                  />
                </div>
              )}
              {posts.data.map((post: Post) => (
                <PostCard
                  {...post}
                  key={post.id}
                  onStartDelete={() => showDeleteDlgHandler(post.id)}
                  onShowStats={() => showStatsDlgHandler(post.id)}
                />
              ))}
              {error && (
                <div className='text-xs-regular md:text-sm-regular text-neutral-900'>
                  failed to fetch blog posts!
                </div>
              )}

              {totalData > 1 && (
                <BlogPager
                  total={posts?.total}
                  page={posts?.page}
                  lastPage={posts?.lastPage}
                  onPageChange={handlePageChange}
                />
              )}
            </TabsContent>
            <TabsContent value='password' className='py-5'>
              <UpdatePasswordForm
                onSubmit={onUpdatePasswordFormSubmit}
                isLoading={changePassPending}
              />
            </TabsContent>
          </Tabs>
        </div>
        <MyConfirmationDialog
          title='Are you sure to delete?'
          description='Are you sure to delete this post?'
          onConfirm={() =>
            selectedPostId !== null && confirmDeleteHandler(selectedPostId)
          }
          onCancel={() => setSelectedPostId(null)}
          open={showDeleteDlg}
          onOpenChange={setShowDeleteDlg}
          showLoader={isDeleting}
          postId={selectedPostId || 0}
        />
        <PostStatisticDialog
          title='Post Statistics'
          open={showStatsDialog}
          postId={selectedPostId || 0}
          onOpenChange={setShowStatsDialog}
        />
        <EditProfileDialog
          onConfirm={onUpdateProfileFormSubmit}
          showLoader={changeProfilePending}
          open={showEditProfileDlg}
          onOpenChange={setShowEditProfileDlg}
        />
      </div>
    </div>
  );
};

type PostCardProps = Post & {
  onStartDelete: (id: number) => void;
  // onStartEdit: () => void;
  onShowStats: (id: number) => void;
};
const PostCard: React.FC<PostCardProps> = ({
  onStartDelete,
  onShowStats,
  ...post
}) => {
  return (
    <div className='flex flex-col gap-5'>
      <div className='mt-5 flex flex-wrap gap-6'>
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
          <div className='mt-3 flex h-6 items-center gap-3'>
            <div className='flex-center flex'>
              <span className='text-xs-regular text-neutral-700'>
                Created {formatDateTime(post.createdAt)}
              </span>
            </div>
            <div className='h-[70%] w-0.25 bg-neutral-300'></div>
            <div className='flex-center flex'>
              <span className='text-xs-regular text-neutral-700'>
                Last updated {formatDateTime(post.createdAt)}
              </span>
            </div>
          </div>

          <div className='mt-3 flex h-7 items-center gap-3 divide-none divide-neutral-300 text-center'>
            <NavLink
              to={`#`}
              className='text-xs-semibold md:text-sm-semibold text-primary-300 underline'
              onClick={() => onShowStats(post.id)}
            >
              Statistic
            </NavLink>
            <div className='h-[70%] w-0.25 bg-neutral-300' />

            <NavLink
              to={`#`}
              className='text-xs-semibold md:text-sm-semibold text-primary-300 underline'
            >
              Edit
            </NavLink>
            <div className='h-[70%] w-0.25 bg-neutral-300' />
            <NavLink
              to={`#`}
              className='text-xs-semibold md:text-sm-semibold text-[#EE1D52] underline'
              onClick={() => onStartDelete(post.id)}
            >
              Delete
            </NavLink>
          </div>
        </div>
      </div>
      <div className='h-0.25 w-full bg-neutral-300' />
    </div>
  );
};

export default MyProfilelPage;
