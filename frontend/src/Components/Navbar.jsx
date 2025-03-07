import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Tooltip,
  MenuHandler,
  MenuList,
  MenuItem,
  Menu,
} from "@material-tailwind/react";
import { Avatar } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { SlOptions } from "react-icons/sl";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useAuth } from "../Context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUpload } from "react-icons/fa";
import axios from "axios";
import { AUTH_ROUTE, RAG_ROUTE } from "../services/constants";
import { googleLogout } from "@react-oauth/google";

function Navbar() {
  const { user, setupUser } = useAuth();
  const location = useLocation();
  const [image, setImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setImage(user?.image);
    }
  }, [user]);

  const handleOpen = () => setOpen((cur) => !cur);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);
    setIsCustomCategory(value === "custom");
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file || !category) {
      alert("Please select a file and category.");
      return;
    }

    const formData = new FormData();
    formData.append("pdfFile", file);
    formData.append("tag", category === "custom" ? category : "Other");
    formData.append("userEmail", user?.email);
    try {
      const response = await axios.post(
        `${AUTH_ROUTE}/group/67304142bad67a95759a95d2/notes`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("File uploaded successfully!");
      setOpen(false);
      setFile(null);
      setCategory("");
      setIsCustomCategory(false);

      console.log(response.data.url);
      if (response.status === 200) {
        const rag_response = await axios.post(`${RAG_ROUTE}`, {
          collection_name: "AI",
          url: response.data.url,
        });

        console.log(rag_response);
      }
    } catch (error) {
      console.error("File upload failed:", error);
      alert("An error occurred while uploading the file.");
    }
  };

  const isActive = (path) => location.pathname.includes(path);
  const isNotesOrAskMeRoute =
    location.pathname.includes("notes") || location.pathname.includes("askme");

  return (
    <>
      <div className="fixed z-20 top-0 w-full text-base-2 bg-grey-9 py-4 flex justify-between px-4 items-center border-b border-gray-800">
        <div className="flex gap-8 items-start">
          <FiMenu className="text-2xl cursor-pointer mt-1" />
          <div className="flex justify-between items-center gap-x-2">
            <Link to="/app/askme">
              <h1 className="font-bold text-3xl text-base-1">Askio</h1>
            </Link>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={handleOpen}
            className="px-4 py-2 rounded-full bg-base-3 hover:bg-base-2 transition-all duration-300 text-base-1 flex gap-2 items-center text-xs"
          >
            <FaUpload />
            Upload
          </button>
          <Menu>
            <MenuHandler>
              <SlOptions className="text-xl cursor-pointer" />
            </MenuHandler>
            <MenuList>
              <MenuItem
                className="bg-red-800 hover:bg-reg-600 text-white"
                onClick={() => {
                  googleLogout();
                  console.log("LOGOUT");
                  setupUser(null);
                  navigate("/");
                }}
              >
                Log Out
              </MenuItem>
            </MenuList>
          </Menu>
          <Tooltip content={user?.name}>
            <Avatar
              size="sm"
              src={
                user?.image ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="avatar"
              onError={(e) => {
                e.target.src =
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"; // Fallback image
              }}
            />
          </Tooltip>
        </div>
      </div>

      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Add a new file
            </Typography>
            <Typography
              className="mb-3 font-normal"
              variant="paragraph"
              color="gray"
            >
              Select a PDF to upload in your collections
            </Typography>
            <Typography className="-mb-2" variant="h6">
              Upload PDF
            </Typography>
            <input type="file" accept=".pdf" onChange={handleFileChange} />

            <Typography className="-mb-2" variant="h6">
              Select Category
            </Typography>
            <select
              className="w-full p-2 border rounded-lg"
              value={category}
              onChange={handleCategoryChange}
            >
              <option value="">Select a Category</option>
              <option value="DBMS">DBMS</option>
              <option value="OS">Operating Systems</option>
              <option value="Networks">Networks</option>
              <option value="AI">Artificial Intelligence</option>
              <option value="ML">Machine Learning</option>
              <option value="custom">Other (Specify)</option>
            </select>

            {isCustomCategory && (
              <input
                type="text"
                placeholder="Enter custom category"
                className="w-full p-2 border rounded-lg mt-2"
                onChange={(e) => setCategory(e.target.value)}
              />
            )}
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              variant="gradient"
              color="purple"
              onClick={handleSubmit}
              fullWidth
            >
              Submit
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  );
}

export default Navbar;
