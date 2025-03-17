import React from "react";
import SuggestionCards from "../components/Main/SuggestionCards";
import { GoogleLogin } from "@react-oauth/google";
import { useUserContext } from "../store/user-context";

const LoginPage = () => {
  const { setUser } = useUserContext();
  const handleLoginSuccess = (googleResponse) => {
    const googleToken = googleResponse.credential;
    setUser(googleResponse.credential);
  };

  const handleLoginError = () => {};

  return (
    <div>
      <div className="mx-auto container flex flex-col gap-10 items-center justify-center h-screen w-screen">
        <div className="flex flex-col items-center">
          <h1 className="text-9xl font-medium bg-clip-text bg-gradient-to-r from-blue-500 to bg-purple-500 text-transparent">
            Askio
          </h1>
          <p className="text-lg">
            An AI powered education partner that you can trust.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center w-2/3">
          <h2>What's in it for you?</h2>
          <SuggestionCards />
        </div>
        <div>
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
            theme="filled_blue"
            useOneTap
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
