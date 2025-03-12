import React from "react";
import Greet from "./Greet";
import SuggestionCards from "./SuggestionCards";

const ChatArea = () => {
  return (
    <div className="max-w-2/3 mx-auto">
      <Greet />
      <SuggestionCards />
    </div>
  );
};

export default ChatArea;
