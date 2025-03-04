import React, { createContext, useState, useContext, useEffect } from "react";
import { PDFURL, QuizURL } from "../services/constants";
import axios from "axios";

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
  const [Token, setToken] = useState(null);
  const [selectedModule, setModule] = useState();
  const [message, setMessage] = useState("");
  const [loggedin, setLoggedIn] = useState(false);
  const [classes, setClasses] = useState([]);
  const [folders, setFolders] = useState([]);
  const [open, setOpen] = useState(false);
  const [newClass, setNewClass] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  function setupUser(data) {
    setUser(data);
  }

  useEffect(() => {
    const fetchStoredData = () => {
      const storedAccessToken = localStorage.getItem("accessToken");
      const storedTokens = localStorage.getItem("tokens");
      const storedUser = localStorage.getItem("user");

      if (storedAccessToken && storedTokens && storedUser) {
        console.log("🚀 ~ fetchStoredData ~ storedUser:", storedUser);
        console.log("🚀 ~ fetchStoredData ~ storedTokens:", storedTokens);
        console.log(
          "🚀 ~ fetchStoredData ~ storedAccessToken:",
          storedAccessToken
        );
        setAccessToken(storedAccessToken);
        setToken(JSON.parse(storedTokens));
        setUser(JSON.parse(storedUser));
      }
    };
    fetchStoredData();
  }, []);

    async function fetchpdfFromGoogleDrive(fetch_type,fileId=null,url=null,chatId=null,courseId=null,courseworkId=null,attachmentId=null) {
      try {
        let result = null;
        if(fetch_type === "pdf"){
          result = await axios.post(
            PDFURL,
            {
              userId: user?._id,
              fileId:fileId,
              url:url,
              chatId:chatId,
              courseId:courseId,
              Token: Token,
              courseworkId:courseworkId,
              attachmentId:attachmentId,
            },
            {
              headers: {
                Authorization: `Bearer ${Token.access_token}`,
              },
            }
          );
        }else if(fetch_type === "quiz"){
          result = await axios.post(
            QuizURL,
            {
              userId: user?._id,
              fileId:fileId,
              chatId:chatId,
              Token: Token,
            },
            {
              headers: {
                Authorization: `Bearer ${Token.access_token}`,
              },
            }
          );
        }
        if(result){
          console.log(result.data)
          return result.data;
        }
      } catch (error) {
        console.log(error);
      }
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
        setFolders,
        Token,
        setToken,
        quizzes,
        setQuizzes,
        fetchpdfFromGoogleDrive
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext in your components
export const useAuth = () => useContext(AuthContext);
