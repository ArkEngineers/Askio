import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import MainLayout from "./Pages/More/MainLayout";
import Home from "./Pages/Home";
import LandingPage from "./Pages/LandingPage";

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
