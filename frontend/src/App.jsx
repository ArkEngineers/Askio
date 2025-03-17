import React, { useEffect } from "react";
import { useUserContext } from "./store/user-context";
import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

const App = () => {
  const { user, setUser } = useUserContext();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <HomePage /> : <LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
