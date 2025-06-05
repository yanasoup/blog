import { StrictMode } from 'react';
import './index.css';
import { RouterProvider } from 'react-router';

import ReactDOM from 'react-dom/client';
import { router } from './routes';
import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const root = document.getElementById('root')!;

import store from '@/redux/store';
import { Provider } from 'react-redux';

ReactDOM.createRoot(root).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
