"use client"

import { Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { UI_TEXT } from "@/constants/ui-text"
import type { Note } from "@/types/notebook.types"

const T = UI_TEXT.NOTEBOOK

interface NoteCardProps {
  note: Note
  isActive: boolean               // card đang được chọn
  onSelect: (note: Note) => void  // click vào card
  onDelete: (id: string) => void  // click nút xóa
}

export function NoteCard({ note, isActive, onSelect, onDelete }: NoteCardProps) {
  // format date: createdAt → "26/04/2025"
  const date = new Date(note.createdAt).toLocaleDateString("vi-VN")

  return (
    <div
      onClick={() => onSelect(note)}
      className={cn(
        "group cursor-pointer rounded-xl border p-4 transition-all",
        isActive
          ? "border-primary/40 bg-primary/5"
          : "border-border bg-card hover:bg-muted/50"
      )}
    >
      {/* Title + delete button */}
      <div className="flex items-start justify-between gap-2">
        <p className="line-clamp-1 text-sm font-semibold text-foreground">
          {note.title || T.UNTITLED}
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation()  // ← quan trọng: không trigger onSelect
            onDelete(note._id)
          }}
          className="shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Preview nội dung */}
      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        {note.userDraftNote}
      </p>

      {/* Ngày tạo */}
      <p className="mt-2 text-[11px] text-muted-foreground/60">{date}</p>
    </div>
  )
}
