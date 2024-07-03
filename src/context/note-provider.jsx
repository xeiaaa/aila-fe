import { createContext, useEffect, useState } from "react";
import authAxios from "../api/authAxios";
import { API_URL } from "../config";
import { useQuery } from "@tanstack/react-query";

export const NoteContext = createContext();

export function NoteProvider({ children }) {
  const [selectedNote, setSelectedNote] = useState(null);
  const [accessHistory, setAccessHistory] = useState({});

  const { data: notes } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const filter = JSON.stringify({ isArchived: false });
      const { data } = await authAxios.get(
        `${API_URL}/notes?limit=1000&filter=${filter}`
      );
      return data.results;
    },
  });

  const { data: me } = useQuery({
    queryKey: ["getMe"],
    queryFn: async () => {
      const { data } = await authAxios.get(`${API_URL}/auth/me`);
      return data;
    },
  });

  useEffect(() => {
    if (Array.isArray(notes) && notes.length > 0 && !selectedNote) {
      setSelectedNote(notes[0]);
    }
  }, [notes, selectedNote]);

  useEffect(() => {
    localStorage.setItem("accessHistory", JSON.stringify(accessHistory));
  }, [accessHistory]);

  useEffect(() => {
    if (selectedNote) {
      setAccessHistory((prevHistory) => ({
        ...prevHistory,
        [selectedNote._id]: new Date().toISOString(),
      }));
    }
  }, [selectedNote]);

  const value = {
    notes: notes || [],
    selectedNote,
    setSelectedNote: (note) => {
      setSelectedNote(note);
    },
    accessHistory,
    memorySize: (me && me.memorySize) || "0 KB",
  };

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
}
