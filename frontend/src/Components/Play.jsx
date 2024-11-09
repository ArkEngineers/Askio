import React from "react";
import CircleQuestion from "./CircleQuestion";
import OptionBox from "./OptionBox";

function Play() {
  return (
    <div className="w-full h-screen bg-grey-9 pt-20">
      <div className="flex justify-around">
        <div className="bg-grey-8 min-h-72 w-40 ml-10 rounded-2xl p-5 flex flex-col items-center justify-center">
          <p className="font-bold text-center">Questions</p>
          <div className="flex flex-wrap gap-x-4 gap-y-4 mt-10 items-center justify-center">
            <CircleQuestion number={1} current={true} />
            <CircleQuestion number={2} />
            <CircleQuestion number={3} />
            <CircleQuestion number={4} />
            <CircleQuestion number={5} />
            <CircleQuestion number={6} />
            <CircleQuestion number={7} />
            <CircleQuestion number={8} />
            <CircleQuestion number={9} />
            <CircleQuestion number={10} />
          </div>
        </div>
        <div className="bg-grey-8 min-h-72 max-w-[50%] rounded-2xl p-5 flex flex-col items-center">
          <p className="font-bold text-center bg-base-3 px-2 rounded-full">
            Hard
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-4 mt-10">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis
              repellendus, iste natus blanditiis nihil eum? Beatae quaerat
              reiciendis necessitatibus facere quis earum aut, accusamus iusto
              sunt maxime illo similique ipsam.
            </p>
            <p className="mt-6">Select an option</p>
            <div className="w-full flex flex-wrap gap-x-10 gap-y-5">
              <OptionBox option={"a"} content={"Circle"} />
              <OptionBox option={"b"} content={"Square"} />
              <OptionBox option={"d"} content={"Triangle"} />
              <OptionBox option={"d"} content={"Cross"} />
            </div>
          </div>
        </div>
        <div className="bg-grey-8 h-32 w-40 rounded-2xl p-5 flex flex-col items-center justify-center">
          <p className="font-bold text-center">Time Left</p>
          <h1 className="text-4xl font-bold">00:59s</h1>
        </div>
      </div>
    </div>
  );
}

export default Play;
