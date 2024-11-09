import React, { useState } from "react";
import { Textarea, Button, IconButton } from "@material-tailwind/react";
import { IoMdSend } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { CgFileAdd } from "react-icons/cg";

function Askme() {
  const [text, setText] = useState("");
  const [chat, setChat] = useState([""]);

  return (
    <div className="h-screen p-2flex flex-col justify-center items-center">
      <div className=" border-2 border-base-2 rounded-md min-h-[60%] p-2 text">
        {chat.map((item, key) => {
          return (
            <div
              key={key}
              className="bg-grey-9 p-2 rounded-md mb-2 text-white text-right"
            >
              {console.log(item)}
              <p>{item}</p>
            </div>
          );
        })}
      </div>
      <div className=" flex h-10 items-center gap-2">
        <button className="flex justify-center items-center text-center rounded-full bg-base-3 p-1">
          All
          <MdCancel />
        </button>
        <button className="flex justify-center items-center text-center rounded-full border border-white bg-grey-9 p-1">
          <CgFileAdd />
          Add Context
        </button>
      </div>

      <div className="">
        <Chatarea text={text} setText={setText} chat={chat} setChat={setChat} />
      </div>
    </div>
  );
}

function Chatarea({ text, setText, chat, setChat }) {
  function handleChange(e) {
    setText(e.target.value);
  }

  function handelClick(e) {
    e.preventDefault();
    setChat([...chat, text]);
    setText("");
  }
  return (
    <div className="flex w-full flex-row items-center gap-2 rounded-[99px] border-2 border-base-2 bg-grey-9 full ">
      <Textarea
        rows={1}
        value={text}
        resize={false}
        placeholder="Your Message"
        className="min-h-full !border-0 focus:border-transparent"
        containerProps={{
          className: "grid h-full",
        }}
        labelProps={{
          className: "before:content-none after:content-none",
        }}
        onChange={handleChange}
      />
      <div>
        <IoMdSend className=" cursor-pointer" onClick={handelClick} />
      </div>
    </div>
  );
}

export default Askme;
