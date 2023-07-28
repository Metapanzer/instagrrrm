import { useFormik } from "formik";
import axios from "axios";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ProfilePictureModal({ onExit }) {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen } = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    onOpen();
  }, []);

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true);
      let token = localStorage.getItem("token");
      console.log(values);
      let formData = new FormData();
      formData.append("images", values.profile_picture);
      await axios.patch(
        `${process.env.REACT_APP_API}accounts/edit/picture`,
        formData,
        {
          headers: { Authorization: token },
        }
      );
      toast.success("Upload Success!");
      setIsLoading(false);
      setTimeout(() => onExit(), 2000);
    } catch (error) {
      setIsLoading(false);
      if (error?.response?.data?.message === "You session has been expired.") {
        toast.error("You session has been expired.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setTimeout(navigate("/login"), 2000);
      }
      toast.error(error?.response?.data?.message);
    }
  };

  //Make input useformik
  const formik = useFormik({
    initialValues: {
      profile_picture: "",
    },
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  return (
    <>
      <Modal isOpen={isOpen} onClose={onExit}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change profile picture</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
              <label>Choose File to Upload:</label>
              <input
                type="file"
                name="media"
                accept="image/*"
                required
                onChange={(e) =>
                  formik.setFieldValue(
                    "profile_picture",
                    e.currentTarget.files[0]
                  )
                }
                className="mt-2"
              />

              <Button
                isLoading={isLoading}
                loadingText="Submitting"
                colorScheme="twitter"
                type="submit"
                className="w-full mb-3 mt-5"
              >
                Save profile picture
              </Button>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onExit}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
        <Toaster />
      </Modal>
    </>
  );
}
