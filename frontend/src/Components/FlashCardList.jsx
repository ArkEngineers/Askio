import React from "react";
import { Link } from "react-router-dom";
// import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { IoMdDocument } from "react-icons/io";

function FlashCardList({ flashcard }) {
  function stringToSlug(str) {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  return (
    <div className="py-12 grid place-items-center w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-11/12 max-w-6xl">
        {flashcard.map((flash) => (
          <Link
            to={`/app/flash/${stringToSlug(flash.PDF_Title)}`}
            key={flash._id}
            className="w-full"
          >
            <div className="bg-grey-900 rounded-2xl shadow-md p-8 flex flex-col items-center text-center border border-gray-200 hover:shadow-blue-100 transition h-full">
              <IoMdDocument className="h-10 w-10 text-blue-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-white break-words">
                {flash.PDF_Title}
              </h2>
              <p className="text-gray-500">
                {flash.PDF_Description || "No description available."}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default FlashCardList;