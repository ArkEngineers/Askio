import React, { useState, useEffect, useRef } from "react";
import { Textarea } from "@material-tailwind/react";
import { IoMdSend } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { CgFileAdd } from "react-icons/cg";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import { AUTH_ROUTE, QUERY_ROUTE } from "../services/constants";
import { MY_DRIVE_BTN } from "../Components/APIButtons";

function Askme() {
  const [text, setText] = useState("");
  const [chat, setChat] = useState([]);
  const [modal, setModal] = useState(true);
  const searchRef = useRef(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const { selectedModule } = useAuth();
  const [allNotes, setAllNotes] = useState([]);

  const conversationStarters = [
    "What's on your mind today?",
    "Have any questions about the project?",
    "Need help brainstorming ideas?",
    "Want to share some updates?",
    "What's the most exciting thing you learned recently?",
  ];

  const fetchAllNotes = async () => {
    try {
      if (selectedModule) {
        const response = await axios.get(
          `${AUTH_ROUTE}/group/${selectedModule}`
        );
        if (response.status === 200) setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.error({ error });
    }
  };

  useEffect(() => {
    fetchAllNotes();
  }, []);

  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setModal(true);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="pt-24 pb-6 h-screen p-2 flex flex-col justify-center items-center">
      <div className="border-2 w-8/12 border-base-2 rounded-md flex flex-1 p-2 flex-col">
        {chat.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <h3 className="mb-4 text-4xl text-white font-bold">New to Askio! .. askme?</h3>
            <h3 className="mb-4 text-lg font-semibold">Here are some Conversation Starters</h3>
            <ul className="space-y-2 grid grid-cols-4 w-8/12 gap-10 place-items-center">
              {conversationStarters.map((starter, index) => (
                <li
                  key={index}
                  className="cursor-pointer w-fit text-blue-500 hover:underline"
                  onClick={() => setText(starter)}
                >
                  {starter}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          chat.map((item, key) => (
            <div
              key={key}
              className={`p-2 rounded-lg mb-2 ${item.isBot
                  ? "bg-blue-500 text-white text-left ml-0 w-1/2"
                  : "bg-base-4 text-base-1 text-right ml-auto w-fit"
                }`}
            >
              <p>{item.text}</p>
            </div>
          ))
        )}
      </div>


      {modal ? (
        <div className="flex w-8/12 h-10 items-center gap-2 m-2 p-4">
          {!selectedTags.length && (
            <button className="flex w-20 px-3 justify-between items-center text-center rounded-full bg-base-3 p-1">
              All
              <MdCancel />
            </button>
          )}
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-200 w-fit justify-between px-3 text-gray-700 rounded-full py-1 mr-2 flex items-center"
            >
              {tag}
              <button
                className="ml-2 text-xs text-gray-500 hover:text-gray-700"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(tag);
                }}
              >
                <MdCancel />
              </button>
            </span>
          ))}
          <button
            className="flex w-36 px-3 justify-between items-center text-center rounded-full border border-white bg-grey-9 p-1"
            onClick={() => setModal(false)}
          >
            <CgFileAdd />
            Add Context
          </button>
        </div>
      ) : (
        <div className="w-8/12" ref={searchRef}>
          <SearchPalette
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            colorTags={allNotes}
          />
        </div>
      )}
      <div className="w-8/12">
        <Chatarea text={text} setText={setText} chat={chat} setChat={setChat} />
      </div>
    </div>
  );
}

const SearchPalette = ({ selectedTags, setSelectedTags, colorTags }) => {
  const [searchInput, setSearchInput] = useState("");
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputClick = () => setDropdownVisible(true);

  const handleTagClick = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  async function handleClick(e) {
    e.preventDefault();
    try {
      const response = await axios.post(QUERY_ROUTE, {
        query: text,
        collection_name: "ML",
      });
      console.log(response.data); // Log the response data
      setChat([...chat, text]); // Add the text to chat after successful API call
      setText("");
    } catch (error) {
      console.error("Error fetching data:", error); // Log any error
    }
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className="flex flex-wrap items-center rounded-full px-4 py-1 my-1 cursor-pointer"
        onClick={handleInputClick}
      >
        {selectedTags.map((tag) => (
          <span
            key={tag}
            className="bg-gray-200 text-gray-700 rounded-full px-2 py-1 mr-2 flex items-center w-fit"
          >
            {tag}
            <button
              className="ml-2 text-xs text-gray-500 hover:text-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
            >
              <MdCancel />
            </button>
          </span>
        ))}
        <input
          type="text"
          placeholder="Search palettes"
          className="border-none outline-none flex-grow bg-transparent ml-2"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onFocus={handleInputClick}
          autoFocus
        />
      </div>

      {isDropdownVisible && (
        <div className="absolute top-full left-0 w-full bg-grey-9 border border-base-2 rounded-lg shadow-md mt-2 p-4">
          <div className="mb-4">
            <div className="flex flex-wrap mt-2">
              {console.log(colorTags)}
              {colorTags.map((tag) => (
                <span
                  key={tag.title}
                  className="bg-gray-100 text-gray-600 rounded-full px-3 py-1 m-1 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleTagClick(tag.title)}
                >
                  {tag.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function Chatarea({ text, setText, chat, setChat }) {
  function handleChange(e) {
    setText(e.target.value);
  }

  async function handelClick(e) {
    e.preventDefault();
    try {
      // Add the user's message to the chat
      setChat((prevChat) => [...prevChat, { text, isBot: false }]);
  
      // Simulate a response from the bot
      if (text.toLowerCase().includes("mongodb")){
        const mongoDB="MongoDB is a document-oriented database program that stores data in JSON-like documents. It's a NoSQL database that's designed to be flexible and scalable, and is often used as a cloud database"
        setTimeout(() => {
          setChat((prevChat) => [...prevChat, { text: mongoDB, isBot: true }]);
        }, 500);
      }else{
        const staticResponse = "Thank you for your message! How can I assist you further?";
        setTimeout(() => {
          setChat((prevChat) => [...prevChat, { text: staticResponse, isBot: true }]);
        }, 500); // Simulate a delay for the response
      }
      
  
      // Clear the input field
      setText("");
    } catch (error) {
      console.error("Error processing message:", error); // Log any error
    }
  }

  return (
    <div className="flex w-full px-4 flex-row items-center gap-2 rounded-[99px] border-2 border-base-2 bg-grey-9">
      <Textarea
        rows={1}
        value={text}
        resize={false}
        placeholder="Your Contexts"
        className="min-h-full !border-0 focus:border-transparent text-xl text-white"
        containerProps={{
          className: "grid h-full",
        }}
        labelProps={{
          className: "before:content-none after:content-none",
        }}
        onChange={handleChange}
      />
      <div>
        <MY_DRIVE_BTN/>
        <IoMdSend className="text-2xl cursor-pointer" onClick={handelClick} />
      </div>
    </div>
  );
}

export default Askme;
