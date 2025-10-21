import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { cn } from "../utils";
import EmailIcon from "../components/Icons/EmailIcon";
import LockIcon from "../components/Icons/LockIcon";
import { useState } from "react";
import HideEyeIcon from "../components/Icons/HideEyeIcon";
import EyeIcon from "../components/Icons/EyeIcon";

const LoginPasswordInput = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <LockIcon className="absolute left-3 top-4" />
      <Input
        id="password"
        name="password"
        type={showPassword ? "text" : "password"}
        required
        autoComplete="current-password"
        placeholder="Password"
        className="pl-11"
      />
      <button
        className="absolute right-3 top-4"
        onClick={() => setShowPassword((prevShowPassword) => !prevShowPassword)}
      >
        {showPassword ? <HideEyeIcon /> : <EyeIcon />}
      </button>
    </div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const onClick = () => navigate("/items");

  return (
    <div id="home-page" className="relative h-[calc(100vh_-_112px)]">
      <div className="h-full w-full bg-cover bg-center bg-[url('/images/login-bg.png')]" />
      <div
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "rounded-[5px] bg-white shadow-loginForm p-6",
          "bg-gradient-to-t from-[#E2EAF3] to-[#B6CCE2]",
        )}
      >
        {/* TODO: Move this to another file and integrate with API */}
        <form className="flex flex-col gap-6 w-72" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-2 font-dosis items-center">
            <h1 className="text-2xl font-semibold text-primaryFont">Sign in with email</h1>
            <p className="text-lg font-normal text-secondaryFont">Start on a new shopping list.</p>
          </div>
          <div className="relative">
            <EmailIcon className="absolute left-3 top-4" />
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="Email"
              className="pl-11"
            />
          </div>
          <LoginPasswordInput />
          <div className="w-full flex flex-col items-center">
            <Button className="w-full !h-12">Login</Button>
            <button className="mt-4 text-textGray text-sm">Sign in as Guest</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HomePage;
