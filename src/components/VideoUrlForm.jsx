import { Button, Flex, Input } from "antd";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import authAxios from "../api/authAxios";
import { API_URL } from "../config";
import useNoteContext from "../pages/notes/context/useNoteContext";

const VideoUrlForm = () => {
  const queryClient = useQueryClient();
  const { setSelectedNote } = useNoteContext()

  const [url, setUrl] = useState("");

  const mutation = useMutation({
    mutationFn: (url) => {
      return authAxios.post(
        `${API_URL}/notes/video`,
        {
          title: (+new Date()).toString(),
          url,
        },
      );
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setSelectedNote(data)
    },
  });

  const handleSubmitPdfUrl = (e) => {
    e.preventDefault();
    mutation.mutateAsync(url);
  };

  return (
    <form onSubmit={handleSubmitPdfUrl}>
      <label>Video Url</label>
      <Flex>
        <Input
          placeholder="Enter video url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Flex>
    </form>
  );
};

export default VideoUrlForm;
