import { useMutation, useQuery } from "@tanstack/react-query";
import { Flex, message, Button, Empty, Input, Modal } from "antd";
import { useEffect, useRef, useState } from "react";
import { SendOutlined } from "@ant-design/icons";

import authAxios from "../api/authAxios";
import { API_URL } from "../config";
import aila from "../assets/aila-icon.png";
import messageIcon from "../assets/message.png";
import { useSubscription } from "../context/SubscriptionContext";

function ChatBox({ note }) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [subscription, setSubscription] = useState(false);
  const { subscribedPlan } = useSubscription();

  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const { data: dataMessages } = useQuery({
    queryKey: [`messages-${note._id}`],
    queryFn: async () => {
      const { data } = await authAxios.get(
        `${API_URL}/messages?limit=1000&filter=${JSON.stringify({
          note: note._id,
        })}`
      );
      return data;
    },
  });

  useEffect(() => {
    if (note && dataMessages && dataMessages.results) {
      setMessages(dataMessages.results);
      setQuery("");
    }
  }, [note, dataMessages]);

  const mutation = useMutation({
    mutationFn: (query) => {
      return authAxios.post(`${API_URL}/notes/chat`, {
        id: note._id,
        question: query,
        chatHistory: messages
          .slice(0, messages.length - 1)
          .map(({ message }) => message),
      });
    },
  });

  const handleSendQuery = async (query) => {
    try {
      setIsMessageLoading(true);
      const tempMessageId = `temp_${new Date().getTime()}`;
      setMessages((prevMessages) => {
        const tempMessage = {
          _id: tempMessageId,
          sender: "me",
          message: query,
          createdAt: new Date(),
        };
        const updatedMessages = [tempMessage, ...prevMessages];
        return updatedMessages;
      });
      setQuery("");
      const response = await mutation.mutateAsync(query);
      if (response.data) {
        setMessages((prevMessages) => {
          const tempMessageIndex = prevMessages.findIndex(
            (message) => message._id === tempMessageId
          );
          if (tempMessageIndex !== -1) {
            prevMessages.splice(tempMessageIndex, 1, ...response.data);
          }

          return [...prevMessages];
        });
      }
    } catch (error) {
      message.error("Something went wrong on sending message");
    } finally {
      setIsMessageLoading(false);
    }
  };

  if (!note) {
    return null;
  }
  // Subscription
  const isAllowed =
    subscribedPlan === "free" ||
    subscribedPlan === "basic" ||
    subscribedPlan === "premium" ||
    subscribedPlan === "weekly" ||
    subscribedPlan === "daily pass";

  const handleSubscriptionModal = () => {
    if (!isAllowed) {
      setSubscription(true);
    }
  };

  return (
    <Flex vertical className="flex-1 justify-between p-5 md:p-0">
      <div className="flex-1 relative">
        <Flex
          vertical
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "end",
          }}
        >
          <Flex gap={16} className="flex-col overflow-y-scroll pb-5">
            {messages.length === 0 ? (
              <Flex align="center" className="h-lvh justify-center">
                <Empty
                  image={messageIcon}
                  description={
                    <span className="text-sm text-gray-400">
                      Start your conversation with AILA by <br /> asking a
                      question!
                    </span>
                  }
                  imageStyle={{
                    height: "auto",
                    maxWidth: "100%",
                    width: "60px",
                    maxHeight: "60px",
                    margin: "0 auto",
                  }}
                />
              </Flex>
            ) : (
              messages
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                .map((message, index) => {
                  return (
                    <div key={index.toString()}>
                      {message.isAi ? (
                        <Flex className="gap-2.5">
                          <div className="w-7">
                            <img src={aila} />
                          </div>
                          <div className="flex-1 rounded-b-xl rounded-r-xl bg-white p-3 shadow dark:bg-tertiaryDark dark:text-textDark">
                            {message.message}
                          </div>
                        </Flex>
                      ) : (
                        <Flex className="justify-end">
                          <div className="rounded-t-xl rounded-l-xl bg-primary p-3 text-white shadow dark:bg-primaryDark">
                            {message.message}
                          </div>
                        </Flex>
                      )}
                    </div>
                  );
                })
            )}
            {isMessageLoading && (
              <Flex className="gap-3 items-center justify-self-end">
                <div className="w-7">
                  <img src={aila} />
                </div>
                <div className="rounded-xl bg-white shadow h-6 px-3 flex items-center w-12">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                    <circle
                      fill="#D3D3D3"
                      stroke="#D3D3D3"
                      strokeWidth="15"
                      r="15"
                      cx="40"
                      cy="100"
                    >
                      <animate
                        attributeName="opacity"
                        calcMode="spline"
                        dur="2"
                        values="1;0;1;"
                        keySplines=".5 0 .5 1;.5 0 .5 1"
                        repeatCount="indefinite"
                        begin="-.4"
                      ></animate>
                    </circle>
                    <circle
                      fill="#D3D3D3"
                      stroke="#D3D3D3"
                      strokeWidth="15"
                      r="15"
                      cx="100"
                      cy="100"
                    >
                      <animate
                        attributeName="opacity"
                        calcMode="spline"
                        dur="2"
                        values="1;0;1;"
                        keySplines=".5 0 .5 1;.5 0 .5 1"
                        repeatCount="indefinite"
                        begin="-.2"
                      ></animate>
                    </circle>
                    <circle
                      fill="#D3D3D3"
                      stroke="#D3D3D3"
                      strokeWidth="15"
                      r="15"
                      cx="160"
                      cy="100"
                    >
                      <animate
                        attributeName="opacity"
                        calcMode="spline"
                        dur="2"
                        values="1;0;1;"
                        keySplines=".5 0 .5 1;.5 0 .5 1"
                        repeatCount="indefinite"
                        begin="0"
                      ></animate>
                    </circle>
                  </svg>
                </div>
              </Flex>
            )}
            <div ref={messagesContainerRef}></div>
          </Flex>
        </Flex>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!isAllowed) {
            handleSubscriptionModal();
            return;
          }
          console.log({ query });
          handleSendQuery(query);
        }}
      >
        <Flex className="pt-3 md:pt-0">
          <Input
            className="m-0 w-full resize-none text-sm py-2 pl-3 pr-8 rounded-lg border border-gray-300 hover:border-primary focus:border-primary dark:bg-tertiaryDark dark:text-textDark dark:border-borderDark dark:placeholder:text-gray-400"
            placeholder="Ask any question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          ></Input>
          <Button
            htmlType="submit"
            icon={
              <SendOutlined className="text-primary !text-xl sm:!text-base !bg-transparent" />
            }
            disabled={
              (mutation && mutation.isPending) ||
              (dataMessages && dataMessages.isPending)
            }
            className="absolute bottom-[1.300rem] sm:bottom-[1.1200rem] right-6 sm:right-4 rounded-lg border p-0.5 text-white transition-colors bg-transparent hover:!bg-transparent border-none"
          />
        </Flex>
      </form>
      <Modal
        title="Subscription Required"
        centered
        open={subscription}
        onOk={() => setSubscription(false)}
        cancelButtonProps={{ style: { display: "none" } }}
        maskClosable={false}
        closable={false}
      >
        <p>You need to subscribe to access this feature.</p>
      </Modal>
    </Flex>
  );
}

export default ChatBox;
