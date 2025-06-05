import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const CommentLoggedUser = () => {
  const uiuxState = useSelector((state: RootState) => state.uiux);
  return (
    <div className='flex items-center justify-start gap-2'>
      <img
        className='size-10 rounded-full object-contain'
        src={
          uiuxState.authUser?.avatarUrl
            ? uiuxState.authUser?.avatarUrl
            : 'https://placehold.co/40'
        }
      />
      <div className='flex items-center justify-start'>
        <span className='text-xs-semibold md:text-sm-semibold text-neutral-900'>
          {uiuxState.authUser?.name}
        </span>
      </div>
    </div>
  );
};

export default CommentLoggedUser;
