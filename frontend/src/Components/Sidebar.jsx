import React from "react";
import { CgCardClubs, CgCardDiamonds } from "react-icons/cg";
import { FaHome, FaPuzzlePiece, FaQuestionCircle } from "react-icons/fa";
import { FaQuestion } from "react-icons/fa6";
import { FcSettings } from "react-icons/fc";
import { FiHome } from "react-icons/fi";
import { MdQuestionMark } from "react-icons/md";
import { SlPuzzle, SlSettings } from "react-icons/sl";
import { useLocation, Link } from "react-router-dom";

export function Sidebar() {
  const location = useLocation();
  console.log(location.pathname.slice(4));
  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="fixed left-0 top-20 text-base-3 flex flex-col justify-start items-center text-2xl bg-grey-9 h-screen border-r gap-6 border-gray-800 z-10 h-[calc(100vh-2rem)] p-4 shadow-xl shadow-blue-gray-900/5">
      <Link to="/app">{isActive("/app") ? <FaHome /> : <FiHome />}</Link>
      <Link to="/app/askme">
        {isActive("/askme") ? <FaQuestionCircle />:<FaQuestion />}
      </Link>
      <Link to="/app/puzzle/all">
        {isActive("/puzzle") ? <FaPuzzlePiece /> : <SlPuzzle />}
      </Link>
      <Link to="/app/flashcard">
        {isActive("/flashcard") ? <CgCardDiamonds /> : <CgCardClubs />}
      </Link>
      <Link to="/app/settings" aria-disabled>
        {isActive("/settings") ? <FcSettings /> : <SlSettings />}
      </Link>
    </div>
  );
}
