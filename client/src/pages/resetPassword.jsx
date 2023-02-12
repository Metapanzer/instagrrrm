//Import dependencies
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@chakra-ui/react";
import EmailResetModal from "../components/emailResetModal";
import { TfiLock } from "react-icons/tfi";

export default function ResetPassword() {
  const [inputDisabled, setInputDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (values) => {
    try {
      setInputDisabled(true);
      setOpenModal(true);
      setIsLoading(true);
      // const response = await axios.get(
      //   `http://localhost:5000/accounts/login?emailOrUsername=${values.emailorusername}&password=${values.password}`
      // );
      // console.log(response);
      // localStorage.setItem("token", response?.data?.data?.token);
      // toast.success(response.data.message);
      setIsLoading(false);
      // setTimeout(() => navigate("/"), 3000);
    } catch (error) {
      // setIsLoading(false);
      // console.log(error.response.data.message);
      // toast.error(error?.response?.data?.message);
    }
  };

  //Validasi Formik/yup
  const ResetSchema = Yup.object().shape({
    emailorusername: Yup.string().required("Email or username is required!"),
  });

  return (
    <div className="w-screen flex flex-col items-center">
      <div className="flex flex-col p-8 gap-3 mt-3 w-[347px] h-[397px] border border-slate-300 drop-shadow-md bg-white items-center text-center justify-center">
        <TfiLock className="w-1/3 h-1/3" />
        <h1 className="font-semibold text-xl">Trouble logging in?</h1>
        <p className="text-xs text-slate-400">
          Enter your email or username and we'll send you a link to get back
          into your account.
        </p>
        <Formik
          initialValues={{
            emailorusername: "",
          }}
          validationSchema={ResetSchema}
          onSubmit={(values) => handleReset(values)}
        >
          {(props) => {
            return (
              <Form>
                <Field
                  type="text"
                  name="emailorusername"
                  id="emailorusername"
                  placeholder="Email or username"
                  disabled={inputDisabled}
                  className="border border-slate-300 bg-slate-100 rounded-sm h-9 w-full mt-1 p-2"
                />
                <ErrorMessage
                  component={"div"}
                  name="emailorusername"
                  className="text-red-500"
                />

                <Button
                  isLoading={isLoading}
                  loadingText="Submitting"
                  colorScheme="twitter"
                  type="submit"
                  className="w-full mb-1 mt-3"
                >
                  Send login link
                </Button>
              </Form>
            );
          }}
        </Formik>
        <p className="font-semibold text-slate-400">OR</p>
        <p
          onClick={() => navigate("/register")}
          className="active:text-blue-200 font-semibold"
        >
          Create new account
        </p>
      </div>
      <div className="flex flex-col p-8 mt-3 mb-3 w-[347px] h-[67px] border border-slate-300 drop-shadow-md bg-white items-center justify-around">
        <p>
          Back to{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-400 active:text-blue-200"
          >
            Login
          </span>
        </p>
      </div>
      {openModal ? <EmailResetModal email="test@email.com" /> : <></>}
    </div>
  );
}
