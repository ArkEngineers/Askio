import { useState } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./Pages/More/MainLayout";
import LandingPage from "./Pages/LandingPage";
import Notes from "./Pages/Notes";
import Askme from "./Pages/Askme";
import Home from "./Pages/Home";
import { useAuth } from "./Context/AuthContext";

function App() {
  const { user } = useAuth();
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to={user.length > 0 ? "/" : "/landing"} />,
    },
    {
      path: "/landing",
      element: <LandingPage />,
    },
    {
      path: "/class/",
      element: <Home />,
    },
    {
      path: "/class",
      element: <MainLayout />,
      children: [
        {
          path: "/class/:slugs/notes",
          element: <Notes />,
        },
       
        {
          path: "/class/:slugs/askme",
          element: <Home />,
        },
        // {
        //   path: "about",
        //   element: <About />,
        // },
        // {
        //   path: "contact",
        //   element: <Contact />,
        // },
        // {
        //   path: "services",
        //   element: <Services />,
        // },
        // {
        //   path:"services/:slug",
        //   element:<Service_Template/>
        // }
      ],
    },
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
