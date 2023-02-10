import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function Register() {
  const [data, setData] = useState();
  const navigate = useNavigate();
  let username = useRef();
  let email = useRef();
  let password = useRef();

  const submitRegister = async () => {
    try {
      let dataToSend = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };

      await axios.post("http://localhost:2000/users", dataToSend);
      username.current.value = "";
      email.current.value = "";
      password.current.value = "";
      alert("Pendaftaran Berhasil!");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  //Validasi Formik/yup
  const LoginSchema = Yup.object().shape({
    username: Yup.string()
      .min(6, "Username consist of minimum 6 character!")
      .required("Username is required"),
    email: Yup.string()
      .email("Email is not valid!")
      .required("Email is required!"),
    password: Yup.string()
      .min(8, "Password minimum 8 character")
      .required("Password is required!")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
  });

  return (
    <div className="flex justify-center">
      <div className="flex flex-col p-8 gap-3 mt-3 w-[347px] h-[617px] border border-slate-300 drop-shadow-md bg-white items-center justify-around">
        <h1>Instgrrrm</h1>
        <p>Sign up to see photos and videos from your friends.</p>
        <Formik
          initialValues={{ username: "", email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={(values) => setData(values)}
        >
          {(props) => {
            console.log(props);
            return (
              <Form>
                <label htmlFor="username">
                  <p className="mt-3">Name</p>
                </label>
                <Field
                  //   ref={username}
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Input username"
                  className="rounded-md h-8 mt-1"
                />
                <ErrorMessage
                  component={"div"}
                  name="username"
                  className="text-red-500"
                />
                <label htmlFor="email">
                  <p className="mt-3">Email</p>
                </label>
                <Field
                  //   ref={email}
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Input email"
                  className="rounded-md h-8 mt-1"
                />
                <ErrorMessage
                  component={"div"}
                  name="email"
                  className="text-red-500"
                />
                <label htmlFor="password">
                  <p className="mt-3">Password</p>
                </label>
                <Field
                  //   ref={password}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Input password"
                  className="rounded-md h-8 mt-1"
                />
                <ErrorMessage
                  component={"div"}
                  name="password"
                  className="text-red-500"
                />
                <button
                  type="submit"
                  className="mt-3 bg-slate-400 rounded-md w-fit p-2 font-bold self-center"
                  onClick={() => submitRegister()}
                >
                  Sign up
                </button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}
