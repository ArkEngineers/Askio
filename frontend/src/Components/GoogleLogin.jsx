import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../services/api";
import { FcGoogle } from "react-icons/fc";
export default (props) => {
  const responseGoogle = async (authResult) => {
    try {
      if (authResult.code) {
        console.log(authResult.code);
        const result = await googleAuth(authResult.code);
        console.log(result);

        props.setUser(result.data.data.user);
        alert("successfuly logged in");
      } else {
        console.log(authResult);
        throw new Error(authResult);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <button
      className="px-10 py-5 hover:bg-grey-6 w-full flex items-center justify-center gap-4"
      onClick={googleLogin}
    >
      <FcGoogle/> Sign in with Google
    </button>
  );
};
