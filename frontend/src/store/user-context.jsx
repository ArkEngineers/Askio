import { createContext, useContext, useState } from "react";

const UserContext = createContext({
  user: null,
  setUser: () => null,
});

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const value = {
    user,
    setUser,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserContext = () => useContext(UserContext);
