import { useContext } from 'react';
import { NoteContext } from './note-provider';

export default function useNoteContext() {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('useNoteContext must be used within a NoteContext');
  }
  return context;
}
