import React from "react";
import FolderCard from "../Components/FolderCard";
import { FaFolder } from "react-icons/fa";

function Home() {
  return (
    <div>
      <h2 className="text-3xl py-10 text-center font-semibold text-base-1">
        Good morning, Harshad Mehta
      </h2>
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col gap-y-2">
          <div className="px-4 flex gap-x-2 items-center">
            <FaFolder className="text-grey-1" />
            <p className="text-sm text-grey-1 w-full text-left">Your Folders</p>
          </div>
          <div className="flex w-full items-center justify-center">
            <FolderCard />
            <FolderCard />
            <FolderCard />
            <FolderCard />
            <FolderCard />
            <FolderCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
