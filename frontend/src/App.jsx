import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import MainLayout from "./Pages/More/MainLayout";
import Home from "./Pages/Home";
import LandingPage from "./Pages/LandingPage";
import Notes from "./Pages/Notes";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: <LandingPage />,
        },
        {
          path: "/:slugs/notes",
          element: <Notes />,
        },
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
