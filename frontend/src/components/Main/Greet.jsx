import React from "react";

const Greet = () => {
  return (
    <div className="p-10 flex flex-col gap-5 w-full justify-center items-center">
      <p className="text-5xl font-medium bg-gradient-to-r  from-blue-600   to-violet-500 bg-clip-text text-transparent">
        Welcome to Askio!{" "}
      </p>
      <p className="text-5xl font-medium text-slate-400">How can I help you?</p>
    </div>
  );
};

export default Greet;
