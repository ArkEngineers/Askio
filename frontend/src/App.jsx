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
import Quiz from "./Pages/Quiz";
import Play from "./Components/Play";

function App() {
  const { user } = useAuth();
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to={user?.length > 0 ? "/" : "/landing"} />,
    },
    {
      path: "/landing",
      element: <LandingPage />,
    },
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/app",
          element: <Home />, // Home must have <Outlet /> to render child components
        },
        {
          path: "/app/:slugs/notes", // child route without leading slash
          element: <Notes />,
        },
        {
          path: "/app/:slugs/askme", // child route without leading slash
          element: <Askme />,
        },
        {
          path: "puzzle/:slugs",
          element: <Quiz />,
        },
        {
          path: "play/:slugs",
          element: <Play />,
        },
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
