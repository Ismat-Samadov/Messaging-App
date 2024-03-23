import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RequireAuth from '@auth-kit/react-router/RequireAuth';

import Landing from './src/views/Landing';
import Login from './src/views/Login';
import Register from './src/views/Register.jsx';

const Router = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <RequireAuth fallbackPath="/login">
          <Landing />
        </RequireAuth>
      )
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/register',
      element: <Register />
    }
  ]);
  return <RouterProvider router={router} />;
};

export default Router;
