import React from "react";

const SettingsToolTip = () => {
  return (
    <div className="absolute bg-gray-200 rounded-xl min-h-12 w-32 flex flex-col items-center justify-center overflow-hidden">
      <p className="font-medium py-2 border-b border-b-gray-300 w-full text-center cursor-pointer hover:bg-gray-100 transition-all duration-300">
        Log out
      </p>
      <p className="font-medium py-2 w-full text-center cursor-pointer hover:bg-gray-100 transition-all duration-300">
        Log out
      </p>
    </div>
  );
};

export default SettingsToolTip;
