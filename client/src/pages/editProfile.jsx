import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Button } from "@chakra-ui/react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function EditProfile() {
  const [profile, setProfile] = useState([]);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const isAuth = async () => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  };

  const getProfile = async () => {
    try {
      const username = JSON.parse(localStorage.getItem("user")).username;
      const response = await axios.get(
        `http://localhost:5000/accounts/profile/${username}`
      );
      setProfile(response?.data?.data?.user);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    isAuth();
    getProfile();
  }, []);

  //Validasi Formik/yup
  const EditProfileSchema = Yup.object().shape({
    fullName: Yup.string()
      .min(3, "Full name minimum 3 character!")
      .required("Full name is required"),
    bio: Yup.string(),
    username: Yup.string()
      .min(3, "Username minimum 3 character!")
      .required("Username is required"),
    email: Yup.string()
      .email("Email is not valid!")
      .required("Email is required!"),
    oldPassword: Yup.string()
      .min(8, "Password min 8 character")
      .required("Password is required!"),
    newPassword: Yup.string()
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
    <div className="w-5/6 h-screen flex justify-center items-center">
      <div className="w-4/6 h-5/6 m-8 p-4 border drop-shadow-md border-slate-300 flex flex-col gap-4 items-center">
        <Formik
          enableReinitialize={true}
          initialValues={{
            fullName: profile.fullname,
            bio: profile.bio,
            username: profile.username,
            email: profile.email,
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={EditProfileSchema}
          onSubmit={(values) => /*handleEdit*/ values}
        >
          {(props) => {
            console.log(props);
            return (
              <Form>
                <Field
                  type="text"
                  name="fullname"
                  id="fullname"
                  placeholder="Full name"
                  className="border border-slate-300 bg-white rounded-sm h-9 w-full mt-3 p-2"
                />
                <ErrorMessage
                  component={"div"}
                  name="fullname"
                  className="text-red-500"
                />
                <Field
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Username"
                  className="border border-slate-300 bg-white rounded-sm h-9 w-full mt-3 p-2"
                />
                <ErrorMessage
                  component={"div"}
                  name="username"
                  className="text-red-500"
                />
                <Field
                  disabled={true}
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  value={profile.email}
                  className="border border-slate-300 bg-slate-200 rounded-sm h-9 w-full mt-3 p-2"
                />
                <ErrorMessage
                  component={"div"}
                  name="email"
                  className="text-red-500"
                />

                <div className="relative">
                  <Field
                    type={showOldPassword ? "text" : "password"}
                    name="oldPassword"
                    id="oldPassword"
                    placeholder="Old password"
                    className="border border-slate-300 bg-white rounded-sm h-9 w-full mt-3 p-2"
                  />
                  <ErrorMessage
                    component={"div"}
                    name="oldPassword"
                    className="text-red-500"
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
                <div className="relative">
                  <Field
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    id="newPassword"
                    placeholder="New password"
                    className="border border-slate-300 bg-white rounded-sm h-9 w-full mt-3 p-2"
                  />
                  <ErrorMessage
                    component={"div"}
                    name="newPassword"
                    className="text-red-500"
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
                <div className="relative">
                  <Field
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="Confirm password"
                    className="border border-slate-300 bg-white rounded-sm h-9 w-full mt-3 p-2"
                  />
                  <ErrorMessage
                    component={"div"}
                    name="confirmPassword"
                    className="text-red-500"
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
                <p className="text-xs text-slate-400 mt-3">
                  People who use our service may have uploaded your contact
                  information to Instagrrrm.
                </p>
                <p className="text-xs text-slate-400 mt-3 mb-3">
                  By signing up, you agree to our Terms ,Privacy Policy and
                  Cookies Policy.
                </p>
                <Button
                  isLoading={isLoading}
                  loadingText="Submitting"
                  colorScheme="twitter"
                  type="submit"
                  className="w-full mb-3"
                >
                  Submit
                </Button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}
