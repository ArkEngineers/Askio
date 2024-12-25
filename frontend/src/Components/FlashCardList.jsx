import React, { useState } from "react";

function Flashcard({ flashcard }) {
  const [flip, setFlip] = useState(false);

  return (
    <div
      onClick={() => setFlip(!flip)}
      className="relative text-white w-64 aspect-square rounded-xl flex items-center justify-center cursor-pointer transition-transform duration-500"
      style={{
        transformStyle: "preserve-3d",
        transform: flip ? "rotateY(180deg)" : "rotateY(0deg)",
      }}
    >
      {/* Front side */}
      <div
        className="absolute w-full h-full bg-gray-800 flex items-center justify-center rounded-xl"
        style={{
          backfaceVisibility: "hidden",
        }}
      >
        {flashcard.question}
      </div>

      {/* Back side */}
      <div
        className="absolute w-full h-full bg-blue-600 flex items-center justify-center rounded-xl"
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)", // Ensure the back side is rotated 180 degrees
        }}
      >
        {flashcard.answer}
      </div>
    </div>
  );
}


function FlashCardList({flashcard}) {
  return (
    <div className='grid grid-cols-4 gap-10 place-items-center py-12'>
        {flashcard.map(flash=>{
            return(
                <Flashcard key={flash.id} flashcard={flash}/>
            )
        })}

    </div>
  )
}

export default FlashCardList