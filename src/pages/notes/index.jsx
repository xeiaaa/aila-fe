import NoteSidebar from "../../components/NoteSidebar";
import NoteMainContent from "../../components/NoteMainContent";
import NoteChatSidebar from "../../components/NoteChatSidebar";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import useNoteContext from "../../context/useNoteContext";
import { useWindowSize } from "../../hooks/useWindowSize";

function Notes() {
  const [showNoteTab, setShowNoteTab] = useState(false);
  const toggleNoteTab = () => setShowNoteTab((prev) => !prev);
  const { selectedNote } = useNoteContext();

  const [showChatTab, setShowChatTab] = useState(false);
  const toggleChatTab = () => setShowChatTab((prev) => !prev);
  const { width: screenWidth } = useWindowSize();
  useEffect(() => {
    if (screenWidth > 640) {
      setShowNoteTab(true);
      setShowChatTab(true);
    }
  }, [screenWidth]);

  return (
    <div className="relative z-0 flex h-full w-full overflow-hidden">
      {/* Note Sidebar */}
      <Sidebar showTab={showNoteTab} width="264px" toggleTab={toggleNoteTab}>
        <NoteSidebar />
      </Sidebar>
      {/* Content */}
      <NoteMainContent
        showNoteTab={showNoteTab}
        showChatTab={showChatTab}
        toggleNoteTab={toggleNoteTab}
        toggleChatTab={toggleChatTab}
      />
      {/* Chat Sidebar*/}
      {selectedNote && (
        <Sidebar
          showTab={showChatTab}
          width="280px"
          toggleTab={toggleChatTab}
          position="bottom"
        >
          <NoteChatSidebar toggleTab={toggleChatTab} />
        </Sidebar>
      )}
    </div>
  );
}

export default Notes;
