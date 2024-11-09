import React, { useEffect, useState } from "react";
import GoogleLogin from "../Components/GoogleLogin";
import { Button, Card } from "@material-tailwind/react";
import { FaGithub } from "react-icons/fa";

function LandingPage() {
  const [user, setUser] = useState();
  return (
    <div className="bg-grey-9 h-screen text-base-1 grid place-items-center">
      <Card color="gray" className="w-1/5 py-10 grid place-items-center gap-2 shadow-md shadow-grey-6">
        <h1 className="font-bold text-3xl ">Askio</h1>
        <p className="text-center text-base-2">Empower knowledge , Anytime , Anywhere</p>
        <GoogleLogin setUser={setUser} className></GoogleLogin>
        {/* {user && user.name}
        {user && user.email} */}
        <button className="w-full px-10 bg-grey-7 opacity-50 py-5 flex items-center justify-center gap-4" disabled={true}><FaGithub/>Sign In with Github</button>
        <button className="w-full px-10 bg-grey-7 opacity-50 py-5 flex items-center justify-center gap-4" disabled={true}><FaGithub/>Sign In with Github</button>
        <button className="w-full px-10 bg-grey-7 opacity-50 py-5 flex items-center justify-center gap-4" disabled={true}><FaGithub/>Sign In with Github</button>
      </Card>
    </div>
  );
}

export default LandingPage;
