import { Avatar } from "@material-tailwind/react";
import React from "react";
import { FiMenu } from "react-icons/fi";
import { SlOptions } from "react-icons/sl";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useAuth } from "../Context/AuthContext";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path);

  // Check if we're on the "/app/" route
  const isAppRoot = location.pathname === "/app";

  return (
    <>
      <div className="fixed z-20 top-0 w-full text-base-2 bg-grey-9 py-4 flex justify-between px-4 items-center border-b border-gray-800">
        <div className="flex gap-8 items-start">
          <FiMenu className="text-2xl cursor-pointer mt-1" />
          <div className="flex justify-between items-start">
            <Link to="/app/">
              <h1 className="font-bold text-3xl text-base-1">Askio</h1>
            </Link>
            {!isAppRoot && (
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
          <SlOptions className="text-xl cursor-pointer" />
          <Avatar
            size="sm"
            src={
              user?.image ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="avatar"
          />
        </div>
      </div>
      {!isAppRoot && (
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
