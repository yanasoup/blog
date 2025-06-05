import { createBrowserRouter } from 'react-router';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import { MainLayout } from './layouts/mainLayout';
import BlogPostCreate from './components/blogposts/blog-post-create';
import PostDetailPage from './pages/post-detail-page';
import MyProfilelPage from './pages/myprofile-page';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/register',
    Component: Register,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, Component: Home },
      { path: '/post/:postId', Component: PostDetailPage },
    ],
  },
  {
    path: '/write-post',
    element: <BlogPostCreate />,
  },
  {
    path: '/myprofile',
    element: <MyProfilelPage />,
  },
]);
