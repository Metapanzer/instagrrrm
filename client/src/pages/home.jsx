import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@chakra-ui/react";
import ContentCard from "../components/contentCard";

export default function Home() {
  const [profile, setProfile] = useState([]);
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

  return (
    <div className="w-5/6 flex items-center overflow-auto">
      <div className="flex flex-col items-center justify-between p-4 gap-5 bg-white w-3/5 h-screen">
        <ContentCard />
      </div>
      <div className="flex flex-col justify-between p-4 gap-5 bg-white w-2/5 h-screen">
        <div className="flex items-center mt-4">
          <Avatar
            onClick={() => navigate(`/profile/${profile.username}`)}
            name={profile.username}
            src="/public/images/default.jpg"
          />
          <div className="flex flex-col">
            <span
              onClick={() => navigate(`/profile/${profile.username}`)}
              className="font-bold ml-3 active:text-slate-400"
            >
              {profile.username}
            </span>
            <span className="font-normal ml-3">{profile.fullname}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
