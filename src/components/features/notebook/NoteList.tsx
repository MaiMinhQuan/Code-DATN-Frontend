"use client"

import { NoteCard } from "./NoteCard"
import { UI_TEXT } from "@/constants/ui-text"
import type { Note } from "@/types/notebook.types"

const T = UI_TEXT.NOTEBOOK

interface NoteListProps {
  notes: Note[]
  isLoading: boolean
  activeNoteId: string | null
  onSelect: (note: Note) => void
  onDelete: (id: string) => void
}

export function NoteList({ notes, isLoading, activeNoteId, onSelect, onDelete }: NoteListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <p className="text-sm text-muted-foreground">{T.EMPTY_LIST}</p>
        <p className="text-xs text-muted-foreground/60">{T.EMPTY_LIST_HINT}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 p-3">
      {notes.map((note) => (
        <NoteCard
          key={note._id}
          note={note}
          isActive={note._id === activeNoteId}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
