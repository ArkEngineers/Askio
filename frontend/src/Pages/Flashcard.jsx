import { Button, IconButton, Input, Option, Select } from "@material-tailwind/react";
import React, { useState } from "react";
import FlashCardList from "../Components/FlashCardList";

const flashcardsData = [
  {
    id:"1",
    question: "What is the capital of France?",
    answer: "Paris",
  },
  {
    id:"2",
    question: "What is the square root of 64?",
    answer: "8",
  },
  {
    id:"3",
    question: "Who wrote 'Romeo and Juliet'?",
    answer: "William Shakespeare",
  },
  {
    id:"4",
    question: "Who wrote 'Romeo and Juliet'?",
    answer: "William Shakespeare",
  },
  {
    id:"5",
    question: "Who wrote 'Romeo and Juliet'?",
    answer: "William Shakespeare",
  },
  {
    id:"6",
    question: "Who wrote 'Romeo and Juliet'?",
    answer: "William Shakespeare",
  },
  {
    id:"7",
    question: "Who wrote 'Romeo and Juliet'?",
    answer: "William Shakespeare",
  },

];

function Flashcards() {
  const [value, setValue] = React.useState(0);
  const [cards, setCards] = React.useState(false);
  const [flashcard, setflashcard] = useState(flashcardsData)

  return (
    <div className="pt-20">
      <h1 className="text-4xl font-bold text-center py-6">FLASHCARDS</h1>
      <nav className="flex justify-center gap-32 text-white">
        <div className="">
          <p>Topic</p>
          <Select size="md" label="Select Version" className="text-grey-1 w-full bg-grey-6">
            <Option>Random</Option>
            <Option>DBMS</Option>
            <Option>DS</Option>
            <Option>OS</Option>
            <Option>RER</Option>
          </Select>
        </div>
        <div className="">
          <p>No. of Questions</p>
          <div className="relative w-full">
            <Input
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="!border-t-blue-gray-200 text-grey-1 placeholder:text-blue-gray-300 placeholder:opacity-100  focus:!border-t-gray-900 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              containerProps={{
                className: "min-w-0",
              }}
            />
            <div className="absolute right-1 top-1 flex gap-0.5">
              <IconButton
                size="sm"
                variant="text"
                className="rounded text-white"
                onClick={() => setValue((cur) => (cur === 0 ? 0 : cur - 1))}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" />
                </svg>
              </IconButton>
              <IconButton
                size="sm"
                variant="text"
                className="rounded text-white"
                onClick={() => setValue((cur) => cur + 1)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                </svg>
              </IconButton>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <Button size="lg" color="blue" className="" onClick={()=>setCards(true)}>Generate</Button>

        </div>
      </nav>
      {cards&&<FlashCardList flashcard={flashcard}/>}
    </div>
  );
}

export default Flashcards;
