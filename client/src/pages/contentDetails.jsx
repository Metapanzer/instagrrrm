import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Flex,
  Avatar,
  Box,
  Heading,
  Text,
  Button,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiLike, BiChat } from "react-icons/bi";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Form } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

export default function ContentDetails() {
  const [contents, setContents] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  const isAuth = async () => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  };

  const getContentDetails = async () => {
    try {
      const { contents_id } = params;
      const response = await axios.get(
        `http://localhost:5000/contents/media/content-details/${contents_id}`
      );
      setContents(response.data?.data);
      setComments(response.data?.comment);
    } catch (error) {
      console.log(error);
    }
  };

  const submitComment = async (comment_body) => {
    try {
      setIsLoading(true);
      const { contents_id } = params;
      const token = localStorage.getItem("token");
      console.log(comment_body);
      await axios.post(
        `http://localhost:5000/contents/media/comment/${contents_id}`,
        { comment_body },
        {
          headers: { Authorization: token },
        }
      );
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error(error.response?.data?.message);
      if (error?.response?.data?.message === "You session has been expired.") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setTimeout(navigate("/login"), 2000);
      }
    }
  };

  const addLike = async () => {
    try {
      const { contents_id } = params;
      await axios.patch(
        `http://localhost:5000/contents/media/like/${contents_id}`
      );
      getContentDetails();
      toast.success("Liked!");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    isAuth();
    getContentDetails();
  }, []);

  return (
    <div className="w-5/6 h-screen flex flex-col items-center overflow-auto">
      {contents.map((content, index) => {
        return (
          <div key={index} className="">
            <Card key={index} maxW="md" className="mb-8">
              <CardHeader>
                <Flex spacing="4">
                  <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                    <Avatar
                      onClick={() => navigate(`/profile/${content.username}`)}
                      name={content.username}
                      src={
                        content.profile_picture
                          ? `http://localhost:5000/${content.profile_picture}`
                          : null
                      }
                    />

                    <Box>
                      <Heading
                        onClick={() => navigate(`/profile/${content.username}`)}
                        size="sm"
                      >
                        {content.username}
                      </Heading>
                    </Box>
                  </Flex>
                  <IconButton
                    variant="ghost"
                    colorScheme="gray"
                    aria-label="See menu"
                    icon={<BsThreeDotsVertical />}
                  />
                </Flex>
              </CardHeader>
              <Image
                objectFit="cover"
                src={`http://localhost:5000/${content.media}`}
                alt="Chakra UI"
              />
              <CardBody>
                <Text className="font-bold">
                  {content.username}
                  <span className="font-normal ml-3">{content.caption}</span>
                </Text>
                <Text className="text-sm text-slate-400">
                  {content.createdAt.slice(0, 10)}
                </Text>
              </CardBody>

              <CardFooter
                justify="space-between"
                flexWrap="wrap"
                sx={{
                  "& > button": {
                    minW: "136px",
                  },
                }}
              >
                <Button
                  onClick={() => {
                    addLike();
                  }}
                  flex="1"
                  variant="ghost"
                  leftIcon={<BiLike />}
                >
                  Like ({content.like})
                </Button>
                <Button flex="1" variant="ghost" leftIcon={<BiChat />}>
                  Comment
                </Button>
              </CardFooter>
            </Card>
          </div>
        );
      })}
      <div className="self-start pl-2 pb-4 w-full">
        {comments.map((comment, index) => {
          return (
            <div key={index} className="">
              <Text className="font-bold">
                {comment.user.username}
                <span className="font-normal ml-3">{comment.comment_body}</span>
              </Text>
              <Text className="text-sm text-slate-400">
                {comment.createdAt.slice(0, 10)}
              </Text>
            </div>
          );
        })}
        <div className="flex justify-between mr-2 mt-2">
          <input
            type="text"
            name="comment"
            id="comment"
            placeholder="Add a comment here..."
            required={true}
            onChange={(event) => setCommentBody(event.target.value)}
            className="w-11/12 pl-2"
          />
          <Button
            isDisabled={!commentBody}
            isLoading={isLoading}
            loadingText="Submitting"
            type="submit"
            id="comment"
            onClick={() => submitComment(commentBody)}
            className="text-blue-400 font-bold mr-4 m-2"
          >
            Post
          </Button>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
