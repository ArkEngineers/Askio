import { Button, Select, Option } from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import FlashCardList from "../Components/FlashCardList";
import useDrivePicker from "react-google-drive-picker";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import { FlashFetch } from "../services/constants";

function Flashcards() {
  const { Token, fetchpdfFromGoogleDrive, user, setFlashcard, flashcard } = useAuth();
  const [cardsVisible, setCardsVisible] = useState(false);
  const [openPicker] = useDrivePicker();
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);

  // Fetch all folders in user's Google Drive
  useEffect(() => {
    const fetchFolders = async () => {
      if (!Token?.access_token) return;
      try {
        const response = await axios.get(
          "https://www.googleapis.com/drive/v3/files",
          {
            headers: { Authorization: `Bearer ${Token.access_token}` },
            params: {
              q: "mimeType='application/vnd.google-apps.folder'",
              fields: "files(id, name)",
            },
          }
        );
        setFolders(response.data.files || []);
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    };
    fetchFolders();
  }, [Token]);

  // Fetch flashcards from backend
  useEffect(() => {
    if (Token) {
      (async () => {
        try {
          const response = await axios.post(FlashFetch, { user_id: user._id });
          if (response) {
            setFlashcard([...response.data]);
            setCardsVisible(true);
          }
        } catch (error) {
          console.error("Error fetching flashcard from backend:", error);
        }
      })();
    }
  }, [Token]);

  // Open Google Drive Picker in selected folder
  const handleOpenPicker = () => {
    openPicker({
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      developerKey: import.meta.env.VITE_ASKIO_GOOGLE_API_KEY,
      viewId: "DOCS",
      token: Token?.access_token,
      supportDrives: true,
      setIncludeFolders: true,
      multiselect: true,
      setParentFolder: selectedFolder, // <-- Use selected folder
      callbackFunction: async (data) => {
  if (data.action === "picked") {
    const flashList = [];
    for (const file of data.docs) {
      const flashcard = await fetchpdfFromGoogleDrive({fetch_type:"flashcard", fileId:file?.id, file_name:file?.name});
      if (flashcard?.data?.deck && Array.isArray(flashcard.data.deck)) {
        flashList.push(...flashcard.data.deck);
      } else {
        console.error("Flashcard deck not found or invalid format for file:", file?.name);
      }
    }
    setFlashcard((prev) => [...prev, ...flashList]);
    setCardsVisible(true);
  }
},
    });
  };

  return (
    <div className="pt-20 grid place-items-center">
      <nav className="flex justify-between w-10/12 text-white">
        <h1 className="text-4xl font-bold text-center py-6">FLASHCARDS</h1>
        <div className="flex items-center gap-4">
          <Select
            label="Select Folder"
            value={selectedFolder || ""}
            onChange={(val) => setSelectedFolder(val)}
            className="bg-gray-800 text-white"
          >
            {folders.map((folder) => (
              <Option key={folder.id} value={folder.id}>
                {folder.name}
              </Option>
            ))}
          </Select>
          <Button size="lg" color="blue" onClick={handleOpenPicker} disabled={!selectedFolder}>
            Generate Flashcards
          </Button>
        </div>
      </nav>
      {cardsVisible && <FlashCardList flashcard={flashcard} />}
    </div>
  );
}

export default Flashcards;