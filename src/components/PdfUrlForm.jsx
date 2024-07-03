import { Button, Flex, Input } from "antd";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { API_URL } from "../config";
import authAxios from "../api/authAxios";
import useNoteContext from "../pages/notes/context/useNoteContext";

const PdfUrlForm = () => {
  const [url, setUrl] = useState("");
  const queryClient = useQueryClient();
  const { setSelectedNote } = useNoteContext()

  const mutation = useMutation({
    mutationFn: (url) => {
      return authAxios.post(
        `${API_URL}/notes/pdf`,
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
      <label>PDF Url</label>
      <Flex>
        <Input
          placeholder="Enter pdf url"
          name="pdfUrl"
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

export default PdfUrlForm;
