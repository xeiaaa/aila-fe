import { Card, Typography, Flex, Progress } from "antd";
import { CloudOutlined } from "@ant-design/icons";
import useNoteContext from "../context/useNoteContext";
import { useMemo } from "react";

const NoteSidebar = () => {
  const { notes, setSelectedNote, selectedNote, memorySize } = useNoteContext();

  const conicColors = {
    "0%": "#4285F4",
    "70%": "#FBBC05",
    "100%": "#EA4335",
  };

  const convertSizeToPercentage = useMemo(() => {
    if (!memorySize) return 0;
    const totalSizeGB = 10;
    const [value, unit] = memorySize.trim().split(" ");
    let bytes = parseFloat(value);

    switch (unit) {
      case "GB":
        bytes *= 1024 * 1024 * 1024;
        break;
      case "MB":
        bytes *= 1024 * 1024;
        break;
      case "KB":
        bytes *= 1024;
        break;
      case "B":
        break;
      default:
        return 0;
    }

    const totalBytes = totalSizeGB * 1024 * 1024 * 1024;
    const percentage = (bytes / totalBytes) * 100;
    return Math.ceil(percentage);
  }, [memorySize]);

  return (
    (notes || []) && (
      <div className="relative sm:mt-5 sm:mx-5 p-0 dark:bg-secondaryDark h-full">
        <Flex vertical className="p-5 md:p-0 h-full">
          {(notes || []).map((note) => (
            <Card
              key={note._id}
              style={{
                cursor: "pointer",
                padding: "0",
                display: "flex",
                alignItems: "center",
                height: "40px",
                border: 0,
              }}
              className={`rounded-lg ${
                selectedNote && note._id === selectedNote._id
                  ? "bg-gray-200 hover:bg-gray-200 dark:bg-tertiaryDark"
                  : "bg-transparent hover:bg-gray-200 hover:dark:bg-tertiaryDark"
              }`}
              onClick={() => {
                setSelectedNote(note);
              }}
            >
              <Typography.Title
                level={5}
                className="!mb-0 truncate w-[11rem] dark:text-textDark"
              >
                {note.title}
              </Typography.Title>
            </Card>
          ))}
        </Flex>

        <Flex
          className="absolute bottom-5 bg-white lg:bg-background px-5 pb-5 md:px-0 md:py-5 w-full z-10 dark:bg-secondaryDark"
          vertical
        >
          <Flex gap={5}>
            <CloudOutlined className="text-primary text-lg" />
            <p className="dark:text-textDark">Storage</p>
            <p className="dark:text-gray-400">({convertSizeToPercentage}%)</p>
          </Flex>
          <Progress
            percent={convertSizeToPercentage}
            size="small"
            strokeColor={conicColors}
            className="m-0 dark:text-gray-400 w-full"
            format={() => ""}
          />
          <Flex justify="space-between" className="w-full">
            <p className="dark:text-gray-400">{memorySize} of 10 GB used</p>
          </Flex>
        </Flex>
      </div>
    )
  );
};

export default NoteSidebar;
