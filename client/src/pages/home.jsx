import axios from "axios";
import { useEffect } from "react";

export default function Home() {
  const getAllContent = async () => {
    try {
      const response = await axios.get("http://localhost:5000/contents/all");
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const getProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${token}`);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllContent();
    getProfile();
  }, []);

  return (
    <div className="w-screen flex items-center">
      <div className="flex flex-col justify-between p-4 gap-5 bg-white w-3/5 h-screen border border-black">
        div A
      </div>
      <div className="flex flex-col justify-between p-4 gap-5 bg-white w-2/5 h-screen  border border-black">
        div B
      </div>
    </div>
  );
}
