//Import dependencies
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@chakra-ui/react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Toaster, toast } from "react-hot-toast";

export default function Register() {
  // const [data, setData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    try {
      setIsLoading(true);
      await axios.post("http://localhost:5000/accounts/register", {
        email: values.email,
        username: values.username,
        fullname: values.fullname,
        password: values.password,
      });
      toast.success("Account Registration Success!");
      setIsLoading(false);
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setIsLoading(false);
      toast.error(error?.response?.data?.message);
    }
  };

  //Validasi Formik/yup
  const RegisterSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email is not valid!")
      .required("Email is required!"),
    fullname: Yup.string()
      .min(3, "Full name minimum 3 character!")
      .required("Full name is required"),
    username: Yup.string()
      .min(3, "Username minimum 3 character!")
      .required("Username is required"),
    password: Yup.string()
      .min(8, "Password minimum 8 character")
      .required("Password is required!")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
        "Must Contain at least One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
    confirmpassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords must match"
    ),
  });

  return (
    <div className="w-screen flex flex-col items-center">
      <div className="flex flex-col p-9 gap-3 mt-3 w-[347px] h-[617px] border border-slate-300 drop-shadow-md bg-white items-center text-center justify-center">
        <h1 className="font-semibold text-5xl font-satisfy mb-2">Instgrrrm</h1>
        <p className="text-slate-500 font-semibold">
          Sign up to see photos and videos from your friends.
        </p>
        <Formik
          initialValues={{
            email: "",
            fullname: "",
            username: "",
            password: "",
            confirmpassword: "",
          }}
          validationSchema={RegisterSchema}
          onSubmit={(values) => handleRegister(values)}
        >
          {(props) => {
            return (
              <Form>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  className="border border-slate-300 bg-slate-100 rounded-sm h-9 w-full mt-3 p-2"
                />
                <ErrorMessage
                  component={"div"}
                  name="email"
                  className="text-red-500"
                />
                <Field
                  type="text"
                  name="fullname"
                  id="fullname"
                  placeholder="Full name"
                  className="border border-slate-300 bg-slate-100 rounded-sm h-9 w-full mt-3 p-2"
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
                  className="border border-slate-300 bg-slate-100 rounded-sm h-9 w-full mt-3 p-2"
                />
                <ErrorMessage
                  component={"div"}
                  name="username"
                  className="text-red-500"
                />
                <div className="relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="Password"
                    className="border border-slate-300 bg-slate-100 rounded-sm h-9 w-full mt-3 p-2"
                  />
                  <ErrorMessage
                    component={"div"}
                    name="password"
                    className="text-red-500"
                  />
                  {showPassword ? (
                    <AiOutlineEyeInvisible
                      className="absolute right-0 top-0 mt-6 mr-3"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  ) : (
                    <AiOutlineEye
                      className="absolute right-0 top-0 mt-6 mr-3"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  )}
                </div>
                <div className="relative">
                  <Field
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmpassword"
                    id="confirmpassword"
                    placeholder="Confirm password"
                    className="border border-slate-300 bg-slate-100 rounded-sm h-9 w-full mt-3 p-2"
                  />
                  <ErrorMessage
                    component={"div"}
                    name="confirmpassword"
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
                  Sign up
                </Button>
              </Form>
            );
          }}
        </Formik>
      </div>
      <div className="flex flex-col p-8 mt-3 mb-3 w-[347px] h-[67px] border border-slate-300 drop-shadow-md bg-white items-center justify-around">
        <p>
          Have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-400 active:text-blue-200 "
          >
            Log in
          </span>
        </p>
      </div>
      <Toaster />
    </div>
  );
}
