import React, { useState } from "react";

function OptionBox({ option, content }) {
  const [answer, setAnswer] = useState("");
  const handleClick = () => {
    setAnswer("correct");
  };
  return (
    <div
      onClick={handleClick}
      className={`flex h-12 w-56 border-2 border-white rounded-full px-5 py-2 gap-x-2 cursor-pointer hover:bg-white hover:text-black transition-all duration-300 ${
        answer === "correct"
          ? "bg-green-500 text-white hover:bg-green-500"
          : answer === "wrong"
          ? "bg-red-500 text-white hover:bg-red-500"
          : ""
      }`}
    >
      <p>{option}. </p>
      <p>{content}</p>
    </div>
  );
}

export default OptionBox;
