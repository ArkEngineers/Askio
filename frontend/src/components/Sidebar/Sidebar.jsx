import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import {
  IoChatboxOutline,
  IoFlashOutline,
  IoMenu,
  IoSettingsOutline,
} from "react-icons/io5";
import { PiSealQuestion } from "react-icons/pi";
import SettingsToolTip from "./SettingsToolTip";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const handleSidebarCollapse = () => {
    setCollapsed(!collapsed);
  };
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={`relative h-screen flex flex-col justify-between bg-gray-200 transition-all duration-300 p-5 ${
        collapsed ? "w-1/16" : "w-1/6"
      }`}
    >
      <div>
        <div
          className={`flex  items-center justify-start px-3 rounded-full h-12 transition-all duration-300  ${
            collapsed ? "w-12 rounded-full" : "w-full"
          }`}
        >
          <IoMenu
            size={24}
            className="cursor-pointer"
            onClick={handleSidebarCollapse}
          />
        </div>

        <div
          className={`flex  items-center justify-center bg-gray-300 rounded-full mt-5 h-12 hover:bg-blue-200 transition-all duration-300 cursor-pointer ${
            collapsed ? "w-12" : "w-full"
          }`}
        >
          <FiPlus size={20} className="min-w-6" />
          <div
            className={`overflow-hidden transition-all duration-300 delay-75 ${
              collapsed ? "opacity-0 w-0 h-0" : "opacity-100 ml-2"
            }`}
          >
            <p className="text-sm font-medium text-nowrap">New Chat</p>
          </div>
        </div>
        <div
          className={`overflow-hidden transition-all duration-400 ${
            collapsed ? "opacity-0 w-0 h-0" : "opacity-100 ml-2"
          }`}
        >
          <div className="flex flex-col">
            <h2 className="font-medium text-lg mt-5">Recents</h2>
            <div className="mt-2 flex flex-col items-start justify-centerw-full">
              <div className="flex items-center justify-start gap-2 hover:bg-blue-200 py-3 px-3 w-full rounded-full cursor-pointer transition-all duration-300">
                <IoChatboxOutline size={18} />
                <p className="text-sm text-ellipsis overflow-hidden text-nowrap max-w-[80%]">
                  AI Notes Unit 1 Understaing artificial
                </p>
              </div>
              <div className="flex items-center justify-start gap-2 hover:bg-blue-200 py-3 px-3 w-full rounded-full cursor-pointer transition-all duration-300">
                <IoChatboxOutline size={18} />
                <p className="text-sm text-ellipsis overflow-hidden text-nowrap max-w-[80%]">
                  AI Notes Unit 1 Understaing artificial
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div
          className={`flex  items-center justify-start px-3  rounded-full h-12 hover:bg-blue-200 transition-all duration-300 cursor-pointer ${
            collapsed ? "w-12 rounded-full" : "w-full px-3"
          }`}
        >
          <PiSealQuestion size={20} className="min-w-6" />
          {/* <PiSealQuestionFill /> */}
          <div
            className={`overflow-hidden transition-all duration-400 ${
              collapsed ? "opacity-0 w-0 h-0" : "opacity-100 ml-2"
            }`}
          >
            <p className="font-medium">Quiz</p>
          </div>
        </div>
        <div
          className={`flex  items-center justify-start px-3  rounded-full h-12 hover:bg-blue-200 transition-all duration-300 cursor-pointer ${
            collapsed ? "w-12 rounded-full" : "w-full px-3"
          }`}
        >
          <IoFlashOutline size={20} className="min-w-6" />
          {/* <IoFlashSharp /> */}

          <div
            className={`overflow-hidden transition-all duration-400 ${
              collapsed ? "opacity-0 w-0 h-0" : "opacity-100 ml-2"
            }`}
          >
            <p className="font-medium">Flashcards</p>
          </div>
        </div>
        <div
          onClick={() => setShowTooltip(!showTooltip)}
          className={` flex  items-center justify-start px-3  rounded-full h-12 hover:bg-blue-200 transition-all duration-300 cursor-pointer ${
            collapsed ? "w-12 rounded-full" : "w-full px-3"
          }`}
        >
          <IoSettingsOutline size={20} className="min-w-6" />
          {/* <IoSettingsSharp /> */}

          <div
            className={`overflow-hidden transition-all duration-400 ${
              collapsed ? "opacity-0 w-0 h-0" : "opacity-100 ml-2"
            }`}
          >
            <p className="font-medium">Settings</p>
          </div>
        </div>
      </div>
      <SettingsToolTip
        showTooltip={showTooltip}
        setShowTooltip={setShowTooltip}
      />
    </div>
  );
};

export default Sidebar;
