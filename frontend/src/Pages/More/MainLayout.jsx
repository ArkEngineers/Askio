
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../Components/Navbar";

function MainLayout() {
  return (
    <div>
      <div className="bg-grey-9 w-full">
        <Navbar/>
      </div>
      <div className="bg-grey-9 h-screen text-grey-5">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
