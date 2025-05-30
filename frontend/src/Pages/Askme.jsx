import React, { useState, useEffect, useRef } from "react";
import { Textarea } from "@material-tailwind/react";
import { IoMdSend } from "react-icons/io";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import {
  FetchChat,
  PDFURL,
  TALK_WITH_CONTEXT_ROUTE,
} from "../services/constants";
import { MY_DRIVE_BTN } from "../Components/APIButtons";
import { useOutletContext } from "react-router-dom";

function Askme() {
  const { user, setMessage, setOpen } = useAuth();
  const [text, setText] = useState("");
  const [chat, setChat] = useState([]);
  const chatContainerRef = useRef(null);

  // Get selectedChatId and setSelectedChatId from MainLayout
  const { selectedChatId, setSelectedChatId } = useOutletContext();

  // Detect sidebar state by checking if .ml-72 is on a parent (matches MainLayout)
  const [chatAreaWidth, setChatAreaWidth] = useState("max-w-4xl");
  useEffect(() => {
    function updateChatAreaWidth() {
      // If sidebar is open (main content has ml-72), use smaller width, else expand
      const mainContent = document.querySelector('[class*="ml-72"]');
      setChatAreaWidth(mainContent ? "max-w-4xl" : "max-w-6xl");
    }
    updateChatAreaWidth();
    window.addEventListener("resize", updateChatAreaWidth);
    // Listen for sidebar open/close (mutation observer for class changes)
    const observer = new MutationObserver(updateChatAreaWidth);
    observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ["class"] });
    return () => {
      window.removeEventListener("resize", updateChatAreaWidth);
      observer.disconnect();
    };
  }, []);

  // Fetch chat messages
  const fetchChatMessages = async (chatId) => {
    try {
      const response = await axios.post(`${FetchChat}`, { chatId });
      if (response.status === 200) {
        setChat(response.data.data.messages);
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  useEffect(() => {
    if (selectedChatId) fetchChatMessages(selectedChatId);
    else setChat([]);
  }, [selectedChatId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

const handleSend = async (e) => {
  e.preventDefault();
  if (!text.trim()) return;
  setChat((prev) => [{ content: text, role: "user" }, ...prev]);
  setText("");
  try {
    let endpoint, payload;
    if (selectedPdf && selectedPdf.id) {
      endpoint = PDFURL;
      payload = {
        Input_Msg: text,
        userId: user?._id,
        fileId: selectedPdf.id,
        chatId: selectedChatId,
      };
    } else {
      endpoint = TALK_WITH_CONTEXT_ROUTE;
      payload = {
        Input_Msg: text,
        userId: user?._id,
        chatId: selectedChatId,
      };
    }

    const response = await axios.post(endpoint, payload);
    if (response.status === 200 && response.data.data) {
      setChat((prev) => [
        { content: response.data.data.response_text, role: "bot" },
        ...prev,
      ]);
    }
  } catch (error) {
    setMessage("Error sending message");
    setOpen(true);
  }
};

  return (
    <div className="flex flex-col items-center w-full pt-12 pb-0 flex-1 relative min-h-screen bg-gray-950 text-gray-100">
      <div className={`w-full ${chatAreaWidth} flex flex-col flex-1 bg-gray-900 rounded-xl shadow p-0 min-h-[60vh] relative transition-all duration-200 mx-auto`}>
        {/* Chat messages */}
        <div
          className={`flex-1 overflow-y-auto px-6 ${chat.length === 0
            ? "flex items-center justify-center"
            : "pt-8 pb-32"
            }`}
          ref={chatContainerRef}
          style={{
            minHeight: "300px",
            display: chat.length === 0 ? "flex" : "block",
            flexDirection: "column",
          }}
        >
          {chat.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full text-gray-500">
              <h3 className="mb-4 text-3xl font-bold text-gray-200">
                What can I help with?
              </h3>
              <p className="mb-2 text-gray-400">
                Start a conversation or select a chat from the sidebar.
              </p>
            </div>
          ) : (
            [...chat].map((item, idx) => (
              <div
                key={idx}
                className={`mb-4 p-3 rounded-lg break-words ${item.role === "user"
                  ? "bg-blue-900 text-right ml-auto w-fit max-w-lg"
                  : "bg-gray-800 text-left mr-auto w-3/4"
                  }`}
              >
                <ReactMarkdown
                  // className="prose prose-invert max-w-none"
                  children={item.content}
                />
              </div>
            ))
          )}
        </div>
        {/* Chat input */}
        {(selectedChatId || chat.length > 0) ? (
          <form
            className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 border border-gray-800 rounded-full px-4 py-2 bg-gray-800 z-20 transition-all duration-200"
            style={{
              boxShadow: "0 2px 16px 0 #0004",
              width: "96vw",
              maxWidth: chatAreaWidth === "max-w-4xl" ? "56rem" : "72rem", // 4xl=56rem, 6xl=72rem
            }}
            onSubmit={handleSend}
          >
            <Textarea
              rows={1}
              value={text}
              resize={false}
              placeholder="Ask anything"
              className="flex-1 bg-transparent outline-none text-gray-100 text-lg"
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  handleSend(e);
                }
              }}
            />
            <MY_DRIVE_BTN msg={text} />
            <button type="submit">
              <IoMdSend className="text-2xl text-blue-400" />
            </button>
          </form>
        ) : (
          <form
            className="flex items-center gap-2 border border-gray-800 rounded-full px-4 py-2 bg-gray-800 mx-auto mt-8 mb-8"
            style={{ width: "80%", maxWidth: 600 }}
            onSubmit={handleSend}
          >
            <Textarea
              rows={1}
              value={text}
              resize={false}
              placeholder="Ask anything"
              className="flex-1 bg-transparent outline-none text-gray-100 text-lg"
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  handleSend(e);
                }
              }}
            />
            <MY_DRIVE_BTN msg={text} />
            <button type="submit">
              <IoMdSend className="text-2xl text-blue-400" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Askme;