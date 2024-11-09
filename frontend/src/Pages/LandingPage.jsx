import React, { useEffect, useState } from "react";
import GoogleLogin from "../Components/GoogleLogin";
import { Button } from "@material-tailwind/react";
// import GoogleLogin from "./components/GoogleLogin";

function LandingPage() {
  const [user, setUser] = useState();
  return (
    <div>
      <GoogleLogin setUser={setUser}></GoogleLogin>
      {user && user.name}
      {user && user.email}
      <Button>Button</Button>
    </div>
  );
}

export default LandingPage;
