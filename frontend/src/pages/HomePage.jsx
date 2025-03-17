import React from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import MainLayout from "../components/Main/MainLayout";

const HomePage = () => {
  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <MainLayout />
    </div>
  );
};

export default HomePage;
