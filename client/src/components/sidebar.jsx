import { useNavigate } from "react-router-dom";
import { BiHomeAlt } from "react-icons/bi";
import { FiPlusSquare } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { MdLogout } from "react-icons/md";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

import CreateContentModal from "./createContentModal";

export default function Sidebar() {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const createContent = async () => {
    try {
      setOpenModal(!openModal);
    } catch (error) {
      console.log(error);
    }
  };
  const closeModal = () => {
    setOpenModal(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out!");
    navigate("/login");
  };

  return (
    <>
      <div className="flex flex-col justify-between border-r-2 w-1/6 p-4 gap-5 h-screen bg-white sticky left-0">
        <div className="flex flex-wrap">
          <h1 className="font-semibold md:text-3xl text-sm font-satisfy text-black mt-4 mb-8">
            Instgrrrm
          </h1>
          <div
            onClick={() => {
              navigate("/");
            }}
            className="group hover:bg-slate-200 rounded-full flex p-1 mb-4 w-full h-fit items-center"
          >
            <BiHomeAlt className="h-8 w-8 group-hover:w-9 group-hover:h-9 text-black group-hover:text-black mr-4" />
            <span className="font-bold text-lg group-hover:text-black">
              Home
            </span>
          </div>

          <div
            onClick={() => createContent()}
            className="group hover:bg-slate-200 rounded-full flex p-1 mb-4 w-full h-fit items-center"
          >
            <FiPlusSquare className="h-8 w-8 group-hover:w-9 group-hover:h-9 text-black group-hover:text-black mr-4" />
            <span className="font-bold text-lg group-hover:text-black">
              Create
            </span>
          </div>

          <div
            onClick={() => {
              navigate(
                `/profile/${JSON.parse(localStorage.getItem("user")).username}`
              );
            }}
            className="group hover:bg-slate-200 rounded-full flex p-1 mb-4 w-full h-fit items-center"
          >
            <CgProfile className="h-8 w-8 group-hover:w-9 group-hover:h-9 text-black group-hover:text-black mr-4" />
            <span className="font-bold text-lg group-hover:text-black">
              Profile
            </span>
          </div>
        </div>

        <div className="mb-4">
          <div
            onClick={() => handleLogout()}
            className="group hover:bg-slate-200 rounded-full flex p-1 mb-4 w-full h-fit items-center"
          >
            <MdLogout className="h-8 w-8 group-hover:w-9 group-hover:h-9 text-black group-hover:text-black mr-4" />
            <span className="font-bold text-lg group-hover:text-black">
              Log out
            </span>
          </div>
        </div>
        {openModal ? <CreateContentModal onExit={closeModal} /> : <></>}
        <Toaster />
      </div>
    </>
  );
}
