import { RouterProvider, createBrowserRouter } from "react-router-dom";

// Unauthanticated Routes:
import UnauthenticatedHomepage from "./page/UnauthenticatedPages/UnauthenticatedHomepage";
import SignUp from "./page/UnauthenticatedPages/SignUp";
import LogIn from "./page/UnauthenticatedPages/LogIn";

// Public Routes:

//  Authenticated Routes:
import AuthenticatedLayout from "./page/AuthenticatedPages/AuthenticatedLayout";
import { useAuth } from "./context/authProvider";
import MessagesPage from "./page/AuthenticatedPages/MessagesPage";
import VisitedProfile from "./page/AuthenticatedPages/VisitedProfile";
import Profile from "./page/AuthenticatedPages/Profile";
import ConversationPage from "./page/AuthenticatedPages/ConversationPage";
import ExplorePage from "./page/AuthenticatedPages/ExplorePage";
import ExplorePagination from "./components/ExplorePagination";
import AccessDenied from "./page/ErrorPages/AccessDenied";

const Routes = () => {
  // Use Context of Authorization
  const { token } = useAuth();

  const routesForUnauthenticatedOnly = [
    { errorElement: <AccessDenied /> },
    { path: "/", element: <UnauthenticatedHomepage /> },
    { path: "/sign-up", element: <SignUp /> },
    { path: "/login", element: <LogIn /> },
  ];

  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <AuthenticatedLayout />,
      errorElement: <AccessDenied />,
      children: [
        { index: true, element: <MessagesPage /> },
        { path: "/users/:id", element: <VisitedProfile /> },
        { path: "/profile", element: <Profile /> },
        {
          path: "/conversation/:conversation_id",
          element: <ConversationPage />,
        },
        {
          path: "/explore",
          element: <ExplorePage />,
          children: [
            {
              index: true,
              path: "/explore/:pagination",
              element: <ExplorePagination />,
            },
          ],
        },
      ],
    },
  ];

  // If diferrent routes depedding on if the user has token or not.
  const router = createBrowserRouter([
    ...(!token ? routesForUnauthenticatedOnly : []),
    ...(token ? routesForAuthenticatedOnly : []),
  ]);

  return <RouterProvider router={router}></RouterProvider>;
};

export default Routes;
