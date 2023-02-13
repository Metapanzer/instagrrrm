//Import dependencies
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@chakra-ui/react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Toaster, toast } from "react-hot-toast";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const isAuth = async () => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  };

  const handleLogin = async (values) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:5000/accounts/login?emailOrUsername=${values.emailorusername}&password=${values.password}`
      );
      console.log(response);
      localStorage.setItem("token", response?.data?.data?.token);
      localStorage.setItem("user", JSON.stringify(response?.data?.data?.user));
      toast.success(response.data.message);
      setIsLoading(false);
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setIsLoading(false);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    isAuth();
  }, []);

  //Validasi Formik/yup
  const LoginSchema = Yup.object().shape({
    emailorusername: Yup.string().required("Email or username is required!"),
    password: Yup.string()
      .min(8, "Password min 8 character")
      .required("Password is required!"),
  });

  return (
    <div className="w-screen flex flex-col items-center">
      <div className="flex flex-col p-2 gap-3 mt-3 w-[347px] h-[397px] border border-slate-300 drop-shadow-md bg-white items-center text-center justify-center">
        <h1 className="font-semibold text-5xl font-satisfy mb-2">Instgrrrm</h1>
        <Formik
          initialValues={{
            emailorusername: "",
            password: "",
          }}
          validationSchema={LoginSchema}
          onSubmit={(values) => handleLogin(values)}
        >
          {(props) => {
            return (
              <Form>
                <Field
                  type="text"
                  name="emailorusername"
                  id="emailorusername"
                  placeholder="Email or username"
                  className="border border-slate-300 bg-slate-100 rounded-sm h-9 w-full mt-3 p-2"
                />
                <ErrorMessage
                  component={"div"}
                  name="emailorusername"
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

                <Button
                  isLoading={isLoading}
                  loadingText="Submitting"
                  colorScheme="twitter"
                  type="submit"
                  className="w-full mb-3 mt-5"
                >
                  Log in
                </Button>
              </Form>
            );
          }}
        </Formik>
        <p
          onClick={() => navigate("/reset-password")}
          className="active:text-blue-200"
        >
          Forgot password?
        </p>
      </div>
      <div className="flex flex-col p-8 mt-3 mb-3 w-[347px] h-[67px] border border-slate-300 drop-shadow-md bg-white items-center justify-around">
        <p>
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-400 active:text-blue-200"
          >
            Sign Up
          </span>
        </p>
      </div>
      <Toaster />
    </div>
  );
}
