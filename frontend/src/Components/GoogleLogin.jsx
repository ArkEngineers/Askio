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
      className="px-10 py-5 hover:bg-grey-6 w-full flex items-center justify-center gap-4"
      onClick={googleLogin}
    >
      <FcGoogle /> Sign in with Google
    </button>
  );
};
