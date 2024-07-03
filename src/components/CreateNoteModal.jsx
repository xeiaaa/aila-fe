import { useState } from "react";
import { useWindowSize } from "../hooks/useWindowSize";
import { Flex, Button, Drawer, Typography, Menu, Tooltip } from "antd";
import {
  FilePdfOutlined,
  VideoCameraOutlined,
  AudioOutlined,
  YoutubeOutlined,
  FontSizeOutlined,
  GlobalOutlined,
  FormOutlined,
  CloseOutlined,
} from "@ant-design/icons";
const { Text } = Typography;
import YoutubeUrlForm from "./YoutubeUrlForm";
import TextForm from "./TextForm";
import UrlForm from "./UrlForm";
import UploadForm from "./UploadForm";

function CreateNoteModal() {
  const [openModal, setOpenModal] = useState(false);
  const [openChildrenDrawer, setChildrenDrawer] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const { width: screenWidth } = useWindowSize();

  const showModal = () => setOpenModal(true);
  const hideModal = () => setOpenModal(false);
  const showChildrenDrawer = () => setChildrenDrawer(true);
  const hideChildrenDrawer = () => setChildrenDrawer(false);

  const noteTypes = [
    {
      name: "PDF",
      Icon: FilePdfOutlined,
    },
    {
      name: "Video",
      Icon: VideoCameraOutlined,
    },
    {
      name: "Audio",
      Icon: AudioOutlined,
    },
    {
      name: "Youtube",
      Icon: YoutubeOutlined,
    },
    {
      name: "URL",
      Icon: GlobalOutlined,
    },
    {
      name: "Text",
      Icon: FontSizeOutlined,
    },
  ];

  return (
    <>
      <Button
        className="group flex flex-1 items-center w-full h-full max-w-96 rounded-md py-4 px-5 bg-transparent hover:!bg-transparent sm:w-full border-primary shadow transition duration-300 hover:border-[#3A95CB] hover:shadow-md dark:bg-secondaryDark dark:border-primaryDark"
        onClick={showModal}
      >
        <Flex vertical className="w-full justify-center items-center">
          <Flex gap={8}>
            <Text
              className="text-primary transition duration-300 group-hover:text-primaryHover"
              strong
            >
              Create Note
            </Text>
            <FormOutlined className="text-primary transition duration-300 group-hover:text-primaryHover" />
          </Flex>
          <Text type="secondary" className="dark:text-gray-400">
            Start your notes on a blank page
          </Text>
        </Flex>
      </Button>
      {screenWidth < 640 ? (
        <Drawer
          open={openModal}
          onClose={hideModal}
          placement="bottom"
          className="rounded-t-2xl dark:bg-secondaryDark"
          height="fit-content"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              padding: 20,
            }}
          >
            <p className="dark:text-textDark mb-2">
              Please select the type of content:
            </p>
            <Menu className="dark:bg-secondaryDark">
              {noteTypes.map(({ name, Icon }) => {
                return (
                  <Menu.Item
                    key={name}
                    style={{
                      borderColor:
                        name === selectedType
                          ? "rgba(61, 142, 242, 0.992)"
                          : "#8C8F92",
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      gap: "10px",
                      padding: "5px",
                    }}
                    onClick={() => {
                      setSelectedType(name);
                      showChildrenDrawer();
                    }}
                  >
                    <span className="flex items-center gap-1">
                      <Icon
                        style={{
                          color:
                            name === selectedType
                              ? "rgba(61, 142, 242, 0.992)"
                              : "#40A9E8",
                          fontSize: "16px",
                          borderRadius: "50%",
                          padding: "10px",
                        }}
                        className="bg-[#E8F6FF] dark:bg-tertiaryDark"
                      />
                      <span className="text-base dark:text-textDark">
                        {name}
                      </span>
                    </span>
                  </Menu.Item>
                );
              })}
            </Menu>
            {/* <UploadImageForm /> */}
          </div>
          <Drawer
            open={openChildrenDrawer}
            onClose={hideChildrenDrawer}
            closable={false}
            placement="bottom"
            height="fit-content"
          >
            {selectedType === "PDF" && (
              <UploadForm
                type="pdf"
                closeModal={() => {
                  setOpenModal(false);
                }}
              />
            )}
            {selectedType === "Video" && (
              <UploadForm
                type="video"
                closeModal={() => {
                  setOpenModal(false);
                }}
              />
            )}
            {selectedType === "Audio" && (
              <UploadForm
                type="audio"
                closeModal={() => {
                  setOpenModal(false);
                }}
              />
            )}
            {selectedType === "Youtube" && (
              <YoutubeUrlForm
                closeModal={() => {
                  setOpenModal(false);
                }}
              />
            )}
            {selectedType === "Text" && (
              <TextForm
                closeModal={() => {
                  setOpenModal(false);
                }}
              />
            )}
            {selectedType === "URL" && (
              <UrlForm
                closeModal={() => {
                  setOpenModal(false);
                }}
              />
            )}
          </Drawer>
        </Drawer>
      ) : (
        // <Modal
        //   title="Create Note"
        //   open={openModal}
        //   onCancel={hideModal}
        //   footer={null}
        //   header={<h2>M</h2>}
        //   centered
        //   width="fit-content dark:!bg-tertiaryDark"
        // >
        // <div className="flex flex-col gap-4">
        //   <Flex gap={8} vertical>
        //     <p>Please select the type of content:</p>
        //     <div className="flex justify-center gap-2">
        //       {noteTypes.map(({ name, Icon }) => {
        //         return (
        //           <Tooltip key={name} title={name} color={"#2db7f5"}>
        //             <Button
        //               key={name}
        //               style={{
        //                 borderColor:
        //                   name === selectedType
        //                     ? "rgba(61, 142, 242, 0.992)"
        //                     : "#8C8F92",
        //                 display: "flex",
        //                 alignItems: "center",
        //                 padding: "3px 18px",
        //                 height: "100%",
        //               }}
        //               onClick={() => setSelectedType(name)}
        //             >
        //               <span className="text-lg">
        //                 <Icon
        //                   style={{
        //                     color:
        //                       name === selectedType
        //                         ? "rgba(61, 142, 242, 0.992)"
        //                         : "#8C8F92",
        //                   }}
        //                 />
        //               </span>
        //             </Button>
        //           </Tooltip>
        //         );
        //       })}
        //     </div>
        //   </Flex>

        //   {selectedType === "PDF" && (
        //     <UploadForm
        //       type="pdf"
        //       closeModal={() => {
        //         setOpenModal(false);
        //       }}
        //     />
        //   )}
        //   {selectedType === "Video" && (
        //     <UploadForm
        //       type="video"
        //       closeModal={() => {
        //         setOpenModal(false);
        //       }}
        //     />
        //   )}
        //   {selectedType === "Audio" && (
        //     <UploadForm
        //       type="audio"
        //       closeModal={() => {
        //         setOpenModal(false);
        //       }}
        //     />
        //   )}
        //   {selectedType === "Youtube" && (
        //     <YoutubeUrlForm
        //       closeModal={() => {
        //         setOpenModal(false);
        //       }}
        //     />
        //   )}
        //   {selectedType === "Text" && (
        //     <TextForm
        //       closeModal={() => {
        //         setOpenModal(false);
        //       }}
        //     />
        //   )}
        //   {selectedType === "URL" && (
        //     <UrlForm
        //       closeModal={() => {
        //         setOpenModal(false);
        //       }}
        //     />
        //   )}

        //   {/* <UploadImageForm /> */}
        // </div>
        // </Modal>
        <div
          id={openModal ? "visible" : "hidden"}
          tabIndex="-1"
          aria-hidden={!openModal}
          className={`${
            openModal ? "" : "hidden"
          } overflow-y-auto overflow-x-hidden fixed top-2/4 left-2/4 z-50 justify-center items-center w-full md:inset-0 h-full backdrop-brightness-50`}
        >
          <div className="absolute top-[15%] left-0 bottom-0 right-0 m-auto p-4 w-[28.125rem] max-w-xl max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-tertiaryDark dark:text-textDark">
              <div className="flex items-center justify-between p-4 md:py-3 md:px-7 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold dark:text-white">
                  Create Note
                </h3>
                <Button
                  className="bg-transparent text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:!bg-gray-600 dark:hover:text-white border-none"
                  onClick={hideModal}
                >
                  <CloseOutlined className="dark:text-textDark" />
                  <span className="sr-only">Close modal</span>
                </Button>
              </div>
              <div className="flex flex-col gap-4 px-7 pb-7">
                <Flex gap={8} vertical>
                  <p className="dark:text-textDark">
                    Please select the type of content:
                  </p>
                  <div className="flex justify-center gap-2 mt-4">
                    {noteTypes.map(({ name, Icon }) => {
                      return (
                        <Tooltip key={name} title={name} color={"#2db7f5"}>
                          <Button
                            key={name}
                            style={{
                              borderColor:
                                name === selectedType
                                  ? "rgba(61, 142, 242, 0.992)"
                                  : "#8C8F92",
                              display: "flex",
                              alignItems: "center",
                              padding: "3px 18px",
                              height: "100%",
                            }}
                            onClick={() => setSelectedType(name)}
                            className="dark:!bg-transparent"
                          >
                            <span className="text-lg">
                              <Icon
                                style={{
                                  color:
                                    name === selectedType
                                      ? "rgba(61, 142, 242, 0.992)"
                                      : "#8C8F92",
                                }}
                              />
                            </span>
                          </Button>
                        </Tooltip>
                      );
                    })}
                  </div>
                </Flex>

                {selectedType === "PDF" && (
                  <UploadForm
                    type="pdf"
                    closeModal={() => {
                      setOpenModal(false);
                    }}
                  />
                )}
                {selectedType === "Video" && (
                  <UploadForm
                    type="video"
                    closeModal={() => {
                      setOpenModal(false);
                    }}
                  />
                )}
                {selectedType === "Audio" && (
                  <UploadForm
                    type="audio"
                    closeModal={() => {
                      setOpenModal(false);
                    }}
                  />
                )}
                {selectedType === "Youtube" && (
                  <YoutubeUrlForm
                    closeModal={() => {
                      setOpenModal(false);
                    }}
                  />
                )}
                {selectedType === "Text" && (
                  <TextForm
                    closeModal={() => {
                      setOpenModal(false);
                    }}
                  />
                )}
                {selectedType === "URL" && (
                  <UrlForm
                    closeModal={() => {
                      setOpenModal(false);
                    }}
                  />
                )}

                {/* <UploadImageForm /> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CreateNoteModal;
