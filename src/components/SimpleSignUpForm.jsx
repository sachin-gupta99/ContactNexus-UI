import { useRef } from "react";
import { Link } from "react-router-dom";
import { HiMail, HiUser } from "react-icons/hi";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaPhoneAlt, FaStreetView, FaCity, FaGithub, FaLinkedin, FaInstagramSquare } from "react-icons/fa";
import { TiChartArea } from "react-icons/ti";
import { BiWorld } from "react-icons/bi";
import { TbMapPinCode } from "react-icons/tb";
import { MdMovie, MdInterests, MdWork } from "react-icons/md";
import { BsPersonBadgeFill } from "react-icons/bs";
import { TbFileDescription } from "react-icons/tb";
import { Button, Label, TextInput, Checkbox, Textarea, FileInput } from "flowbite-react";
import ImagePicker from "./ImagePicker";
import { registerRoute, signUpRoute } from "../api/authApi";
import { setAuthToken } from "../util/helper";
import { router } from "../App";
import { useDispatch } from "react-redux";
import { toastActions } from "../store/toast";
import { userActions } from "../store/user";

const SimpleSignUpForm = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const workRef = useRef();
  const phoneRef = useRef();
  const streetRef = useRef();
  const areaRef = useRef();
  const cityRef = useRef();
  const stateRef = useRef();
  const pincodeRef = useRef();
  const githubRef = useRef();
  const linkedinRef = useRef();
  const instagramRef = useRef();
  const likesRef = useRef();
  const movieRef = useRef();
  const interestsRef = useRef();
  const imageRef = useRef();
  const bioHeadingRef = useRef();
  const bioDescRef = useRef();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      dispatch(
        toastActions.setToast({
          message: "Creating your account...",
          type: "info",
        })
      );

      const name = nameRef.current?.value;
      const email = emailRef.current?.value;
      const password = passwordRef.current?.value;
      const confirmPassword = confirmPasswordRef.current?.value;
      const work = workRef.current?.value;
      const phone = phoneRef.current?.value;
      const street = streetRef.current?.value;
      const area = areaRef.current?.value;
      const city = cityRef.current?.value;
      const state = stateRef.current?.value;
      const pincode = pincodeRef.current?.value;
      const github = githubRef.current?.value;
      const linkedin = linkedinRef.current?.value;
      const instagram = instagramRef.current?.value;
      const likes = likesRef.current?.value;
      const movie = movieRef.current?.value;
      const interests = interestsRef.current?.value;
      const image = imageRef.current?.files[0];
      const bioHeading = bioHeadingRef.current?.value;
      const bioDesc = bioDescRef.current?.value;

      // Validation
      if (!name || !email || !password || !confirmPassword || !work || !phone) {
        dispatch(
          toastActions.setToast({
            message: "Please fill all required fields in Personal Details",
            type: "error",
          })
        );
        return;
      }

      if (!email.includes("@")) {
        dispatch(
          toastActions.setToast({
            message: "Invalid email address",
            type: "error",
          })
        );
        return;
      }

      if (password !== confirmPassword) {
        dispatch(
          toastActions.setToast({
            message: "Passwords do not match",
            type: "error",
          })
        );
        return;
      }

      if (password.length < 8) {
        dispatch(
          toastActions.setToast({
            message: "Password must be at least 8 characters long",
            type: "error",
          })
        );
        return;
      }

      if (!street || !area || !city || !state || !pincode) {
        dispatch(
          toastActions.setToast({
            message: "Please fill all address fields",
            type: "error",
          })
        );
        return;
      }

      if (pincode.length !== 6) {
        dispatch(
          toastActions.setToast({
            message: "Invalid pincode",
            type: "error",
          })
        );
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("work", work);
      formData.append("phone", phone);
      formData.append("street", street);
      formData.append("area", area);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("pincode", pincode);
      formData.append("github", github);
      formData.append("linkedin", linkedin);
      formData.append("instagram", instagram);
      formData.append("likes", likes);
      formData.append("movie", movie);
      formData.append("interests", interests);
      formData.append("bio_heading", bioHeading);
      formData.append("bio_desc", bioDesc);
      if (image) {
        formData.append("imageFile", image);
      }

      const response = await signUpRoute(formData);

      if (response?.data?.data?.token) {
        setAuthToken(response?.data?.data?.token);
        router.navigate("/home");
        dispatch(
          toastActions.setToast({
            message: "Account created successfully",
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
        nameRef.current.value = "";
        emailRef.current.value = "";
        passwordRef.current.value = "";
        confirmPasswordRef.current.value = "";
      }
    } catch (error) {
      dispatch(
        toastActions.setToast({
          message: "Failed to create account",
          type: "error",
        })
      );
      
      // Clear all form fields on error
      nameRef.current.value = "";
      emailRef.current.value = "";
      passwordRef.current.value = "";
      confirmPasswordRef.current.value = "";
      workRef.current.value = "";
      phoneRef.current.value = "";
      streetRef.current.value = "";
      areaRef.current.value = "";
      cityRef.current.value = "";
      stateRef.current.value = "";
      pincodeRef.current.value = "";
      githubRef.current.value = "";
      linkedinRef.current.value = "";
      instagramRef.current.value = "";
      likesRef.current.value = "";
      movieRef.current.value = "";
      interestsRef.current.value = "";
      bioHeadingRef.current.value = "";
      bioDescRef.current.value = "";
      if (imageRef.current) imageRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Create your account
        </h2>
        <p className="text-slate-300 text-md">Join Contact Nexus and start managing your contacts</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-cyan-400 border-b border-slate-600 pb-2">Personal Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Full name *" className="text-zinc-200" />
              </div>
              <TextInput
                ref={nameRef}
                id="name"
                type="text"
                icon={HiUser}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Email address *" className="text-zinc-200" />
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Password *" className="text-zinc-200" />
              </div>
              <TextInput
                ref={passwordRef}
                id="password"
                type="password"
                icon={RiLockPasswordFill}
                placeholder="Create a password (min 8 characters)"
                required
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="confirmPassword" value="Confirm Password *" className="text-zinc-200" />
              </div>
              <TextInput
                ref={confirmPasswordRef}
                id="confirmPassword"
                type="password"
                icon={RiLockPasswordFill}
                placeholder="Confirm your password"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="work" value="Work/Profession *" className="text-zinc-200" />
              </div>
              <TextInput
                ref={workRef}
                id="work"
                type="text"
                icon={MdWork}
                placeholder="Student, Software Engineer, etc."
                required
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="phone" value="Phone Number *" className="text-zinc-200" />
              </div>
              <TextInput
                ref={phoneRef}
                id="phone"
                type="tel"
                icon={FaPhoneAlt}
                placeholder="1234567890"
                required
              />
            </div>
          </div>
        </div>

        {/* Address Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-cyan-400 border-b border-slate-600 pb-2">Address Details</h3>
          
          <div>
            <div className="mb-2 block">
              <Label htmlFor="street" value="House/Flat No., Street Name *" className="text-zinc-200" />
            </div>
            <TextInput
              ref={streetRef}
              id="street"
              type="text"
              icon={FaStreetView}
              placeholder="Address Line 1"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="area" value="Area *" className="text-zinc-200" />
              </div>
              <TextInput
                ref={areaRef}
                id="area"
                type="text"
                icon={TiChartArea}
                placeholder="Area"
                required
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="city" value="City *" className="text-zinc-200" />
              </div>
              <TextInput
                ref={cityRef}
                id="city"
                type="text"
                icon={FaCity}
                placeholder="City"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="state" value="State *" className="text-zinc-200" />
              </div>
              <TextInput
                ref={stateRef}
                id="state"
                type="text"
                icon={BiWorld}
                placeholder="State"
                required
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="pincode" value="Pincode *" className="text-zinc-200" />
              </div>
              <TextInput
                ref={pincodeRef}
                id="pincode"
                type="text"
                icon={TbMapPinCode}
                placeholder="123456"
                required
              />
            </div>
          </div>
        </div>

        {/* Social Media & Interests Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-cyan-400 border-b border-slate-600 pb-2">Social Media & Interests</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="github" value="GitHub Profile" className="text-zinc-200" />
              </div>
              <TextInput
                ref={githubRef}
                id="github"
                type="text"
                icon={FaGithub}
                placeholder="GitHub username or URL"
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="linkedin" value="LinkedIn Profile" className="text-zinc-200" />
              </div>
              <TextInput
                ref={linkedinRef}
                id="linkedin"
                type="text"
                icon={FaLinkedin}
                placeholder="LinkedIn profile URL"
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="instagram" value="Instagram Handle" className="text-zinc-200" />
              </div>
              <TextInput
                ref={instagramRef}
                id="instagram"
                type="text"
                icon={FaInstagramSquare}
                placeholder="Instagram username"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="likes" value="Likes/Hobbies" className="text-zinc-200" />
              </div>
              <TextInput
                ref={likesRef}
                id="likes"
                type="text"
                icon={BsPersonBadgeFill}
                placeholder="What do you like?"
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="movie" value="Favorite Movies" className="text-zinc-200" />
              </div>
              <TextInput
                ref={movieRef}
                id="movie"
                type="text"
                icon={MdMovie}
                placeholder="Favorite movies"
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="interests" value="Interests" className="text-zinc-200" />
              </div>
              <TextInput
                ref={interestsRef}
                id="interests"
                type="text"
                icon={MdInterests}
                placeholder="Your interests"
              />
            </div>
          </div>
        </div>

        {/* Profile & Bio Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-cyan-400 border-b border-slate-600 pb-2">Profile & Bio</h3>
          
          <div>
            <ImagePicker
              label="Profile Image"
              name="image"
              ref={imageRef}
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="bioHeading" value="Bio Heading" className="text-zinc-200" />
            </div>
            <TextInput
              ref={bioHeadingRef}
              id="bioHeading"
              type="text"
              icon={BsPersonBadgeFill}
              placeholder="A catchy bio heading"
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="bioDesc" value="Bio Description" className="text-zinc-200" />
            </div>
            <Textarea
              ref={bioDescRef}
              id="bioDesc"
              placeholder="Tell us about yourself..."
              rows={4}
              className="resize-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="terms" required />
          <Label htmlFor="terms" className="text-sm text-zinc-200" >
            I agree to the{" "}
            <a href="#" className="text-cyan-600 hover:underline dark:text-cyan-500">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-cyan-600 hover:underline dark:text-cyan-500">
              Privacy Policy
            </a>
          </Label>
        </div>

        <Button 
          type="submit" 
          gradientDuoTone="cyanToBlue" 
          className="w-full font-semibold"
          size="lg"
        >
          Create account
        </Button>
      </form>
    </div>
  );
};

export default SimpleSignUpForm;
