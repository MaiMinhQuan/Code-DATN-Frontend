// Trình soạn thảo note đơn giản (title + content + save).
"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { UI_TEXT } from "@/constants/ui-text"
import type { Note } from "@/types/notebook.types"

const T = UI_TEXT.NOTEBOOK

interface NoteEditorProps {
  // Note ban đầu để prefill khi sửa (optional).
  initialNote?: Note
  // Trạng thái đang lưu note.
  isSaving: boolean
  // Callback lưu note.
  onSave: (data: { title: string; userDraftNote: string }) => void
}

/*
Component editor note.

Input:
- initialNote — dữ liệu note ban đầu (optional).
- isSaving — trạng thái lưu.
- onSave — hàm nhận dữ liệu khi lưu.

Output:
- Form nhập title/content và nút lưu hoặc tạo mới.
*/
export function NoteEditor({ initialNote, isSaving, onSave }: NoteEditorProps) {
  const [title,   setTitle]   = useState(initialNote?.title ?? "")
  const [content, setContent] = useState(initialNote?.userDraftNote ?? "")

  // Đồng bộ lại form khi chuyển sang note khác
  useEffect(() => {
    setTitle(initialNote?.title ?? "")
    setContent(initialNote?.userDraftNote ?? "")
  }, [initialNote?._id])

  /*
  Xử lý lưu note từ dữ liệu form hiện tại.

  Output:
  - Gọi onSave khi nội dung note hợp lệ.
  */
  const handleSave = () => {
    if (!content.trim()) return
    onSave({ title: title.trim(), userDraftNote: content })
  }

  return (
    <div className="flex h-full flex-col gap-3 p-5">
      {/* Input tiêu đề */}
      <input
        type="text"
        placeholder={T.PLACEHOLDER_TITLE}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
      />

      {/* Textarea nội dung note */}
      <textarea
        placeholder={T.PLACEHOLDER_CONTENT}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 resize-none rounded-lg border border-border bg-card p-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
      />

      {/* Nút lưu/tạo note */}
      <button
        onClick={handleSave}
        disabled={isSaving || !content.trim()}
        className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-50"
      >
        {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
        {initialNote ? T.BTN_SAVE : T.BTN_CREATE}
      </button>
    </div>
  )
}
