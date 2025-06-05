import React from 'react';

import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import { useNavigate } from 'react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDispatch } from 'react-redux';
import { setUnauthenticated, resetState } from '@/redux/ui-slice';
import { Icon } from '@iconify-icon/react';
import { useMedia } from 'react-use';

const UserProfileButton = () => {
  const uiuxState = useSelector((state: RootState) => state.uiux);

  const logoutHandler = () => {
    dispatch(setUnauthenticated(true));
  };
  const isLargeIsh = useMedia('(min-width: 1024px', false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (uiuxState.isLoggedOut) {
      dispatch(resetState());
      navigate('/login');
    }
  }, [uiuxState.isLoggedOut]);

  return (
    <>
      {isLargeIsh ? (
        <UserDropdownMenu
          onLogout={logoutHandler}
          children={
            <div className='flex-center flex cursor-pointer gap-2 lg:hidden'>
              <img
                className='size-10 rounded-full object-contain'
                src='https://placehold.co/40'
              />
              <span className='text-xs-medium md:text-sm-medium text-neutral-900'>
                {uiuxState.authUser?.name}
              </span>
            </div>
          }
        />
      ) : (
        <UserDropdownMenu
          onLogout={logoutHandler}
          children={
            <img
              className='size-10 cursor-pointer rounded-full object-contain lg:hidden'
              src='https://placehold.co/40'
            />
          }
        />
      )}
    </>
  );
};

type UserDropdownMenuProps = {
  children: React.ReactNode;
  onLogout: () => void;
};

export const UserDropdownMenu: React.FC<UserDropdownMenuProps> = ({
  children,
  onLogout,
}: UserDropdownMenuProps) => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='start'>
        <DropdownMenuItem
          className='item-center text-sm-regular flex cursor-pointer justify-start'
          onClick={() => navigate('/myprofile')}
        >
          <Icon icon='ci:user-03' className='flex-center' />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          className='item-center text-sm-regular flex cursor-pointer justify-start'
          onClick={onLogout}
        >
          <Icon icon='bx:log-out-circle' className='flex-center rotate-180' />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileButton;
