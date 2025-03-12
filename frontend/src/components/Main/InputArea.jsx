import React, { useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoSend } from "react-icons/io5";

const InputArea = () => {
  const [text, setText] = useState("");
  const [context, setContext] = useState("default");

  const handleInput = (e) => {
    setText(e.target.value);
    e.target.style.height = "auto"; // Reset height
    e.target.style.height = `${e.target.scrollHeight}px`; // Set to content height
  };
  return (
    <div className="absolute bottom-0 left-0 right-0 w-full px-10 py-3 pb-0">
      <div className="flex items-center justify-start gap-3 px-5">
        <div
          onClick={() => setContext("default")}
          className={`px-3 py-1 rounded-full my-2 cursor-pointer transition-all duration-300  ${
            context === "default"
              ? "bg-blue-200 "
              : "bg-gray-200 hover:bg-gray-100"
          }`}
        >
          <p className="text-sm "> Default context</p>
        </div>
        <div
          onClick={() => setContext("current")}
          className={`px-3 py-1 rounded-full my-2 cursor-pointer transition-all duration-300  ${
            context === "current"
              ? "bg-blue-200 "
              : "bg-gray-200 hover:bg-gray-100"
          }`}
        >
          <p className="text-sm "> Current context</p>
        </div>
        {/* <div className="bg-gray-200 px-3 py-1 rounded-full my-2 cursor-pointer">
          Current context
        </div> */}
      </div>
      <div className="flex justify-between items-end bg-gray-200 rounded-4xl px-5 py-3 gap-5">
        <textarea
          rows="1"
          value={text}
          onChange={handleInput}
          placeholder="Ask me anything..."
          className="w-full border-none outline-none bg-transparent resize-none max-h-40"
        />
        <div className="flex gap-x-5 items-center">
          <IoMdAddCircleOutline
            size={26}
            className="cursor-pointer hover:text-gray-500 transition-all duration-300"
          />
          <IoSend
            size={24}
            className="cursor-pointer hover:text-gray-500 transition-all duration-300"
          />
        </div>
      </div>
      <p className="text-xs tracking-tight text-gray-400 m-3 font-light">
        Askio answers questions only from uploaded documents, without using the
        any external knowledge. All responses are based solely on the provided
        documents.
      </p>
    </div>
  );
};

export default InputArea;
