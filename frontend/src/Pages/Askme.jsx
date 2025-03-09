import React, { useState, useEffect, useRef } from "react";
import { Checkbox, Menu, MenuHandler, MenuItem, MenuList, Textarea } from "@material-tailwind/react";
import { IoMdSend } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { CgAttachment, CgFileAdd } from "react-icons/cg";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import {
  AUTH_ROUTE,
  FetchChat,
  FetchChatId,
  QUERY_ROUTE,
  TALK_WITH_CONTEXT_ROUTE,
  TEXT_GENERATE_ROUTE,
} from "../services/constants";
import { MY_DRIVE_BTN } from "../Components/APIButtons";
import { api } from "../services/api";

function Askme() {
  const { user,selectedPDF,fileIds,setfileIds,fetchpdfFromGoogleDrive,setMessage,setOpen } = useAuth();
  const [text, setText] = useState("");
  const [chat, setChat] = useState([]);
  const [modal, setModal] = useState(true);
  const searchRef = useRef(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const { selectedModule } = useAuth();
  const [allNotes, setAllNotes] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatIds, setChatIds] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [allChecked, setAllChecked] = useState(false);
  const chatContainerRef = useRef(null);
  const [pdfSelected, setPdfSelected] = useState(false); // New state to track PDF selection

  const conversationStarters = [
    "What's on your mind today?",
    "Have any questions about the project?",
    "Need help brainstorming ideas?",
    "Want to share some updates?",
    "What's the most exciting thing you learned recently?",
  ];

  const fetchChatMessages = async (chatId) => {
    try {
      const response = await axios.post(`${FetchChat}`, { chatId });
      if (response.status === 200) {
        setfileIds(response.data.data.fileIds)
        setChat(response.data.data.messages);
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  const fetchChatIds = async () => {
    try {
      const response = await axios.post(`${FetchChatId}`, { userId: user._id });
      if (response.status === 200) {
        console.log(response.data.data);
        setChatIds(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching chat IDs:", error);
    }
  };

  useEffect(() => {
    // fetchAllNotes();
    fetchChatIds();
  }, []);

  useEffect(()=>{
    if(chatContainerRef.current){
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  },[chat])
  
  useEffect(() => {
    if (selectedPDF.length > 0) {
      setAllChecked(false);
      setPdfSelected(true);
    } else {
      if (selectedChatId === null) {
        setAllChecked(true);
      }else{
        setAllChecked(false)
      }
      setPdfSelected(false);
    }
  }, [selectedPDF, selectedChatId]);

  const handleChatIdClick = (chatId) => {
    if (chatId === "default") {
      setSelectedChatId(null);
      setChat([]);
      setText("");
    } else {
      setSelectedChatId(chatId);
      fetchChatMessages(chatId);
    }
  };


  return (
    <div className="pt-24 pb-6 h-full p-2 flex flex-col justify-center items-center relative">
      <div className="w-8/12 rounded-md flex flex-1 p-2 flex-col-reverse justify-end overflow-y-auto" ref={chatContainerRef}>
        {chat.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <h3 className="mb-4 text-4xl text-white font-bold">
              New to Askio! .. askme?
            </h3>
            <h3 className="mb-4 text-lg font-semibold">
              Here are some Conversation Starters
            </h3>
            <ul className="flex flex-col space-y-2 text-center">
              {conversationStarters.map((starter, index) => (
                <li
                  key={index}
                  className="cursor-pointer text-blue-500 hover:underline"
                  onClick={() => setText(starter)}
                >
                  {starter}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          chat.slice().reverse().map((item, key) => (
            <div
              key={key}
              className={`p-2 rounded-lg mb-16 ${item.role != "user"
                  ? "bg-blue-500 text-white text-left ml-0 w-10/12"
                  : "bg-base-4 text-base-1 text-right ml-auto w-8/12"
                }`}
            >
              <p>{item.content}</p>
            </div>
          ))
        )}
      </div>

      {/* <div className="flex w-8/12  h-10 items-center gap-2 m-2 p-4">
        {!selectedTags.length && (
          <button className="flex gap-x-2 text-sm px-3 justify-between items-center text-center rounded-full bg-base-3 p-1">
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
      </div> */}
      <div className="w-8/12 fixed bottom-2 z-10">
        <div className="flex gap-2 items-center ">
          <Checkbox checked={allChecked} color="blue" label={<p className="text-base-3 font-bold">All</p>} onChange={(e) => setAllChecked(e.target.checked)}/>
          {selectedPDF.length!=0 && selectedPDF.map(file=><p className="border border-red-800 text-xs h-fit w-fit p-1 px-3 rounded-xl">{file}</p>)}
        </div>
        <Chatarea 
          text={text} 
          setText={setText} 
          chat={chat} 
          setChat={setChat} 
          selectedPDF={selectedPDF}
          selectedChatId={selectedChatId} 
          setSelectedChatId={setSelectedChatId}
          fetchChatMessages={fetchChatMessages}
          allChecked={allChecked}
          pdfSelected={pdfSelected} // Pass the pdfSelected state
          setPdfSelected={setPdfSelected}
          fetchChatIds={fetchChatIds}
        />
      </div>

      <button
        className="absolute top-4 right-4 bg-blue-500 text-white p-2 rounded-full"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? "Close" : "Open"} Chat IDs
      </button>

      <div
        className='fixed top-0 right-0 h-full py-16 shadow-base-3 shadow-lg transform transition-transform w-1/8 bg-grey-9'
      >
        <div className="p-2 ">
          <ul className="text-xs">
          <li
              className={`mb-2 cursor-pointer ${
                selectedChatId === null ? "bg-base-4" : "bg-base-6"
              } hover:bg-base-4 rounded-lg p-2`}
              onClick={() => handleChatIdClick("default")}
            >
              New Chat
            </li>
            {chatIds.map((chatId) => (
              <Menu key={chatId._id} placement="left" allowHover>
              <MenuHandler>
              <div>
                    <li
                      className={`mb-2 cursor-pointer ${
                        selectedChatId === chatId._id ? "bg-blue-200" : "bg-base-6"
                      } hover:bg-base-4 rounded-lg p-2`}
                      onClick={() => handleChatIdClick(chatId._id)}
                    >
                      Chat-{chatId._id}
                    </li>
                  </div>
                </MenuHandler>
                <MenuList className="bg-base-4 text-white border-0">
                  <MenuItem onClick={async () => {
                    console.log("Create Quiz clicked");
                    for (const fileId of fileIds) { // Use 'of' instead of 'in' to iterate over array elements
                      try {
                        console.log(fileId);
                        const response = await fetchpdfFromGoogleDrive({ fetch_type: "quiz", fileId });
                        if (response) {
                          console.log(response);
                          setMessage(response.message)
                          setOpen(true)

                        }
                      } catch (error) {
                        console.error(error);
                      }
                    }
                  }}>
                    Create Quiz
                  </MenuItem>
                    <MenuItem onClick={async () => {
                    console.log("Create Quiz clicked");
                    for (const fileId of fileIds) { // Use 'of' instead of 'in' to iterate over array elements
                      try {
                        console.log(fileId);
                        const response = await fetchpdfFromGoogleDrive({ fetch_type: "flashcard", fileId });
                        if (response) {
                          console.log(response);
                          setMessage(response.message)
                          setOpen(true)
                        }
                      } catch (error) {
                        console.error(error);
                      }
                    }
                  }}>
                      Create Flashcard
                    </MenuItem>
                </MenuList>
            </Menu>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Chatarea({ text, setText, chat, setChat, selectedChatId, setSelectedChatId,fetchChatMessages, allChecked, fetchChatIds,selectedPDF,pdfSelected,setPdfSelected  }) {
  const { user,setMessage,setOpen,setselectedPDF,PDFDATA,fetchpdfFromGoogleDrive } = useAuth();

  function handleChange(e) {
    setText(e.target.value);
  }

  async function handelClick(e) {
    e.preventDefault();
    try {
      let chatId = selectedChatId;
      if (!allChecked && !selectedChatId) {
        if(!pdfSelected){
          setMessage("Please select a PDF first before starting a new chat.");
          setOpen(true)
          return;
        }

        const fileIds = PDFDATA.map(file => file?.id);
        const response = await fetchpdfFromGoogleDrive({fetch_type:"pdf", msg:text, fileId:fileIds});
        if (response) {
          console.log(response)
          fetchChatIds();
          setSelectedChatId(response.data.chatId);
          fetchChatMessages(response.data.chatId);
          setselectedPDF([]);
        }
        // // Create a new chat
        // const response = await axios.post(TALK_WITH_CONTEXT_ROUTE, { userId: user._id });
        // if (response.status === 200) {
        //   chatId = response.data.data._id;
        //   fetchChatIds();
        // }
      }

      // Add the user's message to the chat
      setChat((prevChat) => [...prevChat, { text, isBot: false }]);

      // Hitting API Here
      if(selectedChatId){
        const response = await axios.post(TALK_WITH_CONTEXT_ROUTE, {
          Input_Msg: text,
          chatId: chatId || user?.chatId,
        });
        if (response.status === 200 && response.data.data) {
          setChat((prevChat) => [
            ...prevChat,
            { text: response.data.data.response_text, isBot: true },
          ]);
        }
  
      }
     
      // Clear the input field
      setText("");

      // Switch to the user's chat ID if "All" is checked
      if (allChecked) {
        setSelectedChatId(user?.chatId);
        fetchChatMessages(user?.chatId);
      }else if (selectedChatId){
        setSelectedChatId(selectedChatId);
        fetchChatMessages(selectedChatId);
      }

    } catch (error) {
      console.error("Error processing message:", error); // Log any error
    }
  }
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handelClick(e);
    }
  }


  return (
    <div className="flex w-full px-4 flex-row items-center gap-2 rounded-[99px] border-2 border-base-2 bg-grey-9">
      <Textarea
        rows={1}
        value={text}
        resize={false}
        placeholder="Your Contexts"
        className="min-h-full !border-0 focus:border-transparent text-base-lg text-white"
        containerProps={{
          className: "grid h-full",
        }}
        labelProps={{
          className: "before:content-none after:content-none",
        }}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <div className="flex items-center justify-center space-x-2">
        <MY_DRIVE_BTN msg={text} />
        <IoMdSend className="text-3xl cursor-pointer" onClick={handelClick}/>
      </div>
    </div>
  );
}

export default Askme;
