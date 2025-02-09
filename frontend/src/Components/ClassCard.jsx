import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";
import { Avatar } from "@material-tailwind/react";
import { GET_USER_PROFILE } from "../services/constants";
import axios from "axios";

function ClassCard({ title, date,alternateLink, classId ,section,ownerId,descriptionHeading}) {
  const { setModule } = useAuth();
  const [user,setUser]=useState({})
  // useEffect(async() => {
  //   const result=await axios.get(`${GET_USER_PROFILE}/${ownerId}`)
  //   if(result){
  //     setUser(result.data)
  //   }
  // }, [])
  
  const handleClick = () => {
    setModule(classId);
    console.log(classId);
  };
  const datetoShow=new Date(date).toLocaleString()

  return (
    <Link
      to={alternateLink}
      target="__blank"
      onClick={handleClick}
      className="w-60 h-64 min-w-60 hover:bg-gray-800 transition-all duration-300 bg-grey-6 mx-2 rounded-xl flex flex-col overflow-hidden justify-between pb-2"
    >
      <div className="w-full">
        <img
          src="https://builtin.com/sites/www.builtin.com/files/2024-10/artificial-intelligence.jpg"
          className="w-full object-cover max-h-[50%]"
        />
        <div className="">

        <h3 className="mx-4 mt-2 w-[75%] font-bold text-lg text-base-1">
          {title.slice(0,15)+"..."}
        </h3>
        <h3 className="mx-4 mt-2 w-[75%] font-bold text-xs text-base-1">
          {descriptionHeading}
        </h3>
      </div>
      <div className="fixed bottom-4">
        <div className="mx-4 mt-4 mb-2 flex gap-x-2 font-semibold text-sm">
          {/* {user?.photoUrl?<Avatar size="xs" src={user?.photoUrl}/>:<FaUserCircle color="white" size={20} />}
          <p>{user?.name?.fullName}</p> */}
        </div>
        <div className="flex items-center justify-between">
          <p className="mx-4 text-xs text-grey-1 w-full text-left">{datetoShow}</p>
        </div>
      </div>
      </div>
    </Link>
  );
}

export default ClassCard;
