import { Button, IconButton, Input, Option, Select } from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import FlashCardList from "../Components/FlashCardList";
import useDrivePicker from "react-google-drive-picker";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import { FlashFetch } from "../services/constants";

function Flashcards() {
  const { Token, fetchpdfFromGoogleDrive, user,classroomFolderId,setFlashcard,flashcard } = useAuth();
  const [topic, setTopic] = useState("Random");
  const [numQuestions, setNumQuestions] = useState(0);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [openPicker, authResponse] = useDrivePicker();
  
  const fetchFlashcardFromBackend = async () => {
    try {
      console.log(user._id);
      const response = await axios.post(FlashFetch, {"user_id":user._id});
      if (response) {
        setFlashcard([...response.data]);
        setCardsVisible(true);
        console.log("Flashcard fetched from backend:", flashcard);
      }
    } catch (error) {
      console.error("Error fetching flashcard from backend:", error);
    }
  };

  useEffect(() => {
    if (Token) {
      fetchFlashcardFromBackend();
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
          const flashList = [];
          for (const file of data.docs) {
            const flashcard = await fetchpdfFromGoogleDrive("flashcard", file?.id);
            flashList.push(...flashcard?.data?.deck);
          }
          setFlashcard((prevQuizzes) => [...prevQuizzes, ...flashList]);
          setCardsVisible(true);
          // console.log("Updated Flashcard List:", flashList);
        }
      },
    });
  };

  return (
    <div className="pt-20 grid place-items-center">
      <nav className="flex justify-between w-10/12 text-white">
      <h1 className="text-4xl font-bold text-center py-6">FLASHCARDS</h1>
        <div className="flex items-center">
          <Button size="lg" color="blue" onClick={handleOpenPicker}>Generate Flashcards</Button>
        </div>
      </nav>
      {cardsVisible && <FlashCardList flashcard={flashcard} />}
    </div>
  );
}

export default Flashcards;
