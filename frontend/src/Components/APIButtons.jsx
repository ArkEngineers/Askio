import React, { useState } from "react";
import { GET_GOOGLE_TOKEN, LIST_COURSE, PDFURL } from "../services/constants";
import axios from "axios";
import Cookies from "js-cookie";
import { useAuth } from "../Context/AuthContext";
import { IconButton, Menu, MenuHandler, MenuItem, MenuList, Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import { FaGoogleDrive, FaPlus } from "react-icons/fa";
import useDrivePicker from "react-google-drive-picker";
import { CgAttachment } from "react-icons/cg";

export function List_Course_Button() {
  const { classes, setClasses, accessToken } = useAuth();
  async function listCourses() {
    console.log(accessToken);
    try {
      const response = await axios.get(`${LIST_COURSE}?courseStates=ACTIVE`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("API Response:", response.data);
      setClasses(response.data.courses);
    } catch (error) {
      console.error(
        "Error making API request:",
        error.response?.data || error.message
      );
    }
  }
  return (
    <button
      className="text-sm bg-base-3 rounded-lg min-w-32 p-2 hover:bg-base-2"
      onClick={listCourses}
    >
      List Courses
    </button>
  );
}
export function LIST_FOLDERS_BUTTON() {
  const { classes, setFolders, accessToken } = useAuth();

  async function listFolders() {
    if (classes && classes.length > 0) {
      const allCourses = [];

      for (const cls of classes) {
        const url = `${LIST_COURSE}/${cls.id}/topics`;

        try {
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          console.log(
            `API Response for class ${cls.id} (${cls.name}):`,
            response.data
          );

          // Check if `topic` exists and is an array
          if (Array.isArray(response.data?.topic)) {
            const limitedCourses = response.data.topic.slice(0, 3); // Limit to 3 courses
            allCourses.push(...limitedCourses);
          } else {
            console.warn(
              `No valid topics found for class ${cls.id} (${cls.name}).`
            );
          }
        } catch (error) {
          console.error(
            `Error making API request for class ${cls.id} (${cls.name}):`,
            error.response?.data || error.message
          );
        }
      }

      if (allCourses.length > 0) {
        setFolders(allCourses);
      } else {
        console.log("No content found in any class.");
      }
    } else {
      console.log("No classes found.");
    }
  }

  return (
    <button
      className="text-sm bg-base-3 rounded-lg min-w-32 p-2 hover:bg-base-2"
      onClick={listFolders}
    >
      List Folders
    </button>
  );
}

export function POST_COURSE() {
  const { folders, classes, setFolders, accessToken } = useAuth();
  async function listFolders() {
    const url = `${LIST_COURSE}/${classes[0].id}/courseWork`;
    console.log(url);
    try {
      const response = await axios.post(
        url,
        {
          title: "DBMS",
          description: "This is a material for DBMS",
          workType: "ASSIGNMENT",
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("API Response:", response.data);
      setFolders(response.data);
    } catch (error) {
      console.error(
        "Error making API request:",
        error.response?.data || error.message
      );
    }
  }
  return (
    <button
      className="text-sm bg-base-3 rounded-lg min-w-32 p-2 hover:bg-base-2"
      onClick={listFolders}
    >
      POST_COURSE
    </button>
  );
}

export function Create_Classroom() {
  const {
    myFolder,
    setMyFolder,
    user,
    setNewClass,
    setMessage,
    setOpen,
    accessToken,
  } = useAuth();

  async function listCourses() {
    console.log(accessToken);
    try {
      let result = await axios.post(
        LIST_COURSE,
        {
          ownerId: "me",
          name: "Askio!",
          section: "selfLearning",
          descriptionHeading: "A platform to ask and learn from notes",
          description:
            "A classroom course made via Askio to help you learn new things",
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(result);
      setNewClass(result.data);
      setMessage("Askio Class Created Successfully!");
      setOpen(true);
      const classroomLink = result.data.alternateLink;
      if (classroomLink) {
        window.open(classroomLink, "_blank");
      }
    } catch (error) {
      console.log(error);
      setMessage("Askio Class not Created!");
      setOpen(true);
    }
  }
  return (
    <button
      className="text-sm bg-base-3 rounded-lg min-w-48 p-2 hover:bg-base-2"
      onClick={listCourses}
    >
      Create Askio Classroom
    </button>
  );
}


import { useDropzone } from "react-dropzone";

export function MY_DRIVE_BTN({msg}) {
  const { Token, fetchpdfFromGoogleDrive, setQuizzes, quizzes, classroomFolderId,setselectedPDF,PDFDATA,setPDFDATA} = useAuth();
  const [openPicker, authResponse] = useDrivePicker();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [files, setFiles] = useState([]);


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
          setPDFDATA(data.docs)
         try {
           for (const file of data.docs) {
             console.log(file.id)
             setselectedPDF((prev)=>[...prev,file.name])
           }
         } catch (error) {
          console.error(error)
         }
        }
      },
    });
  };

  const handleUpload = () => {
    setModalIsOpen(true);
  };

  const onDrop = (acceptedFiles) => {
    setFiles(acceptedFiles);
  };

  const handleFileUpload = async () => {
    const quizList = [...quizzes];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(PDFURL, formData, {
        headers: {
          Authorization: `Bearer ${Token?.access_token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      const quizQuestions = response.data;
      quizList.push(...quizQuestions?.data?.quiz);
    }
    setQuizzes((prevQuizzes) => [...prevQuizzes, ...quizList]);
    console.log("Updated Quiz List:", quizList);
    setModalIsOpen(false);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <>
      <Menu>
        <MenuHandler>
          <IconButton variant="outlined" className="rounded-full" size="sm" color="white">
            <FaPlus />
          </IconButton>
        </MenuHandler>
        <MenuList className="bg-grey-6 text-white outline-0 border-0">
          <MenuItem className="flex gap-2 items-center" onClick={handleUpload}>
            <CgAttachment /> Upload From Computer
          </MenuItem>
          <MenuItem className="flex gap-2 items-center" onClick={handleOpenPicker}>
            <FaGoogleDrive /> Drive/Classroom
          </MenuItem>
        </MenuList>
      </Menu>

      <Dialog open={modalIsOpen} handler={setModalIsOpen}>
        <DialogHeader>Upload Files</DialogHeader>
        <DialogBody divider>
          <div
            {...getRootProps({ className: "dropzone border-dashed border-2 border-gray-300 p-4 rounded-none h-64" })}
          >
            <input {...getInputProps()} />
            <p className="text-center text-gray-500">Drag & drop files here, or click to select files</p>
          </div>
          <ul className="mt-4">
            {files.map((file) => (
              <li key={file.path}>{file.path}</li>
            ))}
          </ul>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setModalIsOpen(false)}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={handleFileUpload}
          >
            <span>Upload</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}