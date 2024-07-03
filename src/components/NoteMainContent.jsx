import { Button, Empty, Flex, Tooltip } from "antd";

import useNoteContext from "../context/useNoteContext";
import Note from "./Note";
import CreateNoteModal from "./CreateNoteModal";
import { LeftOutlined } from "@ant-design/icons";
import { RiRobot2Line } from "react-icons/ri";
import EmptyStateCreateNoteButton from "./EmptyStateCreateNoteButton";

const NoteMainContent = ({
  showNoteTab,
  showChatTab,
  toggleNoteTab,
  toggleChatTab,
}) => {
  const { notes, setSelectedNote, selectedNote } = useNoteContext();

  return (
    <>
      <div className="flex p-8 relative overflow-auto w-full">
        {/* overflow-auto */}
        {(notes || []).length > 0 ? (
          selectedNote ? (
            <Note note={selectedNote} setNote={setSelectedNote} />
          ) : (
            <Flex
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <Empty
                imageStyle={{ height: 160 }}
                description={<span>Please select a note</span>}
              ></Empty>
            </Flex>
          )
        ) : (
          <Flex
            style={{
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
            }}
            vertical
          >
            <Flex
              id="create-note"
              className="w-full justify-center items-center flex-col sm:flex-row"
              gap={15}
            >
              <CreateNoteModal />
              {/* <CreateFolderMainContent /> */}
            </Flex>
            <Flex
              vertical
              gap={20}
              className="w-full md:w-[28.063rem] justify-center items-center h-full"
            >
              <Empty
                description={<span>There are no notes</span>}
                className="flex flex-col justify-center items-center"
              >
                <div className="hidden sm:block">
                  <EmptyStateCreateNoteButton />
                </div>
              </Empty>
            </Flex>
          </Flex>
        )}
        <div className="fixed left-0 top-1/2 z-40" onClick={toggleNoteTab}>
          {showNoteTab ? (
            <Tooltip title="Close sidebar" placement="right" color={"#2db7f5"}>
              <div
                className="hidden sm:block py-4 px-0.5 rounded-r-2xl cursor-pointer bg-background dark:bg-secondaryDark border-t-2 border-r-2 border-b-2 border-l-0 border-solid border-t-secondary border-r-secondary border-b-secondary dark:border-borderDark"
                style={{
                  transform:
                    "translateX(272px) translateY(-50%) rotate(0deg) translateZ(0px)",
                }}
              >
                <LeftOutlined className="text-[#C5C9CA] text-xs" />
              </div>
            </Tooltip>
          ) : (
            <Tooltip title="Open sidebar" placement="right" color={"#2db7f5"}>
              <div
                className="py-5 px-0.5 rounded-l-2xl cursor-pointer bg-background dark:bg-secondaryDark border-t-2 border-l-2 border-b-2 border-r-0 border-solid border-t-secondary border-l-secondary border-b-secondary dark:border-borderDark"
                style={{
                  transform:
                    "translateX(0px) translateY(-50%) rotate(180deg) translateZ(0px)",
                }}
              >
                <LeftOutlined className="text-[#C5C9CA] text-xs" />
              </div>
            </Tooltip>
          )}
        </div>
        {selectedNote && (
          <div
            className="hidden sm:block fixed right-0 top-1/2 z-40"
            onClick={toggleChatTab}
          >
            {showChatTab ? (
              <Tooltip title="Close sidebar" placement="left" color={"#2db7f5"}>
                <div
                  className="flex flex-col py-4 px-2 rounded-l-2xl group cursor-pointer transform transition-transform ease-in-out duration-300 "
                  style={{
                    transform:
                      "translateX(-290px) translateY(-50%) translateZ(0px)",
                  }}
                >
                  <span className="bg-gray-200 group-hover:bg-gray-400 h-3.5 w-1 rounded-full group-hover:-rotate-[20deg] transition-transform ease-in-out duration-300 -mb-0.5 dark:bg-tertiaryDark"></span>
                  <span className="bg-gray-200 group-hover:bg-gray-400 h-3.5 w-1 rounded-full group-hover:rotate-[20deg] transition-transform ease-in-out duration-300 -mt-0.5 dark:bg-tertiaryDark"></span>
                </div>
              </Tooltip>
            ) : (
              <Tooltip title="Open sidebar" placement="left" color={"#2db7f5"}>
                <div
                  className="flex flex-col py-4 px-2 rounded-l-2xl group cursor-pointer transform transition-transform ease-in-out duration-300 "
                  style={{
                    transform:
                      "translateX(0px) translateY(-50%) translateZ(0px)",
                  }}
                >
                  <span className="bg-gray-200 group-hover:bg-gray-400 h-3.5 w-1 rounded-full rounded-bl-full rotate-[20deg] transition-transform ease-in-out duration-300 -mb-0.5 dark:bg-tertiaryDark"></span>
                  <span className="bg-gray-200 group-hover:bg-gray-400 h-3.5 w-1 rounded-full rounded-tl-full -rotate-[20deg] transition-transform ease-in-out duration-300 -mt-0.5 dark:bg-tertiaryDark"></span>
                </div>
              </Tooltip>
            )}
          </div>
        )}
      </div>
      <Button
        type="primary"
        className="sm:hidden flex justify-center items-center gap-2 absolute right-5 bottom-7 !bg-primaryHover active:!bg-primaryHover drop-shadow-lg border-none rounded-full text-white text-base !h-12"
        onClick={toggleChatTab}
      >
        <RiRobot2Line className="text-xl" />
        Chatbot
      </Button>
    </>
  );
};

export default NoteMainContent;
