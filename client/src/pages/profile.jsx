import axios from "axios";
import { Avatar, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Profile() {
  const [contents, setContents] = useState([]);
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();
  const params = useParams();

  const getProfile = async () => {
    try {
      const username = params.username;
      const response = await axios.get(
        `http://localhost:5000/accounts/profile/${username}`
      );
      setUserData(response?.data?.data?.user);
      getUserContent(response?.data?.data?.user?.id);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserContent = async (users_id) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/contents/${users_id}`
      );
      setContents(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="w-5/6 flex flex-col items-center h-screen overflow-auto">
      <div className="flex w-4/6 flex-row justify-center gap-28 p-4">
        <div>
          <Avatar
            size="2xl"
            name={userData.fullname}
            src={
              userData.profile_picture
                ? `http://localhost:5000/${userData.profile_picture}`
                : undefined
            }
            className="w-36 h-36"
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <span className="font-semibold">{userData.username}</span>
            <Button onClick={() => navigate("/profile/edit")}>
              Edit profile
            </Button>
          </div>
          <div>
            <span className="font-semibold">{userData.posts}</span> Posts
          </div>
          <div>
            <p className="font-semibold">{userData.fullname}</p>
            <p>{userData.bio}</p>
          </div>
        </div>
      </div>
      <hr className="border-1 border-slate-400 w-4/6 mt-8 mb-8" />
      <div className="w-4/6 grid grid-cols-3 justify-items-center gap-4 mb-8">
        {contents.map((content, index) => {
          return (
            <img
              onClick={() => navigate(`/content-details/${content.id}`)}
              key={index}
              src={
                contents ? `http://localhost:5000/${content.media}` : undefined
              }
              alt={content.id}
              className="w-64 h-64"
            />
          );
        })}
      </div>
    </div>
  );
}
