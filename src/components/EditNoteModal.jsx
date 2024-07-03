import { useEffect, useState } from "react";
import { Button, Form, Input, Modal, message, Flex } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import authAxios from "../api/authAxios";
import { API_URL } from "../config";
import useNoteContext from "../context/useNoteContext";

const EditNoteModal = () => {
  const { setSelectedNote, selectedNote } = useNoteContext();

  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedNote) {
      form.setFieldValue("transcription", selectedNote.transcription);
    }
  }, [form, selectedNote]);


  const mutation = useMutation({
    mutationFn: (payload) => {
      console.info({ payload })
      if (!selectedNote._id) return;
      return authAxios.patch(`${API_URL}/notes/${selectedNote._id}`, payload);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setSelectedNote(data.data);
    },
  });

  const onFinish = async (values) => {
    try {
      setIsLoading(true);
      await mutation.mutateAsync(values);
      message.success("Note edited successfully!");
    } catch (error) {
      message.error("Editing of the note failed.!");
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  const showModal = () => setOpen(true);
  const handleCancel = () => setOpen(false);

  return (
    <>
      <Button onClick={showModal} className="border-0 bg-transparent hover:!bg-transparent !p-0 hover:!text-[#333333]">
        Edit Transcription
      </Button>
      <Modal
        title="Edit transcription"
        open={open}
        onCancel={handleCancel}
        cancelButtonProps={{
          disabled: true,
          hidden: true,
        }}
        footer={null}
      >
        <Form
          name="edit-note"
          layout="vertical"
          initialValues={{
            transcription: "",
          }}
          form={form}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Modifying the transcription will affect the summary and chatbot responses."
            name="transcription"
            rules={[
              {
                required: true,
                message: "Please input your transcription!",
              },
            ]}
          >
            <Input.TextArea placeholder="Enter transcription" rows={10} />
          </Form.Item>

          <Form.Item className="m-0">
            <Flex gap={10} className="flex justify-end">
              <Button
                onClick={handleCancel}
                disabled={isLoading}
                className="h-9"
              >
                Cancel
              </Button>
              <Button
                htmlType="submit"
                disabled={isLoading}
                loading={isLoading}
                className="bg-primary hover:!bg-[#359EDD] hover:!text-white border-primary text-white h-9"
              >
                Save
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default EditNoteModal;
