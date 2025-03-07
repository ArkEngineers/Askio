import React, { useState } from "react";
import { Link } from "react-router-dom";

function FlashCardList({flashcard}) {
  console.log(flashcard)
  function stringToSlug(str) {
    return str
      .toLowerCase() // Convert to lowercase
      .trim() // Remove whitespace from start and end
      .replace(/[^a-z0-9 -]/g, "") // Remove invalid characters
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/-+/g, "-"); // Replace multiple - with single -
  }
  return (
    <div className="py-12 grid place-items-center w-full ">
      <div className='grid grid-cols-3 gap-10 place-items-center py-12'>
        {flashcard.map(flash => {
          return (
            <Link to={`/app/flash/${stringToSlug(flash.PDF_Title)}`}><div key={flash._id} className="aspect-square bg-base-4 hover:bg-base-3 p-6 font-bold rounded-lg">{flash.PDF_Title}</div></Link>

          )
        })}
      </div>
    </div>
  )
}

export default FlashCardList