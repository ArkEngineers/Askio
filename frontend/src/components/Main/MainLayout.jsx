import React from "react";
import TopBar from "./TopBar";
import ChatArea from "./ChatArea";
import InputArea from "./InputArea";

const MainLayout = () => {
  return (
    <div className="w-full relative">
      <TopBar />
      <ChatArea />
      <InputArea />
    </div>
  );
};

export default MainLayout;
