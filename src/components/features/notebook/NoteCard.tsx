// Item hiển thị một ghi chú trong danh sách notebook.
"use client"

import { useState } from "react"
import { MoreHorizontal } from "lucide-react"
import { UI_TEXT } from "@/constants/ui-text"
import type { Note } from "@/types/notebook.types"

const T = UI_TEXT.NOTEBOOK

interface NoteCardProps {
  // Dữ liệu note cần hiển thị.
  note: Note
  // Màu của collection chứa note (nếu có).
  collectionColor?: string
  // Callback mở note để chỉnh sửa.
  onEdit: (note: Note) => void
  // Callback xóa note theo id.
  onDelete: (id: string) => void
}

/*
Component item note.

Input:
- note — dữ liệu note.
- collectionColor — màu collection của note (optional).
- onEdit — hàm xử lý sửa note.
- onDelete — hàm xử lý xóa note.

Output:
- Hàng note có preview nội dung và menu thao tác.
*/
export function NoteCard({ note, collectionColor, onEdit, onDelete }: NoteCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const date = new Date(note.createdAt).toLocaleDateString("vi-VN")

  return (
    <div
      onClick={() => onEdit(note)}
      className="group relative cursor-pointer border-b border-border px-5 py-4 transition-colors hover:bg-muted/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-2.5">
          {/* Chấm màu collection */}
          {collectionColor && (
            <span
              className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: collectionColor }}
            />
          )}

          <div className="min-w-0 flex-1">
            <p className="line-clamp-1 text-sm font-semibold text-foreground">
              {note.title || T.UNTITLED}
            </p>
            {/* Dòng preview nội dung note */}
            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
              {note.userDraftNote}
            </p>
            <p className="mt-1.5 text-[11px] text-muted-foreground/60">{date}</p>
          </div>
        </div>

        {/* Nút mở menu ngữ cảnh */}
        <div className="relative shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
            className="rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {menuOpen && (
            <>
              {/* Overlay bắt click ngoài để đóng menu */}
              <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setMenuOpen(false) }} />
              <div className="absolute right-0 top-7 z-20 min-w-36 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(note); setMenuOpen(false) }}
                  className="flex w-full items-center px-3 py-2 text-sm hover:bg-muted"
                >
                  {T.MENU_EDIT}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(note._id); setMenuOpen(false) }}
                  className="flex w-full items-center px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  {T.MENU_DELETE}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
