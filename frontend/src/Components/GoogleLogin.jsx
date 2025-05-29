import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../services/api";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../Context/AuthContext";

export default (props) => {
  const { setupUser, setAccessToken, setToken } = useAuth();
  const SCOPES = [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive.metadata",
    "https://www.googleapis.com/auth/drive.metadata.readonly",
    "https://www.googleapis.com/auth/drive.readonly",
  ];
  const responseGoogle = async (authResult) => {
    try {
      if (authResult.code) {
        const result = await googleAuth(authResult.code);
        setAccessToken(result.data.data.accessToken);
        setToken(result.data.data.tokens);
        setupUser(result.data.data.user);

        localStorage.setItem("accessToken", result.data.data.accessToken);
        localStorage.setItem("tokens", JSON.stringify(result.data.data.tokens));
        localStorage.setItem("user", JSON.stringify(result.data.data.user));
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
    scope: SCOPES.join(" "),
  });

  return (
    <button
      className="px-6 py-5 bg-grey-6 w-60 hover:bg-grey-7 text-white flex items-center justify-center gap-4 rounded-md"
      onClick={googleLogin}
    >
      <FcGoogle /> Sign in with Google
    </button>
  );
};
