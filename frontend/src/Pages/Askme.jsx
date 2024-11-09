import React, { useState } from "react";
import { Textarea, Button, IconButton } from "@material-tailwind/react";

function Askme() {
  const [text, setText] = useState("");
  const [chat, setChat] = useState(["hi"]);

  return (
    <div className="h-screen p-2">
      <div className=" border-2 border-base-2 rounded-md min-h-[60%] p-2">
        ask now
      </div>
      <div className="border-2 border-base-2 rounded-md h-10 p-2"></div>
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
  return (
    <div className="flex w-full flex-row items-center gap-2 rounded-[99px] border-2 border-base-2 bg-grey-9 max-w-[60%] ">
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
      <div>{console.log(text)}</div>
    </div>
  );
}

export default Askme;
