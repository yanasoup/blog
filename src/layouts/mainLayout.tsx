import React from 'react';
import { Outlet } from 'react-router';

import Navigation from '@/components/partials/navigation';
// import { Toaster } from 'sonner';

export const MainLayout: React.FC = () => {
  return (
    <>
      <main>
        <Navigation />
        <Outlet />
      </main>
      {/* <Toaster className='left- top-0 right-0 md:top-4 md:right-auto md:left-4' /> */}
    </>
  );
};
