import React from "react";

function QuizCard() {
  return (
    <div className="w-60 h-40 bg-grey-6 mx-2 rounded-xl flex flex-col overflow-hidden justify-between pb-2 relative">
      <img
        src="https://st4.depositphotos.com/2572561/31066/i/450/depositphotos_310665768-stock-photo-over-the-shoulder-shot-of.jpg"
        className="h-1/3 w-full object-cover"
      />
      <h3 className="mx-4 text-sm text-base-1">AI Unit 4 Quiz</h3>
      <div>
        <p className="mx-4 text-xs text-grey-1 w-full text-left">9 Nov</p>
      </div>
    </div>
  );
}

export default QuizCard;
