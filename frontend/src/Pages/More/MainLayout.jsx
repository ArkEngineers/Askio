import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { Sidebar } from "../../Components/Sidebar";
import { AlertCustomStyles } from "../../Components/Alerts";
import { useAuth } from "../../Context/AuthContext";

function MainLayout() {
  const {open}=useAuth()
  return (
    <div>
      <div className="bg-grey-9 w-full">
        <Navbar />
      </div>
      <div className="bg-grey-9 min-h-[100vh] text-grey-5">
        <Outlet />
      </div>
      <Sidebar />
      {open&&<AlertCustomStyles/>}
    </div>
  );
}

export default MainLayout;
