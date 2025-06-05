import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Logo from '@/assets/icons/icon-logo.svg';
import { NavLink } from 'react-router';
import { motion } from 'motion/react';
import { useSelector } from 'react-redux';
import { PenLineIcon } from 'lucide-react';
import { MenuIcon, SearchIcon } from 'lucide-react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetDescription,
} from '@/components/ui/sheet';
import type { RootState } from '@/redux/store';
import UserProfileButton from './user-profile-button';

const Navigation = () => {
  const uiuxState = useSelector((state: RootState) => state.uiux);

  return (
    <div className='border-b border-neutral-300'>
      <header className='custom-container flex h-20 items-center justify-between'>
        <div>
          <NavLink to='/' className='flex-center flex gap-2'>
            <img src={Logo} />
            <h1>My Blog</h1>
          </NavLink>
        </div>

        <Input
          className='text-sm-regular hidden flex-2 md:max-w-93 md:min-w-80 lg:block'
          placeholder='Search'
          type='text'
        />

        <nav>
          <div className='hidden items-center justify-center gap-2 divide-neutral-300 lg:flex'>
            {uiuxState.isAuthenticated ? (
              <>
                <NavLink
                  to='/write-post'
                  className='flex-center flex gap-2 underline'
                >
                  <PenLineIcon className='text-primary-300 size-6' />
                  <span className='text-primary-300 text-sm-semibold underline'>
                    Write Post
                  </span>
                </NavLink>
                <span className='text-neutral-300'>|</span>
                <UserProfileButton />
              </>
            ) : (
              <>
                <NavLink
                  to='/login'
                  className='flex-center gap2 flex underline'
                >
                  <span className='text-primary-300 text-sm-semibold'>
                    Login
                  </span>
                </NavLink>
                <span className='text-neutral-300'>|</span>
                <Button asChild className='w-fit'>
                  <NavLink to='/register'>Register</NavLink>
                </Button>
              </>
            )}
          </div>
          {uiuxState.isAuthenticated && (
            <div className='flex lg:hidden'>
              <UserProfileButton />
            </div>
          )}
        </nav>

        {!uiuxState.isAuthenticated && (
          <div className='flex gap-6'>
            <div className='flex items-center justify-center gap-6 lg:hidden'>
              <SearchIcon
                size={24}
                className='cursor-pointer text-neutral-950'
                onClick={() => console.log('search')}
              />
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <MenuIcon
                  size={24}
                  className='cursor-pointer text-neutral-950 lg:hidden'
                />
              </SheetTrigger>
              <SheetContent>
                <SheetHeader className='hidden'>
                  <SheetDescription className='sr-only'>Menu</SheetDescription>
                </SheetHeader>

                <div className='flex flex-col'>
                  <div className='flex h-20 items-center justify-start gap-2 border-b border-neutral-300 px-4'>
                    <img src={Logo} />
                    <h1>My Blog</h1>
                  </div>

                  <motion.nav className='mt-4'>
                    <ul className='flex flex-col items-center justify-center gap-4'>
                      <li>
                        <SheetClose asChild>
                          <NavLink
                            className='text-md-regular text-primary-300 hover:text-primary-200 p-2 underline'
                            to='/login'
                          >
                            Login
                          </NavLink>
                        </SheetClose>
                      </li>
                      <li>
                        <Button asChild className='w-fit'>
                          <NavLink to='/register'>Register</NavLink>
                        </Button>
                      </li>
                    </ul>
                  </motion.nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </header>
    </div>
  );
};

export default Navigation;
