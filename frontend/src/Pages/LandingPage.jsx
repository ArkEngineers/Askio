import React from "react";
import { Card } from "@material-tailwind/react";
import { FaGithub } from "react-icons/fa";
import GoogleLogin from "../Components/GoogleLogin";

export default function LandingPage() {
  return (
    <div className="bg-grey-9 min-h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center w-full">
        <h1 className="text-7xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
          Askio
        </h1>
        <p className="text-base-2 text-lg mb-2">
          An AI powered education partner that you can trust.
        </p>
        <p className="text-base-1 text-md mb-10">What's in it for you?</p>
        <div className="flex flex-row gap-6 mb-10">
          <div className="bg-grey-6 rounded-xl px-6 py-6 w-64 shadow text-base-1 text-left text-md flex flex-col justify-between">
            <span>Create a quiz from all my<br />past notes.</span>
            <span className="self-end text-base-2 text-xl mt-4">©</span>
          </div>
          <div className="bg-grey-6 rounded-xl px-6 py-6 w-64 shadow text-base-1 text-left text-md flex flex-col justify-between">
            <span>Make a quick test about<br />Machine Learning?</span>
            <span className="self-end text-base-2 text-xl mt-4">💡</span>
          </div>
          <div className="bg-grey-6 rounded-xl px-6 py-6 w-64 shadow text-base-1 text-left text-md flex flex-col justify-between">
            <span>What is Neural Network in<br />Artificial Intelligence?</span>
            <span className="self-end text-base-2 text-xl mt-4">💬</span>
          </div>
          <div className="bg-grey-6 rounded-xl px-6 py-6 w-64 shadow text-base-1 text-left text-md flex flex-col justify-between">
            <span>How to implement queue<br />data structure using arrays?</span>
            <span className="self-end text-base-2 text-xl mt-4">{"</>"}</span>
          </div>
        </div>
        <div className="flex flex-col items-center w-full">
          <GoogleLogin />
          <button
            className="w-60 mt-4 bg-grey-5 hover:bg-grey-4 opacity-50 py-4 flex items-center justify-center gap-4 rounded"
            disabled={true}
          >
            <FaGithub /> Sign In with Github
          </button>
        </div>
      </div>
    </div>
  );
}