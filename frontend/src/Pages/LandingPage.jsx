import React, { useEffect, useState } from "react";
import GoogleLogin from "../Components/GoogleLogin";
// import GoogleLogin from "./components/GoogleLogin";

function LandingPage() {
  const [user, setUser] = useState();
  return (
    <div>
      <GoogleLogin setUser={setUser}></GoogleLogin>
      {user && user.name}
      {user && user.email}
    </div>
  );
}

export default LandingPage;
