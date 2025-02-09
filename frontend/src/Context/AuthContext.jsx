import React, { createContext, useState, useContext } from "react";

// Create the context
const AuthContext = createContext({
  user: null,
  setupUser: () => {},
  selectedModule: null,
  setModule: () => {},
});

// Provide the context to your application
export const AuthProvider = ({ children }) => {
  // State to manage whether the user is on the "Login" or "Register" page
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [selectedModule, setModule] = useState();
  const [message, setMessage] = useState("");
  const [loggedin,setLoggedIn]=useState(false);
  const [classes,setClasses]=useState([])
  const [folders,setFolders]=useState([])
  const [open,setOpen]=useState(false)
  const [newClass,setNewClass]=useState(null)

  function setupUser(data) {
    setUser(data);
  }
  return (
    <AuthContext.Provider
      value={{
        user,
        setupUser,
        selectedModule,
        setModule,
        loggedin,
        setLoggedIn,
        classes,
        setClasses,
        newClass,
        setNewClass,
        message, 
        setMessage,
        open,
        setOpen,
        accessToken, 
        setAccessToken,
        folders,
        setFolders
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext in your components
export const useAuth = () => useContext(AuthContext);
