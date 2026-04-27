"use client"

import { useMemo } from "react"
import { StickyNote } from "lucide-react"
import { NoteCard } from "./NoteCard"
import { UI_TEXT } from "@/constants/ui-text"
import type { Note, NoteCollection } from "@/types/notebook.types"

const T = UI_TEXT.NOTEBOOK

interface NoteListProps {
  notes: Note[]
  isLoading: boolean
  collections: NoteCollection[]
  onEdit: (note: Note) => void
  onDelete: (id: string) => void
}

export function NoteList({ notes, isLoading, collections, onEdit, onDelete }: NoteListProps) {
  const colorMap = useMemo(
    () => Object.fromEntries(collections.map((c) => [c._id, c.color])),
    [collections]
  )

  if (isLoading) {
    return (
      <div className="flex flex-col">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border-b border-border px-5 py-4">
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-3 w-full animate-pulse rounded bg-muted" />
            <div className="mt-2 h-3 w-1/4 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    )
  }

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <StickyNote className="h-10 w-10 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">{T.EMPTY_LIST}</p>
        <p className="text-xs text-muted-foreground/60">{T.EMPTY_LIST_HINT}</p>
      </div>
    )
  }

  return (
    <div>
      {notes.map((note) => (
        <NoteCard
          key={note._id}
          note={note}
          collectionColor={note.collectionId ? colorMap[note.collectionId] : undefined}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
