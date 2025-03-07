import { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import MainLayout from "./Pages/More/MainLayout";
import LandingPage from "./Pages/LandingPage";
import Askme from "./Pages/Askme";
import Home from "./Pages/Home";
import { useAuth } from "./Context/AuthContext";
import Quiz from "./Pages/Quiz";
import Play from "./Components/Play";
import Flashcards from "./Pages/Flashcard";
import NotFound from "./Pages/NotFound";
import Flash from "./Pages/Flash";

function App() {
  const { user, loggedin, setLoggedIn } = useAuth();

  useEffect(() => {
    if (user != null) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [user]);

  return (
    <div>
      <>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<Navigate to={loggedin ? "/app/askme" : "/landing"} />}
            />
            <Route
              path="/landing"
              element={loggedin ? <Navigate to="/app/askme" /> : <LandingPage />}
            />
            <Route
              path="/app"
              element={loggedin ? <MainLayout /> : <Navigate to="/landing" />}
            >
              <Route path="*" element={<NotFound />} />
              {/* <Route path="/app" element={<Home />} /> */}
              <Route path="/app/flashcard" element={<Flashcards />} />
              <Route path="/app/askme" element={<Askme />} />
              <Route path="/app/puzzle/:slugs" element={<Quiz />} />
              <Route path="/app/play/:slugs" element={<Play />} />
              <Route path="/app/flash/:slugs" element={<Flash />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </>
    </div>
  );
}

export default App;
