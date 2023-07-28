/* eslint-disable no-lone-blocks */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Verification() {
  const [status, setStatus] = useState("");
  const params = useParams();

  const emailVerification = async () => {
    try {
      const { token } = params;

      const response = await axios.patch(
        `${process.env.REACT_APP_API}accounts/verify/${token}`
      );
      console.log(response?.data?.message);
      setStatus(response?.data?.message);
    } catch (error) {
      console.log(error);
      setStatus(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    emailVerification();
  }, []);

  return (
    <div className="container mx-auto border border-slate-400 drop-shadow-md rounded-md p-4">
      {status}
      <p className="text-xs text-slate-400 mt-3">
        If verification link expired, you can send another via edit profile page
      </p>
    </div>
  );
}
