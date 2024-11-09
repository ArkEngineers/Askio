import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./Pages/More/MainLayout";
import LandingPage from "./Pages/LandingPage";
import Notes from "./Pages/Notes";
import Askme from "./Pages/Askme";

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
        {
          path: "/:slugs/askme",
          element: <Askme />,
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
