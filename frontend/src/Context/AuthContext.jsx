import React, { createContext, useState, useContext } from 'react';

// Create the context
const AuthContext = createContext();

// Provide the context to your application
export const AuthProvider = ({ children }) => {
    // State to manage whether the user is on the "Login" or "Register" page
    const [user,setUser]=useState({})
    return (
        <AuthContext.Provider value={{ authPage,userDetails,setUserDetails,location,setLocation ,setAuthPage, toggleAuthPage }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext in your components
export const useAuth = () => useContext(AuthContext);
