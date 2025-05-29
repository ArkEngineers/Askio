import React, { useEffect } from "react";
import { IoIosRocket } from "react-icons/io";
import useDrivePicker from "react-google-drive-picker";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import QuizCard from "../Components/QuizCard";
import { QuizFetch } from "../services/constants";

function Quiz() {
  const { Token, fetchpdfFromGoogleDrive, setQuizzes, quizzes, user, classroomFolderId } = useAuth();
  const [openPicker] = useDrivePicker();

  const fetchQuizzesFromBackend = async () => {
    try {
      const response = await axios.post(QuizFetch, { "user_id": user._id });
      if (response) {
        setQuizzes([...response.data]);
      }
    } catch (error) {
      console.error("Error fetching quizzes from backend:", error);
    }
  };

  useEffect(() => {
    if (Token) {
      fetchQuizzesFromBackend();
    }
  }, [Token]);

  const handleOpenPicker = () => {
    openPicker({
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      developerKey: import.meta.env.VITE_ASKIO_GOOGLE_API_KEY,
      viewId: "DOCS",
      token: Token?.access_token,
      supportDrives: true,
      setIncludeFolders: true,
      multiselect: true,
      setParentFolder: classroomFolderId,
      callbackFunction: async (data) => {
        if (data.action === "picked") {
          const quizList = [...quizzes];
          for (const file of data.docs) {
            const quizQuestions = await fetchpdfFromGoogleDrive("quiz", file?.id);
            quizList.push(...quizQuestions?.data?.quiz);
          }
          setQuizzes((prev) => [...prev, ...quizList]);
        }
      },
    });
  };

  return (
    <div className="flex flex-col items-center w-full pt-8 pb-0 min-h-screen bg-gray-950 text-gray-100">
      <div className="w-full max-w-7xl flex flex-col flex-1 bg-gray-900 rounded-xl shadow p-0 min-h-[60vh] relative mx-auto">
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-800">
          <h2 className="text-3xl font-bold text-gray-100">My Quizzes</h2>
          <button
            className="text-sm bg-blue-700 rounded-lg min-w-32 p-2 hover:bg-blue-600 text-white"
            onClick={handleOpenPicker}
          >
            Create Quiz
          </button>
        </div>
        <div className="flex-1 px-6 py-10">
          <div className="flex gap-x-2 items-center mb-4">
            <IoIosRocket className="text-blue-400" />
            <p className="text-xs text-gray-400">Play quizzes to boost your score</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
            {quizzes.length > 0 ? (
              quizzes.map((quiz, index) => (
                <QuizCard key={index} title={quiz.PDF_Title} date="Generated" />
              ))
            ) : (
              <p className="text-gray-400 col-span-full text-center">
                No quizzes available. Select files to generate quizzes.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;