import React, { createContext, useState, useContext } from "react";

// Create the context
const AuthContext = createContext({
  user: null,
  setupUser: () => {},
});

// Provide the context to your application
export const AuthProvider = ({ children }) => {
  // State to manage whether the user is on the "Login" or "Register" page
  const [user, setUser] = useState();
  function setupUser(data) {
    setUser(data);
  }
  return (
    <AuthContext.Provider value={{ user, setupUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext in your components
export const useAuth = () => useContext(AuthContext);
