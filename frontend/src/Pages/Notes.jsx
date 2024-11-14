import React, { useEffect, useState } from "react";
import { FaSheetPlastic } from "react-icons/fa6";
import { useAuth } from "../Context/AuthContext";
import { AUTH_ROUTE } from "../services/constants";
import axios from "axios";
function Notes() {
  const arr = [1, 2, 3, 4, 5];
  const { selectedModule } = useAuth();
  const [allNotes, setAllNotes] = useState([]);
  const [classname, setClassname] = useState("");

  const fetchAllNotes = async () => {
    try {
      const response = await axios.get(`${AUTH_ROUTE}/group/${selectedModule}`);
      console.log(response.data);
      setClassname(response.data.groupName);

      if (response.status === 200) setAllNotes(response.data.notes);
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    fetchAllNotes();
  }, []);
  return (
    <div className="pt-36 pb-12 pl-20 gap-12 grid place-items-center">
      <div className="w-1/2">
        <h1 className="text-2xl font-bold pb-4">{classname}</h1>
        {allNotes.map((items, key) => {
          return (
            <div
              key={key}
              className="flex hover:bg-grey-8 px-4 border-b border-grey-6 justify-between py-2 items-center"
            >
              <div className="flex gap-4 items-center">
                <FaSheetPlastic className="p-2 rounded-lg text-5xl text-grey-6 bg-grey-4" />
                <h1 className="text-lg text-bold text-grey-3">{items.title}</h1>
              </div>
              <p className="text-xs text-grey-1">9 Nov 2024</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Notes;
