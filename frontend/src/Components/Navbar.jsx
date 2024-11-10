import { Avatar } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { SlOptions } from "react-icons/sl";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useAuth } from "../Context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { FaUpload } from "react-icons/fa";
import {
  Button,
  Dialog,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
} from "@material-tailwind/react";

function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const [image, setImage] = useState(null);
  useEffect(() => {
    if (user) {
      setImage(user?.image);
    }
  }, [user]);
  const isActive = (path) => location.pathname.includes(path);
  console.log("Image", image);
  // Check if the route includes "notes" or "askme"
  const isNotesOrAskMeRoute =
    location.pathname.includes("notes") || location.pathname.includes("askme");

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen((cur) => !cur);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [category, setCategory] = useState("");
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);
    setIsCustomCategory(value === "custom");
  };
  return (
    <>
      <div className="fixed z-20 top-0 w-full text-base-2 bg-grey-9 py-4 flex justify-between px-4 items-center border-b border-gray-800">
        <div className="flex gap-8 items-start">
          <FiMenu className="text-2xl cursor-pointer mt-1" />
          <div className="flex justify-between items-center gap-x-2">
            <Link to="/app/">
              <h1 className="font-bold text-3xl text-base-1">Askio</h1>
            </Link>
            {isNotesOrAskMeRoute && (
              <>
                <MdOutlineKeyboardArrowRight className="text-2xl mt-1 text-base-1 cursor-pointer" />
                <div>
                  <h1 className="text-xl">Classroom Name</h1>
                  <p className="text-grey-1 text-sm">Mridul Tiwari</p>
                </div>
              </>
            )}
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
          <SlOptions className="text-xl cursor-pointer" />
          <Avatar
            size="sm"
            src={
              image
                ? image
                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="avatar"
          />
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
            <input type="file" accept=".pdf" />

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
              onClick={handleOpen}
              fullWidth
            >
              Submit
            </Button>
          </CardFooter>
        </Card>
      </Dialog>

      {isNotesOrAskMeRoute && (
        <div className="border-b z-10 bg-grey-9 fixed top-20 left-20 px-12 text-lg w-full flex gap-4 text-grey-2 border-grey-6">
          <Link to="/app/classa/notes">
            <h1
              className={`${
                isActive("/notes")
                  ? "text-base-3 border-b-2 border-base-3"
                  : "text-grey-3 border-grey-3"
              } py-2`}
            >
              Notes
            </h1>
          </Link>
          <Link to="/app/classa/askme">
            <h1
              className={`${
                isActive("/askme")
                  ? "text-base-3 border-b-2 border-base-3"
                  : "text-grey-3 border-grey-3"
              } py-2`}
            >
              AskMe
            </h1>
          </Link>
        </div>
      )}
    </>
  );
}

export default Navbar;
