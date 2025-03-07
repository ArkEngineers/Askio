import React, { useEffect, useState } from "react";
import { IoIosRocket } from "react-icons/io";
import useDrivePicker from "react-google-drive-picker";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import QuizCard from "../Components/QuizCard";
import { QuizFetch } from "../services/constants";

function Quiz() {
  const { Token, fetchpdfFromGoogleDrive, setQuizzes, quizzes, user,classroomFolderId } = useAuth();
  const [openPicker, authResponse] = useDrivePicker();

  const fetchQuizzesFromBackend = async () => {
    try {
      const response = await axios.post(QuizFetch, {"user_id":user._id});
      if (response) {
        setQuizzes([...response.data]);
        console.log("Quizzes fetched from backend:", response.data);
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
          console.log("Selected Files:", data);
          const quizList = [...quizzes];
          for (const file of data.docs) {
            const quizQuestions = await fetchpdfFromGoogleDrive("quiz", file?.id);

            quizList.push(...quizQuestions?.data?.quiz);

          }
          setQuizzes((prevQuizzes) => [...prevQuizzes, ...quizList]);
          console.log("Updated Quiz List:", quizList);
        }
      },
    });
  };

  return (
    <div className="px-10 pl-40 pt-20">
      <div className="flex justify-between items-center w-11/12">
        <h2 className="text-3xl py-10 font-semibold text-base-1">
          My Quizzes
        </h2>
        <button
          className="text-sm bg-base-3 rounded-lg min-w-32 p-2 hover:bg-base-2"
          onClick={handleOpenPicker}
        >
          Create Quiz
        </button>
      </div>

      <div className="flex flex-col items-center justify-center py-10">
        <div className="flex flex-col gap-y-4 w-full">
          <div className="px-4 flex gap-x-2 items-center w-full">
            <IoIosRocket className="text-grey-1" />
            <p className="text-xs text-grey-1 w-full text-left">
              Play quizzes to boost your score
            </p>
          </div>

          <div className="grid grid-cols-5 w-full items-center flex-wrap gap-y-10">
            {quizzes.length > 0 ? (
              quizzes.map((quiz, index) => (
                <QuizCard key={index} title={quiz.PDF_Title} date="Generated" />
              ))
            ) : (
              <p>No quizzes available. Select files to generate quizzes.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
