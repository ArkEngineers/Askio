import { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";
import MainLayout from "./Pages/More/MainLayout";
import LandingPage from "./Pages/LandingPage";
import Askme from "./Pages/Askme";
import Home from "./Pages/Home";
import { useAuth } from "./Context/AuthContext";
import Quiz from "./Pages/Quiz";
import Play from "./Components/Play";
import Flashcards from "./Pages/Flashcard";

function App() {
  const { user,loggedin,setLoggedIn } = useAuth();
  useEffect(()=>{
    if (user!=null){
      setLoggedIn(true)
    }else{
      setLoggedIn(false)
    }
  },[user])

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to={loggedin? "/app" : "/landing"} />,
    },
    {
      path: "/landing",
      element: loggedin?<Navigate to="/app"/>:<LandingPage />,
    },
    {
      path: "/app",
      element: loggedin?<MainLayout/>:<Navigate to="/landing"/>,
      children: [
        {
          path: "/app",
          element: <Home />, // Home must have <Outlet /> to render child components
        },
        {
          path: "/app/flashcard", // child route without leading slash
          element: <Flashcards />,
        },
        {
          path: "/app/askme", // child route without leading slash
          element: <Askme />,
        },
        {
          path: "/app/puzzle/:slugs",
          element: <Quiz />,
        },
        {
          path: "/app/play/:slugs",
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
