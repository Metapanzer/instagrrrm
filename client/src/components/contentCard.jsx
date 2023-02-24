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
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

export default function ContentCard() {
  const [contents, setContents] = useState([]);
  const [profile, setProfile] = useState([]);
  const navigate = useNavigate();

  const getAllContent = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/contents/media/all"
      );
      setContents(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addLike = async (contents_id) => {
    try {
      await axios.patch(
        `http://localhost:5000/contents/media/like/${contents_id}`
      );
      getAllContent();
      toast.success("Liked!");
    } catch (error) {
      console.log(error);
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
    getProfile();
    getAllContent();
  }, []);

  return (
    <div>
      {contents.map((content, index) => {
        return (
          <div key={index}>
            <Card maxW="md" className="mb-8">
              <CardHeader>
                <Flex spacing="4">
                  <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                    <Avatar
                      onClick={() => navigate(`/profile/${content.username}`)}
                      name={content.username}
                      showBorder="true"
                      borderColor="blue.500"
                      src={
                        profile.profile_picture
                          ? `http://localhost:5000/${content.profile_picture}`
                          : null
                      }
                    />
                    <Box
                      onClick={() => navigate(`/profile/${content.username}`)}
                      className="active:text-slate-400"
                    >
                      <Heading size="sm">{content.username}</Heading>
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
                alt="content image"
                onClick={() => navigate(`/content-details/${content.id}`)}
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
                  onClick={() => addLike(content.id)}
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
      <Toaster />
    </div>
  );
}
