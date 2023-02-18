import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
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
  const [media, setMedia] = useState(null);
  const [caption, setCaption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
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
      setMedia(values.media);
      setCaption(values.caption);
      let formData = new FormData();
      formData.append("images", media);
      formData.append("caption", caption);
      console.log(formData.entries);
      await axios.post(
        `http://localhost:5000/contents/media/${users_id}`,
        formData,
        {
          headers: { Authorization: token },
        }
      );
      toast.success("Upload Success!");
      setIsLoading(false);
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      setIsLoading(false);
      if (error?.response?.data?.message === "You session has been expired.") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setTimeout(navigate("/login"), 2000);
      }
      toast.error(error?.response?.data?.message);
    }
  };

  //Validasi Formik/yup
  const ContentSchema = Yup.object().shape({
    media: Yup.mixed(),
    caption: Yup.string(),
  });

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
            {/* <Formik
              initialValues={{
                media: undefined,
                caption: "",
              }}
              validationSchema={ContentSchema}
              onSubmit={(values) => handleSubmit(values)}
            >
              {(props) => {
                return (
                  <Form>
                    <p>Choose image to upload:</p>
                    <Field
                      type="file"
                      name="media"
                      id="media"
                      accept="image/png, image/jpeg, image/jpg"
                      className="mt-2"
                    />
                    <ErrorMessage
                      component={"div"}
                      name="media"
                      className="text-red-500"
                    />
                    <div className="relative">
                      <Field
                        type="text"
                        name="caption"
                        id="caption"
                        placeholder="Insert caption here"
                        className="border border-slate-300 bg-slate-100 rounded-sm h-9 w-full mt-3 p-2"
                      />
                      <ErrorMessage
                        component={"div"}
                        name="caption"
                        className="text-red-500"
                      />
                    </div>

                    <Button
                      isLoading={isLoading}
                      loadingText="Submitting"
                      colorScheme="twitter"
                      type="submit"
                      className="w-full mb-3 mt-5"
                    >
                      Publish
                    </Button>
                  </Form>
                );
              }}
            </Formik> */}
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
