import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "../../Components/Sidebar";
import { AlertCustomStyles } from "../../Components/Alerts";
import { useAuth } from "../../Context/AuthContext";
import { FaBars } from "react-icons/fa";
import axios from "axios";
import { FetchChatId } from "../../services/constants";

function MainLayout() {
  const { open, user } = useAuth();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const showChatsSection = location.pathname.includes("/askme");

  // Chat state for Askme page
  const [chatIds, setChatIds] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);

  // Fetch chat IDs for Askme page
  useEffect(() => {
    if (showChatsSection && user?._id) {
      axios
        .post(`${FetchChatId}`, { userId: user._id })
        .then((response) => {
          if (response.status === 200) setChatIds(response.data.data);
        })
        .catch(() => setChatIds([]));
    }
  }, [showChatsSection, user?._id]);

  // Handler for selecting a chat
  const handleChatIdClick = (chatId) => {
    setSelectedChatId(chatId === "default" ? null : chatId);
  };

  return (
    <div>
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        showChatsSection={showChatsSection}
        chatIds={showChatsSection ? chatIds : []}
        selectedChatId={showChatsSection ? selectedChatId : undefined}
        handleChatIdClick={showChatsSection ? handleChatIdClick : undefined}
      />
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Top bar */}
      <div
        className={`w-full flex items-center px-8 py-4 border-b border-gray-800 bg-gray-900 fixed top-0 left-0 z-10 transition-all duration-200 ${
          sidebarOpen ? "ml-72" : ""
        }`}
        style={{ marginLeft: sidebarOpen ? 288 : 0 }}
      >
        <button
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-200 mr-4"
          onClick={() => setSidebarOpen(true)}
          title="Open menu"
        >
          <FaBars />
        </button>
        <h1 className="font-bold text-2xl text-gray-100">Askio</h1>
        <div className="flex-1" />
      </div>
      {/* Main content */}
      <div
        className={`bg-grey-9 min-h-[100vh] text-grey-5 transition-all duration-200 ${
          sidebarOpen ? "ml-72" : ""
        }`}
        style={{ paddingTop: 80 }}
      >
        <Outlet context={
          showChatsSection
            ? { selectedChatId, setSelectedChatId }
            : {}
        } />
      </div>
      {open && <AlertCustomStyles />}
    </div>
  );
}

export default MainLayout;