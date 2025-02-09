import React, { useEffect, useState } from "react";
import FolderCard from "../Components/FolderCard";
import { FaBook, FaFolder, FaQuestionCircle, FaUpload } from "react-icons/fa";
import QuizCard from "../Components/QuizCard";
import Slider from "react-slick";
import {
  IoIosArrowDropleft,
  IoIosArrowDropright,
  IoIosArrowForward,
} from "react-icons/io";
import ClassCard from "../Components/ClassCard";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import { AUTH_ROUTE, UPDATE_ASKIO_CLASS } from "../services/constants";
import { Create_Classroom, List_Course_Button, LIST_FOLDERS_BUTTON, POST_COURSE } from "../Components/APIButtons";

const folderSettings = {
  infinite: false,
  speed: 500,
  slidesToShow: 7,
  slidesToScroll: 1,
  nextArrow: <IoIosArrowDropright color="gray" opacity={0.3} />,
  prevArrow: <IoIosArrowDropleft color="gray" opacity={0.3} />,
  responsive: [
    {
      breakpoint: 1440, // Extra large screens (desktop)
      settings: {
        slidesToShow: 6,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 1024, // Large screens
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 800, // Medium screens (tablet)
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480, // Small screens (mobile)
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
};
const quizSettings = {
  infinite: false,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  nextArrow: <IoIosArrowDropright color="gray" opacity={0.3} />,
  prevArrow: <IoIosArrowDropleft color="gray" opacity={0.3} />,
  responsive: [
    {
      breakpoint: 1440, // Extra large screens (desktop)
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 1024, // Large screens
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 800, // Medium screens (tablet)
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480, // Small screens (mobile)
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

function Home() {
  const { user,newClass,setupUser ,classes,folders,setFolders} = useAuth();
  const [allclasses, setAllclasses] = useState(null);

  const fetchAllClasses = async () => {
    try {
      const response = await axios.get(
        `${AUTH_ROUTE}/group/user/${user?.email}/groups`
      );
      console.log(response.data);
      if (response.status === 200) setAllclasses(response.data);
    } catch (error) {
      console.log({ error });
    }
  };
  useEffect(()=>{
    if(newClass!=null){
      axios.post(UPDATE_ASKIO_CLASS,{
        "email":user?.email,
        "groupId":newClass?.id
      })
      .then(res=>{
        console.log(res.data)
        setupUser(res.data.data)
      })
      .catch(err=>{
        console.log(err)
      })
    }
    
  },[newClass])
  

  useEffect(() => {
    fetchAllClasses();
    console.log(user)
  }, []);
  return (
    <div className="px-20 pl-40 pt-20">
      <h2 className="text-3xl py-10 text-center font-semibold text-base-1">
        Hello, {user?.name}
      </h2>

      <div className="flex flex-col items-center justify-center pb-10">
        <div className="flex flex-col gap-y-4 w-full">
          <div className="px-4 flex gap-x-2 items-center w-full">
            <FaFolder className="text-grey-1" />
            <p className="text-xs text-grey-1 w-full text-left font-bold">
              Your Folders
            </p>
            {user?.groupAdded?<LIST_FOLDERS_BUTTON/>:<Create_Classroom/>}
            {/* <POST_COURSE/> */}
          </div>
          <div className="flex w-full items-center justify-center">
            {folders.length>0?<Slider {...folderSettings} className="w-full">
              {folders.length!=0 &&folders.map((folder, index) => (
                <FolderCard
                  key={index}
                  title={folder.name}
                  topicId={folder.topicId}
                  courseId={folder.courseId}
                  date={folder.updateTime}
                />
              ))}
            </Slider>:<p className="text-sm text-grey-1 text-center ">No Folders Found</p>}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center py-10">
        <div className="flex flex-col gap-y-4 w-full">
          <div className="px-4 flex gap-x-2 items-center w-full">
            <FaBook className="text-grey-1" />
            <p className="text-xs text-grey-1 w-full text-left font-semibold">
              Joined Classes
            </p>
          <List_Course_Button/>
          </div>
          <div className="flex w-full items-center justify-center">
            {classes.length>0?<Slider {...quizSettings} className="w-full">
              {classes.length!=0 &&
                classes.map((classData, index) => (
                  <ClassCard
                    key={classData.id}
                    title={classData.name}
                    section={classData.section}
                    ownerId={classData.ownerId}
                    descriptionHeading={classData.descriptionHeading}
                    alternateLink={classData.alternateLink}
                    date={classData.creationTime}
                    classId={classData?._id}
                  />
                ))}
            </Slider>:<p className="text-sm text-grey-1 text-center ">No Classes Found</p>}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center py-10">
        <div className="flex flex-col gap-y-4 w-full">
          <div className="px-4 flex gap-x-2 items-center w-full">
            <FaQuestionCircle className="text-grey-1" />
            <p className="text-xs text-grey-1 w-full font-semibold text-left">
              Upcoming Quizzes
            </p>
          </div>
          <div className="flex w-full items-center">
            <Slider {...quizSettings} className="w-full">
              {[
                { title: "Maths Unit 1 Quiz", date: "22 Nov" },
                { title: "Physics Chapter 1 Test", date: "25 Nov" },
                { title: "Chemistry Unit 2 Prep", date: "1 Dec" },
                { title: "Biology Chapter 3 Exam", date: "3 Dec" },
                { title: "Computer Science Module 1", date: "5 Dec" },
                { title: "History Unit 4 Quiz", date: "8 Dec" },
              ].map((quiz, index) => (
                <QuizCard key={index} title={quiz.title} date={quiz.date} />
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
