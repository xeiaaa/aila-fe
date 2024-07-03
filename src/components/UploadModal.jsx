import { useState } from "react";
import { Button, Modal, Flex, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import authAxios from "../api/authAxios";
import { API_URL } from "../config";

const UploadModal = () => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const queryClient = useQueryClient();

  const showModal = () => setOpen(true);
  const handleCancel = () => setOpen(false);

  const handleGetImageUrl = async (e) => {
    try {
      const [file] = e.target.files;
      if (!file) {
        return;
      }
      setImage(file);
      const { data } = await authAxios.get(
        `${API_URL}/uploads/s3-signed-url?fileName=${file.name}&fileType=${file.type}`
      );
      const talkingPhoto = await axios
        .post(import.meta.env.VITE_CREATE_TALKING_PHOTO_URL, file, {
          headers: {
            "x-api-key": import.meta.env.VITE_HEYGEN_API_KEY,
            "Content-Type": file.type,
          },
        })
        .then((res) => res.data)
        .catch((error) => console.info({ PHOTO_ERROR: error }));

      if (
        data &&
        data.signedRequest &&
        data.url &&
        talkingPhoto &&
        talkingPhoto.data &&
        talkingPhoto.data.talking_photo_id
      ) {
        await axios.put(data.signedRequest, file);
        setUploadedImage({
          url: data.url,
          photoId: talkingPhoto.data.talking_photo_id,
        });
      }
    } catch (error) {
      console.error({ error });
    }
  };

  const uploadMutation = useMutation({
    mutationFn: () => {
      return authAxios.post(`${API_URL}/talkingPhotos`, uploadedImage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["avatars"] });
    },
  });

  const handleUploadImage = async () => {
    try {
      setIsUploadingImage(true);
      await uploadMutation.mutateAsync();
      setOpen(false);
      setImage(null);
      setIsUploadingImage(null);
      message.success("Successfully uploaded image");
    } catch (error) {
      message.error("Something went wrong on uploading image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <>
      <button
        onClick={showModal}
        className="flex flex-col justify-center items-center w-auto h-auto !py-[0.375rem] !px-1.5 text-[0.5rem] gap-1.5 border border-dashed rounded-full bg-transparent border-primary text-primary hover:border-tertiary"
      >
        <PlusOutlined />
        Upload
      </button>
      <Modal
        title="Upload Image"
        open={open}
        onCancel={handleCancel}
        cancelButtonProps={{
          disabled: true,
          hidden: true,
        }}
        footer={null}
      >
        <Flex gap="25px" vertical>
          <Flex
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: "1",
              border: "1px dashed #d9d9d9",
              borderRadius: "2px",
            }}
          >
            <Flex
              style={{ padding: "20px" }}
              className="h-64 justify-center items-center"
            >
              {!image && (
                <label
                  htmlFor="file-upload"
                  className="custom-file-upload"
                  style={{ cursor: "pointer" }}
                >
                  Select Image
                </label>
              )}

              <input
                type="file"
                id="file-upload"
                accept=".jpg,.jpeg,.png,.gif"
                onChange={handleGetImageUrl}
                style={{ display: "none" }}
              />
              {image && (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview image"
                  className="h-56"
                  // onError={(e) => (e.target.src = noPhotoAvailable)}
                />
              )}
            </Flex>
          </Flex>
          <Flex className="justify-end">
            <Button
              type="primary"
              disabled={!uploadedImage}
              onClick={handleUploadImage}
              loading={isUploadingImage}
            >
              Upload
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </>
  );
};
export default UploadModal;
