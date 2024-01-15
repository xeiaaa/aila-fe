import { useMutation, useQuery } from "@tanstack/react-query";
import { Flex, Input, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { SendOutlined } from "@ant-design/icons";

import authAxios from "../api/authAxios";
import { API_URL } from "../config";
import aila from '../assets/aila-icon.png'

function ChatBox({ note }) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [isMessageLoading, setIsMessageLoading] = useState(false)

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
      const { data } = await authAxios.get(`${API_URL}/messages?limit=1000&filter=${JSON.stringify({ note: note._id })}`);
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
      return authAxios.post(
        `${API_URL}/notes/chat`,
        {
          id: note._id,
          question: query,
          chatHistory: messages
            .slice(0, messages.length - 1)
            .map(({ message }) => message),
        },
      );
    },
  });

  const handleSendQuery = async (query) => {
    try {
      setIsMessageLoading(true)
      const tempMessageId = `temp_${new Date().getTime()}`;
      setMessages((prevMessages) => {
        const tempMessage = {
          _id: tempMessageId,
          sender: "me",
          message: query,
          createdAt: new Date()
        };
        const updatedMessages = [tempMessage, ...prevMessages];
        return updatedMessages;
      });
      setQuery("");
      const response = await mutation.mutateAsync(query);
      if (response.data) {
        setMessages((prevMessages) => {
          const tempMessageIndex = prevMessages.findIndex((message) => message._id === tempMessageId);
          if (tempMessageIndex !== -1) {
            prevMessages.splice(tempMessageIndex, 1, ...response.data);
          }

          return [...prevMessages];
        });
      }
    } catch (error) {
      message.error("Something went wrong on sending message")
    } finally {
      setIsMessageLoading(false)
    }
  };

  if (!note) {
    return null;
  }


  return (
    <Flex vertical className="flex-1 justify-between">
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
            {messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((message, index) => {
              return (
                <div key={index.toString()}>
                  {
                    message.isAi ? <Flex className="gap-3">
                      <div className="w-9">
                        <img src={aila} />
                      </div>
                      <div className="flex-1 rounded-b-xl rounded-r-xl bg-white p-5 shadow">{message.message}</div>
                    </Flex> : <Flex className="justify-end">
                      <div className="rounded-t-xl rounded-l-xl bg-secondary p-5 text-white shadow">{message.message}</div>
                    </Flex>
                  }
                </div>
              );
            })}
            {
              isMessageLoading && <Flex className="gap-3 items-center justify-self-end">
                <div className="w-9">
                  <img src={aila} />
                </div>
                <div className="rounded-xl bg-white shadow h-6 px-3 flex items-center w-12">
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><circle fill='#D3D3D3' stroke='#D3D3D3' strokeWidth='15' r='15' cx='40' cy='100'><animate attributeName='opacity' calcMode='spline' dur='2' values='1;0;1;' keySplines='.5 0 .5 1;.5 0 .5 1' repeatCount='indefinite' begin='-.4'></animate></circle><circle fill='#D3D3D3' stroke='#D3D3D3' strokeWidth='15' r='15' cx='100' cy='100'><animate attributeName='opacity' calcMode='spline' dur='2' values='1;0;1;' keySplines='.5 0 .5 1;.5 0 .5 1' repeatCount='indefinite' begin='-.2'></animate></circle><circle fill='#D3D3D3' stroke='#D3D3D3' strokeWidth='15' r='15' cx='160' cy='100'><animate attributeName='opacity' calcMode='spline' dur='2' values='1;0;1;' keySplines='.5 0 .5 1;.5 0 .5 1' repeatCount='indefinite' begin='0'></animate></circle></svg>
                </div>
              </Flex>
            }
            <div ref={messagesContainerRef}></div>
          </Flex>
        </Flex>

      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendQuery(query);
        }}
      >
        <Flex className="gap-3 items-center pt-3">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-xl shadow"
            placeholder="Ask any question..."
          />
          <div>
            <button
              type="submit"
              className="flex rounded-full h-8 w-8 items-center justify-center bg-secondary"
              disabled={mutation && mutation.isPending || dataMessages && dataMessages.isPending}
            >
              <SendOutlined className="text-white" />
            </button>
          </div>
        </Flex>
      </form>
    </Flex>
  );
}

export default ChatBox;
