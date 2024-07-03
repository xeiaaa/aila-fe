import { useContext, useState, useEffect } from "react";
import { NoteContext } from "../context/note-provider";
import { Input, Flex, Typography, List, Button, message } from "antd";
import { SearchOutlined, CaretRightOutlined } from "@ant-design/icons";

const { Title } = Typography;

const History = () => {
  const { notes, selectedNote, setSelectedNote, accessHistory } =
    useContext(NoteContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState([]);

  useEffect(() => {
    const filtered = notes.filter((note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredNotes(filtered);
  }, [searchQuery, notes]);

  const handleDeleteHistoryBelow = () => {
    setFilteredNotes([]);
    message.success("History deleted successfully!");
  };

  const handleNoteClick = (note) => {
    if (selectedNote && selectedNote._id === note._id) {
      setSelectedNote(null);
    } else {
      setSelectedNote(note);
    }
  };

  return (
    <Flex className="justify-center py-7">
      <Flex className="w-10/12" vertical>
        <Title type="secondary" level={5} className="dark:text-textDark">
          Search History
        </Title>
        <Flex className="flex flex-col sm:flex-row justify-center sm:justify-between items-center mt-3">
          <Input
            size="medium"
            placeholder="Type a keyword"
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-5 w-fit rounded-full dark:bg-tertiaryDark dark:border-borderDark dark:text-textDark"
          />
          <Button
            type="primary"
            danger
            onClick={handleDeleteHistoryBelow}
            className="mb-3 dark:bg-red-800"
          >
            Delete history below
          </Button>
        </Flex>
        <List
          bordered
          dataSource={filteredNotes}
          renderItem={(note) => (
            <List.Item
              onClick={() => handleNoteClick(note)}
              className={`cursor-pointer dark:text-textDark ${
                selectedNote && selectedNote._id === note._id ? "selected" : ""
              }`}
            >
              {accessHistory[note._id] && (
                <span>
                  {new Date(accessHistory[note._id]).toLocaleString()}
                </span>
              )}
              <CaretRightOutlined className="text-gray-300 mx-2 dark:text-gray-500" />
              {note.title}
            </List.Item>
          )}
          className="dark:bg-secondaryDark dark:border-borderDark"
        />
      </Flex>
    </Flex>
  );
};
export default History;
