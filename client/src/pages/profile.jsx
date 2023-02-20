import axios from "axios";
import { Avatar, Button } from "@chakra-ui/react";
import { useEffect } from "react";

export default function Profile() {
  const getProfile = () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // getProfile()
  }, []);

  return (
    <div className="w-screen flex flex-col items-center">
      <div className="flex w-3/5 flex-row gap-28 p-4">
        <div>
          <Avatar
            size="2xl"
            name="Segun Adebayo"
            src="https://bit.ly/sage-adebayo"
            className="w-36 h-36"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex gap-4 items-center">
            <span>Baltheon</span>
            <Button>Edit profile</Button>
          </div>
          <div>80 Posts</div>
          <div>
            <p>Krisna Sandy Pribadi</p>
            <p>"Action speaks louder, so I become a fighter"</p>
          </div>
        </div>
      </div>
      <hr className="border-1 border-slate-400 w-3/5 " />
      <div className="w-3/5 grid grid-cols-3 gap-4">Div 2</div>
    </div>
  );
}
