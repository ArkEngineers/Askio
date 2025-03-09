import React, { createContext, useState, useContext, useEffect } from "react";
import { FlashURL, PDFURL, QuizURL } from "../services/constants";
import axios from "axios";

// Create the context
const AuthContext = createContext({
  user: null,
  setupUser: () => { },
  selectedModule: null,
  setModule: () => { },
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
  const [flashcard, setFlashcard] = useState([]);
  const [classroomFolderId, setClassroomFolderId] = useState(null);
  const [selectedPDF,setselectedPDF]=useState([])
  const [PDFDATA,setPDFDATA]=useState([]);
  const [fileIds,setfileIds]=useState([])


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

  useEffect(() => {
    if (Token?.access_token) {
      fetchClassroomFolderId();
    }
  }, [Token]);

  async function fetchpdfFromGoogleDrive({fetch_type,msg=null, fileId = null, url = null, chatId = null, courseId = null, courseworkId = null, attachmentId = null}) {
    try {
      let result = null;
      if (fetch_type === "pdf") {
        result = await axios.post(
          PDFURL,
          {
            Input_Msg:msg,
            userId: user?._id,
            fileIds: fileId,
            url: url,
            chatId: chatId,
            Token: Token,
          },
          {
            headers: {
              Authorization: `Bearer ${Token.access_token}`,
            },
          }
        );
      } else if (fetch_type === "quiz") {
        result = await axios.post(
          QuizURL,
          {
            userId: user?._id,
            fileId: fileId,
            chatId: chatId,
            Token: Token,
          },
          {
            headers: {
              Authorization: `Bearer ${Token.access_token}`,
            },
          }
        );
      } else if (fetch_type === "flashcard") {
        result = await axios.post(
          FlashURL,
          {
            userId: user?._id,
            fileId: fileId,
            Token: Token,
          },
          {
            headers: {
              Authorization: `Bearer ${Token.access_token}`,
            },
          }
        );
      }
      if (result) {
        console.log(result.data)
        return result.data;
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchClassroomFolderId = async () => {
    try {
      const response = await axios("https://www.googleapis.com/drive/v3/files", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Token?.access_token}`,
        },
        params: {
          q: "name='Classroom' and mimeType='application/vnd.google-apps.folder'",
        },
      });
      const data = response.data;
      if (data.files && data.files.length > 0) {
        console.log("Classroom folder found:", data.files[0].id);
        setClassroomFolderId(data.files[0].id);
      } else {
        console.log("Classroom folder not found");
      }
    } catch (error) {
      console.error("Error fetching Classroom folder ID:", error);
    }
  };
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
        fetchpdfFromGoogleDrive,
        fetchClassroomFolderId,
        classroomFolderId,
        flashcard,
        setFlashcard,
        selectedPDF,
        setselectedPDF,
        PDFDATA,
        setPDFDATA,
        fileIds,
        setfileIds
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext in your components
export const useAuth = () => useContext(AuthContext);
