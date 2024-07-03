import { Button, Flex, Input, message } from "antd";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import authAxios from "../api/authAxios";
import { API_URL } from "../config";

const UrlForm = ({ closeModal = () => {} }) => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");

  const mutation = useMutation({
    mutationFn: (url) => {
      return authAxios.post(`${API_URL}/notes/url`, {
        title,
        url,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  function validateUrl(url) {
    const regExp =
      /^(http(s)?:\/\/)?(www\.)?([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+[a-z]{2,}(:[0-9]+)?(\/.*)?$/;
    return regExp.test(url);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await mutation.mutateAsync(url);

      message.success("Note created successfully!");
      closeModal();
      setUrl("");
      setTitle("");
    } catch (err) {
      message.error("Note creation failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Flex gap={5} vertical>
        <p className="dark:text-textDark">Note:</p>
        <Input
          placeholder="Enter note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="dark:!bg-transparent dark:placeholder:text-textDark"
        />
      </Flex>
      <Flex gap={5} vertical>
        <p className="dark:text-textDark">Enter a valid website URL:</p>
        <Flex vertical>
          <Input
            placeholder="Enter site url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="dark:!bg-transparent dark:placeholder:text-textDark"
          />
        </Flex>
      </Flex>
      <Button
        type="primary"
        htmlType="submit"
        style={{ alignSelf: "end" }}
        loading={loading}
        disabled={!title.trim() || !validateUrl(url)}
        className="dark:text-textDark"
      >
        Submit
      </Button>
    </form>
  );
};

export default UrlForm;
