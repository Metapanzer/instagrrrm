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

export default function CreateContentModal({ onExit }) {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen } = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    onOpen();
  }, []);

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true);
      let users_id = JSON.parse(localStorage.getItem("user"))?.id;
      let token = localStorage.getItem("token");
      console.log(values);
      let formData = new FormData();
      formData.append("images", values.media);
      formData.append("caption", values.caption);
      await axios.post(
        `${process.env.REACT_APP_API}contents/media/${users_id}`,
        formData,
        {
          headers: { Authorization: token },
        }
      );
      toast.success("Upload Success!");
      setIsLoading(false);
      setTimeout(() => window.location.reload(), 2000);
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
      media: "",
      caption: "",
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
          <ModalHeader>Create Content</ModalHeader>
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
                  formik.setFieldValue("media", e.currentTarget.files[0])
                }
                className="mt-2"
              />

              <input
                type="text"
                name="caption"
                onChange={formik.handleChange}
                value={formik.values.name}
                placeholder="Type a caption here..."
                maxLength={200}
                className="border border-slate-300 bg-slate-100 rounded-sm h-9 w-full mt-3 p-2"
              />

              <Button
                isLoading={isLoading}
                loadingText="Submitting"
                colorScheme="twitter"
                type="submit"
                className="w-full mb-3 mt-5"
              >
                Publish
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
