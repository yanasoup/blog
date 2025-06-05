import { NavLink } from 'react-router';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import UserProfileButton from './user-profile-button';
import { ArrowLeftIcon } from 'lucide-react';

const EditingNavigation = () => {
  const uiuxState = useSelector((state: RootState) => state.uiux);
  return (
    <div className='border-b border-neutral-300'>
      <header className='custom-container flex h-20 items-center justify-between'>
        <div>
          <NavLink to='/' className='flex-center flex gap-4'>
            <ArrowLeftIcon className='size-6 text-neutral-900' />
            <h1 className='display-xs-bold text-neutral-900'>Write Post</h1>
          </NavLink>
        </div>

        <nav className=''>
          {uiuxState.isAuthenticated && <UserProfileButton />}
        </nav>
      </header>
    </div>
  );
};

export default EditingNavigation;
