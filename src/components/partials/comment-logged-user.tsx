import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { UserBadge } from './user-badge-occupation';

const CommentLoggedUser = () => {
  const uiuxState = useSelector((state: RootState) => state.uiux);
  return (
    <div className='flex items-center justify-start gap-2'>
      <UserBadge avatarUrl={uiuxState.authUser?.avatarUrl || ''} size={10} />
      <div className='flex items-center justify-start'>
        <span className='text-xs-semibold md:text-sm-semibold text-neutral-900'>
          {uiuxState.authUser?.name}
        </span>
      </div>
    </div>
  );
};

export default CommentLoggedUser;
