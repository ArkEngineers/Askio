import React from "react";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div>
<<<<<<< HEAD
        <div className='text-base-3 bg-grey-9 h-screen'>
            <Outlet/>
        </div>
=======
      <div className="bg-grey-9 h-screen text-grey-5">
        <Outlet />
      </div>
>>>>>>> 4e87f9035169589c8c835fd4f1fe9ea8dab3a8f2
    </div>
  );
}

export default MainLayout;
