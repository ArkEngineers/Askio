import React from "react";

const SettingsToolTip = ({ showTooltip, setShowTooltip }) => {
  const handleLogout = () => {
    setShowTooltip(false);
  };
  return (
    <div
      className={`absolute z-10 bottom-5 left-5 bg-gray-300 rounded-xl min-h-12 w-64 flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${
        showTooltip ? "translate-x-0" : "-translate-x-100"
      }`}
    >
      <p
        onClick={handleLogout}
        className="font-medium py-2 border-b border-b-gray-400 w-full text-center cursor-pointer hover:bg-red-200 transition-all duration-300"
      >
        Log out
      </p>
      <p
        onClick={() => setShowTooltip(!showTooltip)}
        className="font-medium py-2 w-full text-center cursor-pointer hover:bg-gray-100 transition-all duration-300"
      >
        Close
      </p>
    </div>
  );
};

export default SettingsToolTip;
