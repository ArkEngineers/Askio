import React from "react";
import { CgCardClubs, CgCardDiamonds } from "react-icons/cg";
import { FaHome, FaPuzzlePiece } from "react-icons/fa";
import { GoHome, GoHomeFill } from "react-icons/go";
import { FcSettings } from "react-icons/fc";
import {
  IoFlashOutline,
  IoFlashSharp,
  IoSettingsOutline,
} from "react-icons/io5";
import { RiChatAiFill, RiChatAiLine } from "react-icons/ri";
import { SlPuzzle, SlSettings } from "react-icons/sl";
import { useLocation, Link } from "react-router-dom";
import { IoMdSettings } from "react-icons/io";

export function Sidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname.split("/").pop() === path;

  return (
    <div className="fixed left-0 top-20 text-base-3 flex flex-col justify-start items-center text-2xl bg-grey-9 h-screen border-r gap-6 border-gray-800 z-10 h-[calc(100vh-2rem)] p-4 shadow-xl shadow-blue-gray-900/5">
      {/* <Link to="/app">{isActive("app") ? <GoHomeFill /> : <GoHome />}</Link> */}
      <Link to="/app/askme">
        {isActive("askme") ? <RiChatAiFill /> : <RiChatAiLine />}
      </Link>
      <Link to="/app/puzzle/all">
        {isActive("all") ? <FaPuzzlePiece /> : <SlPuzzle />}
      </Link>
      <Link to="/app/flashcard">
        {isActive("flashcard") ? <IoFlashSharp /> : <IoFlashOutline />}
      </Link>
      {/* <Link to="/app/settings" aria-disabled>
        {isActive("settings") ? <IoMdSettings /> : <IoSettingsOutline />}
      </Link> */}
    </div>
  );
}
