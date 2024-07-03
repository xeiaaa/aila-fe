import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Flex, Input, message } from "antd";
import { useState } from "react";

import authAxios from "../api/authAxios";
import { API_URL } from "../config";
import useNoteContext from "../context/useNoteContext";

const TextForm = ({ closeModal = () => {} }) => {
  const queryClient = useQueryClient();
  const { setSelectedNote } = useNoteContext();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [transcription, setTranscription] = useState("");

  const mutation = useMutation({
    mutationFn: (transcription) => {
      return authAxios.post(`${API_URL}/notes/text`, {
        title,
        transcription,
      });
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setSelectedNote(data);
    },
  });

  const handleSubmitText = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      await mutation.mutateAsync(transcription);
      message.success("Note created successfully!");
      closeModal();
      setTranscription("");
      setTitle("");
    } catch (err) {
      console.log("dito");
      message.error("Note creation failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmitText} className="flex flex-col gap-3">
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
        <p className="dark:text-textDark">Enter transcription:</p>
        <Input.TextArea
          value={transcription}
          rows={10}
          onChange={(e) => setTranscription(e.target.value)}
          className="dark:!bg-transparent dark:placeholder:text-textDark"
        />
      </Flex>
      <Button
        type="primary"
        htmlType="submit"
        style={{ alignSelf: "end" }}
        loading={loading}
        disabled={!title.trim() || !transcription.trim()}
        className="dark:text-textDark"
      >
        Submit
      </Button>
    </form>
  );
};

export default TextForm;
