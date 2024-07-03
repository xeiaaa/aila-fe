import { useState } from "react";
import { Button, Flex, Typography, Modal, Input } from "antd";
import { useWindowSize } from "../hooks/useWindowSize";
import { FolderAddOutlined } from "@ant-design/icons";
const { Text } = Typography;

const CreateFolderMainContent = () => {
  const [openModal, setOpenModal] = useState(false);
  const showModal = () => setOpenModal(true);
  const hideModal = () => setOpenModal(false);

  const { width: screenWidth } = useWindowSize();

  return (
    <>
      <Button
        className="flex flex-1 items-center w-full sm:w-fit h-full max-w-96 rounded-xl py-4 px-5 border-solid border-2 !bg-transparent border-secondary hover:!border-[#359EDD]"
        onClick={showModal}
      >
        <Flex gap={15}>
          <FolderAddOutlined className="text-primary text-2xl" />
          <Flex vertical className="text-left">
            <Text strong>New Folder</Text>
            <Text type="secondary">Sort your notes quickly.</Text>
          </Flex>
        </Flex>
      </Button>

      {screenWidth < 640 ? (
        <Modal
          title="Create New Folder"
          open={openModal}
          onCancel={hideModal}
          footer={null}
          centered
          width="80%"
        >
          <Flex gap="middle" vertical className="pt-2.5">
            <Input placeholder="Folder name" />
            <Button
              className="bg-primary text-white rounded-lg border-none"
              block
              size="large"
            >
              Create
            </Button>
          </Flex>
        </Modal>
      ) : (
        <Modal
          title="Create New Folder"
          open={openModal}
          onCancel={hideModal}
          footer={null}
          width="25%"
        >
          <Flex gap="middle" vertical className="pt-2.5">
            <Input placeholder="Folder name" />
            <Button
              className="bg-primary text-white rounded-lg border-none"
              block
            >
              Create
            </Button>
          </Flex>
        </Modal>
      )}
    </>
  );
};

export default CreateFolderMainContent;
