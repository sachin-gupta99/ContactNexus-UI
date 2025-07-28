import { useRef } from "react";
import { HiMail } from "react-icons/hi";
import { RiLockPasswordFill } from "react-icons/ri";
import { Button, Label, TextInput, Checkbox } from "flowbite-react";
import { loginRoute } from "../api/authApi";
import { setAuthToken } from "../util/helper";
import { router } from "../App";
import { useDispatch } from "react-redux";
import { toastActions } from "../store/toast";
import { userActions } from "../store/user";

const SignInForm = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      dispatch(
        toastActions.setToast({
          message: "Signing in...",
          type: "info",
        })
      );

      const email = emailRef.current.value;
      const password = passwordRef.current.value;

      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const response = await loginRoute(formData);
    
      if (response?.data?.data?.token) {
        setAuthToken(response?.data?.data?.token);
        router.navigate("/home");
        dispatch(
          toastActions.setToast({
            message: "Successfully logged in",
            type: "success",
          })
        );
        dispatch(userActions.setUser(response?.data?.data));
      } else {
        dispatch(
          toastActions.setToast({
            message: "Something went wrong",
            type: "error",
          })
        );
        emailRef.current.value = "";
        passwordRef.current.value = "";
      }
    } catch (error) {
      dispatch(
        toastActions.setToast({ message: "Invalid credentials", type: "error" })
      );
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Welcome back
        </h2>
        <p className="text-gray-600">Sign in to your account to continue</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email" value="Email address" className="text-gray-700 font-medium" />
          </div>
          <TextInput
            ref={emailRef}
            id="email"
            type="email"
            icon={HiMail}
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="password" value="Password" className="text-gray-700 font-medium" />
          </div>
          <TextInput
            ref={passwordRef}
            id="password"
            type="password"
            icon={RiLockPasswordFill}
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember" className="text-sm text-gray-600">
              Remember me
            </Label>
          </div>
          <a href="#" className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200">
            Forgot your password?
          </a>
        </div>

        <Button 
          type="submit" 
          gradientDuoTone="purpleToBlue" 
          className="w-full font-semibold"
          size="lg"
        >
          Sign in
        </Button>
      </form>
    </div>
  );
};

export default SignInForm;
