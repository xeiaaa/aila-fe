import { Typography, Flex, Spin, Modal } from "antd";
import { Link } from "react-router-dom";

import { BsFileEarmarkPdf } from "react-icons/bs";
import { SiAudiomack } from "react-icons/si";
import { SlDiamond } from "react-icons/sl";
import { GoVideo } from "react-icons/go";
import useNoteContext from "../context/useNoteContext";
import { useSubscription } from "../context/SubscriptionContext";
import { useState } from "react";

const { Text } = Typography;

const NotesCategory = ({ handleDownloadPdf, isGeneratingPdf }) => {
  const [subscription, setSubscription] = useState(false);
  const { selectedNote } = useNoteContext();
  const { subscribedPlan } = useSubscription();
console.log(subscribedPlan)
  const isAllowed =
    subscribedPlan === "Trial offer" ||
    subscribedPlan === "Basic offer" ||
    subscribedPlan === "Premium offer" ||
    subscribedPlan === "Weekly pass" ||
    subscribedPlan === "Daily pass";

  const handleSubscriptionModal = (e) => {
    if (!isAllowed) {
      e.preventDefault();
      setSubscription(true);
    }
  };

  return (
    <>
      <div className="w-full justify-center items-center flex-col h-full flex pb-7">
        <Text
          strong
          style={{
            marginBottom: "15px",
            color: "#8C8F92",
            alignSelf: "flex-start",
          }}
        >
          Generate Media
        </Text>
        <Flex
          gap={20}
          className="w-full justify-center items-center flex-col sm:flex-row"
        >
          <button
            className="group relative flex justify-center items-center w-full h-full rounded-md py-4 px-5 border-solid border border-primary bg-transparent shadow transition duration-300 hover:border-[#3A95CB] hover:shadow-md dark:bg-secondaryDark dark:border-primaryDark"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
          >
            <Flex
              align="center"
              gap={15}
              className="flex-row sm:flex-col w-full"
            >
              {isGeneratingPdf ? (
                <Spin className="w-6 h-6 sm:w-9 sm:h-9" />
              ) : (
                <BsFileEarmarkPdf className="text-4xl transition duration-300 text-primary group-hover:text-primaryHover" />
              )}

              <Flex vertical className="text-left sm:text-center">
                <Text
                  className="text-primary transition duration-300 group-hover:text-primaryHover"
                  strong
                >
                  PDF
                </Text>
                <Text
                  type="secondary leading-snug"
                  className="dark:text-gray-400"
                >
                  Convert text into a document.
                </Text>
              </Flex>
            </Flex>
          </button>
          <Link
            to={`/generate/${selectedNote._id}?type=audio`}
            className="flex justify-center w-full h-full"
            onClick={handleSubscriptionModal}
          >
            <button className="group relative flex justify-center items-center w-full h-full rounded-md py-4 px-5 border-solid border border-primary bg-transparent shadow transition duration-300 hover:border-[#3A95CB] hover:shadow-md dark:bg-secondaryDark dark:border-primaryDark">
              <Flex
                align="center"
                gap={15}
                className="flex-row sm:flex-col w-full"
              >
                <SlDiamond className="absolute top-1 right-0 bg-primaryHover text-white p-1 mr-2 text-2xl rounded-full" />
                <SiAudiomack className="text-4xl transition duration-300 text-primary group-hover:text-primaryHover" />
                <Flex vertical className="text-left sm:text-center">
                  <Text
                    className="text-primary transition duration-300 group-hover:text-primaryHover"
                    strong
                  >
                    Audio
                  </Text>
                  <Text
                    type="secondary leading-snug"
                    className="dark:text-gray-400"
                  >
                    Transform content into audio.
                  </Text>
                </Flex>
              </Flex>
            </button>
          </Link>
          <Link
            to={`/generate/${selectedNote._id}?type=video`}
            className="flex justify-center w-full h-full"
            onClick={handleSubscriptionModal}
          >
            <button className="group relative flex justify-center items-center w-full h-full rounded-md py-4 px-5 border-solid border border-primary bg-transparent shadow transition duration-300 hover:border-[#3A95CB] hover:shadow-md dark:bg-secondaryDark dark:border-primaryDark">
              <Flex
                align="center"
                gap={15}
                className="flex-row sm:flex-col w-full"
              >
                <SlDiamond className="absolute top-1 right-0 bg-primaryHover text-white p-1 mr-2 text-2xl rounded-full" />
                <GoVideo className="text-4xl transition duration-300 text-primary group-hover:text-primaryHover" />
                <Flex vertical className="text-left sm:text-center">
                  <Text
                    className="text-primary transition duration-300 group-hover:text-primaryHover"
                    strong
                  >
                    Video
                  </Text>
                  <Text
                    type="secondary leading-snug"
                    className="dark:text-gray-400"
                  >
                    Turn text into interactive content.
                  </Text>
                </Flex>
              </Flex>
            </button>
          </Link>
        </Flex>
      </div>
      <Modal
        title="Subscription Required"
        centered
        open={subscription}
        onOk={() => setSubscription(false)}
        cancelButtonProps={{ style: { display: "none" } }}
        Props={{ style: { display: "none" } }}
        maskClosable={false}
        closable={false}
      >
        <p>You need to subscribe to access this feature.</p>
      </Modal>
    </>
  );
};

export default NotesCategory;
