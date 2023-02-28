import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Button, Avatar } from "@chakra-ui/react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast, Toaster } from "react-hot-toast";
import ProfilePictureModal from "../components/profilePictureModal";

export default function EditProfile() {
  const [profile, setProfile] = useState([]);
  const [disableVerify, setDisableVerify] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const isAuth = async () => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      getProfile();
    }
  };

  const getProfile = async () => {
    try {
      const username = JSON.parse(localStorage.getItem("user")).username;
      const response = await axios.get(
        `http://localhost:5000/accounts/profile/${username}`
      );
      setProfile(response?.data?.data?.user);
      localStorage.setItem("user", JSON.stringify(response?.data?.data?.user));
    } catch (error) {
      console.log(error);
    }
  };

  const verifyEmail = async () => {
    try {
      setDisableVerify(true);
      let token = localStorage.getItem("token");
      console.log("verify email");
      await axios.get("http://localhost:5000/accounts/verify/sent", {
        headers: { Authorization: token },
      });
      setTimeout(() => setDisableVerify(false), 300000); //enable verify email button in 5 minutes
      toast.success(
        "Email verification link sent, you can send another email in 5 minutes"
      );
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const closeModal = () => {
    setOpenModal(false);
    getProfile();
  };

  const editProfile = async (values) => {
    try {
      setIsLoading(true);
      let token = localStorage.getItem("token");
      console.log(values);
      await axios.patch(
        `http://localhost:5000/accounts/edit/profile`,
        {
          fullname: values.fullName,
          username: values.username,
          bio: values.bio,
        },
        {
          headers: { Authorization: token },
        }
      );
      toast.success("Profile updated!");
      setIsLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setIsLoading(false);
    }
  };

  const editPassword = async (values) => {
    try {
      setIsLoading(true);
      let token = localStorage.getItem("token");
      console.log(values);
      await axios.patch(
        `http://localhost:5000/accounts/edit/password`,
        {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        },
        {
          headers: { Authorization: token },
        }
      );
      toast.success("Password updated!");
      setIsLoading(false);
      setTimeout(() => handleLogout(), 3000);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    isAuth();
  }, []);

  //Validasi Formik/yup
  const EditProfileSchema = Yup.object().shape({
    fullName: Yup.string()
      .min(3, "Full name minimum 3 character!")
      .required("Full name is required"),
    bio: Yup.string().max(150, "Maximum 150 character!"),
    username: Yup.string()
      .min(3, "Username minimum 3 character!")
      .required("Username is required"),
    email: Yup.string()
      .email("Email is not valid!")
      .required("Email is required!"),
  });

  const EditPasswordSchema = Yup.object().shape({
    oldPassword: Yup.string()
      .min(8, "Password min 8 character")
      .required("Password is required!"),
    newPassword: Yup.string()
      .notOneOf(
        [Yup.ref("oldPassword"), null],
        "Password can't be the same as the old password"
      )
      .min(8, "Password minimum 8 character")
      .required("Password is required!")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
        "Must Contain at least One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("newPassword"), null],
      "Passwords must match"
    ),
  });

  return (
    <div className="w-5/6 h-screen flex justify-center items-center overflow-auto">
      <div className="w-4/6 h-auto m-6 p-4 border drop-shadow-md border-slate-300 flex flex-col gap-4 items-center">
        <div className="flex items-center mt-4">
          <Avatar
            onClick={() => navigate(`/profile/${profile.username}`)}
            name={profile.username}
            showBorder="true"
            borderColor="blue.500"
            src={
              profile.profile_picture
                ? `http://localhost:5000/${profile.profile_picture}`
                : null
            }
          />
          <div className="flex flex-col">
            <span className="font-bold ml-3 active:text-slate-400">
              {profile.username}
            </span>
            <span
              onClick={() => setOpenModal(true)}
              className="text-blue-400 active:text-blue-200 ml-3"
            >
              Change profile photo
            </span>
            {openModal ? <ProfilePictureModal onExit={closeModal} /> : <></>}
          </div>
        </div>
        <Formik
          enableReinitialize={true}
          initialValues={{
            fullName: profile?.fullname || "",
            bio: profile?.bio || "",
            username: profile?.username || "",
            email: profile?.email || "",
          }}
          validationSchema={EditProfileSchema}
          onSubmit={(values) => editProfile(values)}
        >
          {(props) => {
            // console.log(props);
            return (
              <Form className="w-5/6">
                <div className="flex justify-between items-center gap-4">
                  <label htmlFor="fullName" className="mt-3 font-semibold">
                    Fullname
                  </label>
                  <Field
                    type="text"
                    name="fullName"
                    id="fullName"
                    placeholder="Full name"
                    className="border border-slate-300 bg-white rounded-sm h-9 w-4/6 mt-3 p-2"
                  />
                </div>
                <ErrorMessage
                  component="div"
                  name="fullName"
                  className="text-red-500"
                />
                <div className="flex justify-between items-center gap-4">
                  <label htmlFor="username" className="mt-3 font-semibold">
                    Username
                  </label>
                  <Field
                    // onBlur={(event)=>checkUsername(event.target.value)}
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Username"
                    className="border border-slate-300 bg-white rounded-sm h-9 w-4/6 mt-3 p-2"
                  />
                </div>
                <ErrorMessage
                  component="div"
                  name="username"
                  className="text-red-500"
                />
                <div className="flex justify-between items-center gap-4">
                  <label htmlFor="bio" className="mt-3 font-semibold">
                    Bio
                  </label>
                  <Field name="bio">
                    {({ field, form }) => (
                      <>
                        <textarea
                          {...field}
                          cols="50"
                          rows="2"
                          maxLength={150}
                          className="border border-slate-300 bg-white rounded-sm w-4/6 mt-3 p-2 resize-none"
                        />
                      </>
                    )}
                  </Field>
                </div>
                <ErrorMessage
                  name="bio"
                  component="div"
                  className="text-red-500"
                />
                <div className="flex justify-between items-center gap-4">
                  <label htmlFor="email" className="mt-3 font-semibold">
                    Email
                  </label>
                  <Field
                    disabled={true}
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                    className="border border-slate-300 bg-slate-200 rounded-sm h-9 w-4/6 mt-3 p-2"
                  />
                </div>
                <ErrorMessage
                  component="div"
                  name="email"
                  className="text-red-500"
                />
                <p className="text-xs text-slate-400 my-3">
                  Changing your email address is not available, please contact
                  customer support to change your email address.
                </p>
                {profile.is_verified ? (
                  <></>
                ) : (
                  <Button
                    onClick={() => verifyEmail()}
                    isLoading={disableVerify}
                    spinner="Email sent"
                    colorScheme="twitter"
                    type="button"
                    className="w-full mb-3 mt-3"
                  >
                    Verify email
                  </Button>
                )}

                <Button
                  isLoading={isLoading}
                  loadingText="Submitting"
                  colorScheme="twitter"
                  type="submit"
                  className="w-full mb-3"
                >
                  Save profile
                </Button>
              </Form>
            );
          }}
        </Formik>
        <Formik
          enableReinitialize={true}
          initialValues={{
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={EditPasswordSchema}
          onSubmit={(values) => editPassword(values)}
        >
          {(props) => {
            // console.log(props);
            return (
              <Form className="w-5/6">
                <div className="relative flex justify-between gap-4">
                  <label htmlFor="email" className="mt-3 font-semibold">
                    Old password
                  </label>
                  <Field
                    type={showOldPassword ? "text" : "password"}
                    name="oldPassword"
                    id="oldPassword"
                    placeholder="Old password"
                    className="border border-slate-300 bg-white rounded-sm h-9 w-4/6 mt-3 p-2"
                  />

                  {showOldPassword ? (
                    <AiOutlineEyeInvisible
                      className="absolute right-0 top-0 mt-6 mr-3"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    />
                  ) : (
                    <AiOutlineEye
                      className="absolute right-0 top-0 mt-6 mr-3"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    />
                  )}
                </div>
                <ErrorMessage
                  component="div"
                  name="oldPassword"
                  className="text-red-500"
                />
                <div className="relative flex justify-between gap-4">
                  <label htmlFor="email" className="mt-3 font-semibold">
                    New password
                  </label>
                  <Field
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    id="newPassword"
                    placeholder="New password"
                    className="border border-slate-300 bg-white rounded-sm h-9 w-4/6  mt-3 p-2"
                  />

                  {showNewPassword ? (
                    <AiOutlineEyeInvisible
                      className="absolute right-0 top-0 mt-6 mr-3"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    />
                  ) : (
                    <AiOutlineEye
                      className="absolute right-0 top-0 mt-6 mr-3"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    />
                  )}
                </div>
                <ErrorMessage
                  component="div"
                  name="newPassword"
                  className="text-red-500"
                />
                <div className="relative flex justify-between gap-4">
                  <label htmlFor="email" className="mt-3 font-semibold">
                    Confirm password
                  </label>
                  <Field
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="Confirm password"
                    className="border border-slate-300 bg-white rounded-sm h-9 w-4/6  mt-3 p-2"
                  />

                  {showConfirmPassword ? (
                    <AiOutlineEyeInvisible
                      className="absolute right-0 top-0 mt-6 mr-3"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    />
                  ) : (
                    <AiOutlineEye
                      className="absolute right-0 top-0 mt-6 mr-3"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    />
                  )}
                </div>
                <ErrorMessage
                  component="div"
                  name="confirmPassword"
                  className="text-red-500"
                />
                <Button
                  isLoading={isLoading}
                  loadingText="Submitting"
                  colorScheme="twitter"
                  type="submit"
                  className="w-full mb-3 mt-3"
                >
                  Save password
                </Button>
              </Form>
            );
          }}
        </Formik>
      </div>
      <Toaster />
    </div>
  );
}
