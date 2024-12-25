import React from 'react'
import { GET_GOOGLE_TOKEN, LIST_COURSE } from '../services/constants'
import axios from "axios"
import Cookies from "js-cookie"
import { useAuth } from '../Context/AuthContext';

export function List_Course_Button() {
    const {classes,setClasses,accessToken}=useAuth();
    async function listCourses(){
        console.log(accessToken)
        try {
            const response = await axios.get(
                `${LIST_COURSE}?courseStates=ACTIVE`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
    
            console.log("API Response:", response.data);
            setClasses(response.data.courses)
            
        } catch (error) {
            console.error("Error making API request:", error.response?.data || error.message);
        }
    }
  return (
    <button className='text-sm bg-base-3 rounded-lg min-w-32 p-2 hover:bg-base-2' onClick={listCourses}>List Courses</button>
  )
}
export function LIST_FOLDERS_BUTTON() {
    const { classes, setFolders, accessToken } = useAuth();
  
    async function listFolders() {
      if (classes && classes.length > 0) {
        const allCourses = [];
  
        for (const cls of classes) {
          const url = `${LIST_COURSE}/${cls.id}/topics`;
  
          try {
            const response = await axios.get(url, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
  
            console.log(`API Response for class ${cls.id} (${cls.name}):`, response.data);
  
            // Check if `topic` exists and is an array
            if (Array.isArray(response.data?.topic)) {
              const limitedCourses = response.data.topic.slice(0, 3); // Limit to 3 courses
              allCourses.push(...limitedCourses);
            } else {
              console.warn(`No valid topics found for class ${cls.id} (${cls.name}).`);
            }
          } catch (error) {
            console.error(`Error making API request for class ${cls.id} (${cls.name}):`, error.response?.data || error.message);
          }
        }
  
        if (allCourses.length > 0) {
          setFolders(allCourses);
        } else {
          console.log("No content found in any class.");
        }
      } else {
        console.log("No classes found.");
      }
    }
  
    return (
      <button className="text-sm bg-base-3 rounded-lg min-w-32 p-2 hover:bg-base-2" onClick={listFolders}>
        List Folders
      </button>
    );
  }
  

export function POST_COURSE() {
    const {folders,classes,setFolders,accessToken}=useAuth();
    async function listFolders(){
        const url=`${LIST_COURSE}/${classes[0].id}/courseWork`;
        console.log(url)
        try {
            const response = await axios.post(
                url,
                {
                    "title": "DBMS",
                    "description": "This is a material for DBMS",
                    "workType": "ASSIGNMENT"
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
    
            console.log("API Response:", response.data);
            setFolders(response.data)
            
        } catch (error) {
            console.error("Error making API request:", error.response?.data || error.message);
        }
    }
  return (
    <button className='text-sm bg-base-3 rounded-lg min-w-32 p-2 hover:bg-base-2' onClick={listFolders}>POST_COURSE</button>
  )
}


export function Create_Classroom(){
    const {myFolder,setMyFolder,user,setNewClass,setMessage,setOpen,accessToken}=useAuth();

    async function listCourses(){

        console.log(accessToken)
        try {
            let result=await axios.post(LIST_COURSE,
                {
                    "ownerId":"me",
                    "name": "Askio!",
                    "section": "selfLearning",
                    "descriptionHeading": "A platform to ask and learn from notes",
                    "description": "A classroom course made via Askio to help you learn new things"
                },{headers:{
                    Authorization: `Bearer ${accessToken}`,
                }
            })
            console.log(result)
            setNewClass(result.data)
            setMessage("Askio Class Created Successfully!")
            setOpen(true)
            const classroomLink = result.data.alternateLink;
            if (classroomLink) {
                window.open(classroomLink, "_blank");
            }
        } catch (error) {
            console.log(error)
            setMessage("Askio Class not Created!")
            setOpen(true)
        }
    }
  return (
    <button className='text-sm bg-base-3 rounded-lg min-w-48 p-2 hover:bg-base-2' onClick={listCourses}>Create Askio Classroom</button>
  )
}
