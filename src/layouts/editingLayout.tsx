import React from 'react';
import { Outlet } from 'react-router';

import EditingNavigation from '@/components/partials/editing-navigation';

export const MainLayout: React.FC = () => {
  return (
    <>
      <main>
        <EditingNavigation />
        <Outlet />
      </main>
    </>
  );
};
