import React from "react";

const TopBar = () => {
  return (
    <div className="w-full p-8 py-3 shadow bg-white">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-3xl font-medium text-blue-800 ">Askio</h1>
        <img
          className="size-10 rounded-full"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9U_c5cI4iHSsKXXvNHc6_aRv4kgk3abVsDw&s"
        />
      </div>
    </div>
  );
};

export default TopBar;
