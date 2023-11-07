import { Button, Flex, Input } from "antd";
import { useState } from "react";
import { TOKEN } from "../config";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const PdfUrlForm = () => {
  const [url, setUrl] = useState("");

  const mutation = useMutation({
    mutationFn: (url) => {
      return axios.post(
        "http://localhost:3000/v1/notes/pdf",
        {
          title: (+new Date()).toString(),
          url,
        },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
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
