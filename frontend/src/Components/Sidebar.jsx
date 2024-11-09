import React from "react";
import { FaHome, FaPuzzlePiece } from "react-icons/fa";
import { FcSettings } from "react-icons/fc";
import { FiHome } from "react-icons/fi";
import { SlPuzzle, SlSettings } from "react-icons/sl";



export function Sidebar() {
    const [open, setOpen] = React.useState(0);

    const handleOpen = (value) => {
        setOpen(open === value ? 0 : value);
    };

    return (
        <div className="fixed left-0 top-20 text-base-3 flex flex-col justify-start items-center text-2xl bg-grey-9 h-screen border-r gap-6 border-gray-800 z-10 h-[calc(100vh-2rem)] p-4 shadow-xl shadow-blue-gray-900/5">
            <FiHome/>
            <SlPuzzle/>
            <SlSettings/>
        </div>
    );
}