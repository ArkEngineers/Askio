import React from "react";
import { GoLightBulb } from "react-icons/go";
import {
  IoChatboxOutline,
  IoCodeSlash,
  IoCompassOutline,
} from "react-icons/io5";

const SuggestionCards = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 p-5">
      <div className="bg-gray-200 hover:bg-gray-100 transition-all duration-300 rounded-xl p-5 cursor-pointer relative min-h-32 ">
        <p>Create a quiz from all my past notes.</p>
        <IoCompassOutline className="absolute bottom-4 right-4 text-xl" />
      </div>
      <div className="bg-gray-200 hover:bg-gray-100 transition-all duration-300 rounded-xl p-5 cursor-pointer relative min-h-32">
        <p>Make a quick test about Machine Learning?</p>
        <GoLightBulb className="absolute bottom-4 right-4 text-xl" />
      </div>
      <div className="bg-gray-200 hover:bg-gray-100 transition-all duration-300 rounded-xl p-5 cursor-pointer relative min-h-32">
        <p>What is Neural Network in Artificial Intelligence?</p>
        <IoChatboxOutline className="absolute bottom-4 right-4 text-xl" />
      </div>
      <div className="bg-gray-200 hover:bg-gray-100 transition-all duration-300 rounded-xl p-5 cursor-pointer relative min-h-32">
        <p>How to implement queue data structure using arrays?</p>
        <IoCodeSlash className="absolute bottom-4 right-4 text-xl" />
      </div>
    </div>
  );
};

export default SuggestionCards;
