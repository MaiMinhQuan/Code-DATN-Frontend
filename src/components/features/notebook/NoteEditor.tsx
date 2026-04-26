"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { UI_TEXT } from "@/constants/ui-text"
import type { Note } from "@/types/notebook.types"

const T = UI_TEXT.NOTEBOOK

interface NoteEditorProps {
  initialNote?: Note              // undefined = tạo mới, có giá trị = edit
  isSaving: boolean               // mutation đang chạy
  onSave: (data: { title: string; userDraftNote: string }) => void
}

export function NoteEditor({ initialNote, isSaving, onSave }: NoteEditorProps) {
  const [title, setTitle]     = useState(initialNote?.title ?? "")
  const [content, setContent] = useState(initialNote?.userDraftNote ?? "")

  // Khi chuyển sang note khác → reset form
  useEffect(() => {
    setTitle(initialNote?.title ?? "")
    setContent(initialNote?.userDraftNote ?? "")
  }, [initialNote?._id])

  const handleSave = () => {
    if (!content.trim()) return
    onSave({ title: title.trim(), userDraftNote: content })
  }

  return (
    <div className="flex h-full flex-col gap-3 p-5">
      {/* Title input */}
      <input
        type="text"
        placeholder={T.PLACEHOLDER_TITLE}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
      />

      {/* Content textarea */}
      <textarea
        placeholder={T.PLACEHOLDER_CONTENT}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 resize-none rounded-lg border border-border bg-card p-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
      />

      {/* Save button */}
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
