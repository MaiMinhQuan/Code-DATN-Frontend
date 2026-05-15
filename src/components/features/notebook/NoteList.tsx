// Danh sách note trong notebook, kèm loading và empty state.
"use client"

import { useMemo } from "react"
import { StickyNote } from "lucide-react"
import { NoteCard } from "./NoteCard"
import { UI_TEXT } from "@/constants/ui-text"
import type { Note, NoteCollection } from "@/types/notebook.types"

const T = UI_TEXT.NOTEBOOK

interface NoteListProps {
  // Danh sách note cần hiển thị.
  notes: Note[]
  // Trạng thái tải dữ liệu note.
  isLoading: boolean
  // Danh sách collection để map màu.
  collections: NoteCollection[]
  // Callback mở note để chỉnh sửa.
  onEdit: (note: Note) => void
  // Callback xóa note theo id.
  onDelete: (id: string) => void
}

/*
Component danh sách note.

Input:
- notes — danh sách note.
- isLoading — trạng thái tải.
- collections — danh sách collection.
- onEdit — hàm xử lý sửa note.
- onDelete — hàm xử lý xóa note.

Output:
- Danh sách `NoteCard`, skeleton hoặc empty state tương ứng.
*/
export function NoteList({ notes, isLoading, collections, onEdit, onDelete }: NoteListProps) {
  // Map nhanh collectionId -> color để truyền xuống từng NoteCard
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
          // Lấy màu collection từ map đã memo
          collectionColor={note.collectionId ? colorMap[note.collectionId] : undefined}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
