import React from "react";
import { FaBars, FaTimes, FaRegCommentDots, FaSearch, FaBookOpen, FaChevronRight, FaPuzzlePiece } from "react-icons/fa";
import { IoFlashOutline } from "react-icons/io5";
import { RiChatAiFill } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  chatIds = [],
  selectedChatId,
  handleChatIdClick,
  showChatsSection = false,
}) {
  const location = useLocation();
  const isAskMe = location.pathname.includes("/askme");
  const { setupUser, setLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setupUser(null);
      setLoggedIn(false);
      localStorage.clear();
    } catch (err) {
      alert("Logout failed");
    }
  };
  return (
    <div
      className={`fixed top-0 left-0 h-full w-72 bg-gray-900 border-r border-gray-800 z-30 flex flex-col transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      {/* Top section with burger and logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
        <span className="font-bold text-xl text-gray-100 flex items-center gap-2">
          <FaRegCommentDots className="text-lg" />
          Askio
        </span>
        <button
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-200"
          onClick={() => setSidebarOpen(false)}
          title="Close"
        >
          <FaTimes />
        </button>
      </div>
      {/* Main sidebar options */}
      <div className="flex flex-col gap-2 px-2 py-4">
        <Link
          to="/app/askme"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-200 hover:bg-gray-800 transition"
          onClick={() => handleChatIdClick && handleChatIdClick("default")}
        >
          <RiChatAiFill />
          <span className="truncate">New Chat</span>
        </Link>
        <Link
          to="/app/puzzle/all"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-200 hover:bg-gray-800 transition"
        >
          <FaPuzzlePiece />
          Quiz
        </Link>
        <Link
          to="/app/flashcard"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-200 hover:bg-gray-800 transition"
        >
          <IoFlashOutline />
          Flashcards
        </Link>
        
      </div>
      {/* Divider */}
      {showChatsSection && (
        <>
          <div className="border-t border-gray-800 my-2" />
          {/* Chat list */}
          <div className="flex-1 overflow-y-auto px-2">
            <div className="text-xs text-gray-400 px-2 py-1">Your Chats</div>
            <ul>
              {chatIds.map((chatId) => (
                <li
                  key={chatId._id}
                  className={`flex items-center gap-2 mb-1 cursor-pointer px-4 py-2 rounded-lg ${selectedChatId === chatId._id
                      ? "bg-blue-900 text-blue-300"
                      : "hover:bg-gray-800 text-gray-100"
                    }`}
                  onClick={() => handleChatIdClick && handleChatIdClick(chatId._id)}
                >
                  <FaChevronRight className="opacity-60" />
                  <span className="truncate">{chatId.title || `Chat-${chatId._id.slice(-4)}`}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      <div className="mt-auto px-4 py-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}