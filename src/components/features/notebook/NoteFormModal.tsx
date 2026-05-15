// Modal tạo/chỉnh sửa note với chọn collection.
"use client"

import { useState, useEffect } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { X, Loader2 } from "lucide-react"
import { UI_TEXT } from "@/constants/ui-text"
import { useNoteCollections } from "@/hooks/useNoteCollections"
import type { Note, CreateNotePayload, UpdateNotePayload } from "@/types/notebook.types"

const T = UI_TEXT.NOTEBOOK

interface NoteFormModalProps {
  // Trạng thái mở/đóng modal.
  open: boolean
  // Dữ liệu note khi ở chế độ sửa (optional).
  note?: Note
  // Collection mặc định khi mở modal tạo mới.
  defaultCollectionId?: string | null
  // Trạng thái đang lưu dữ liệu.
  isSaving: boolean
  // Callback đóng modal.
  onClose: () => void
  // Callback lưu dữ liệu form.
  onSave: (data: CreateNotePayload | UpdateNotePayload) => void
}

/*
Component modal form note.

Input:
- open — trạng thái mở modal.
- note — dữ liệu note cần sửa (optional).
- defaultCollectionId — collection mặc định (optional).
- isSaving — trạng thái lưu.
- onClose — callback đóng modal.
- onSave — callback lưu dữ liệu.

Output:
- Modal nhập tiêu đề, nội dung, collection và nút lưu.
*/
export function NoteFormModal({
  open,
  note,
  defaultCollectionId,
  isSaving,
  onClose,
  onSave,
}: NoteFormModalProps) {
  const [title,        setTitle]        = useState("")
  const [content,      setContent]      = useState("")
  const [collectionId, setCollectionId] = useState<string>("")

  const { data: collections = [] } = useNoteCollections()

  // Reset và prefill form mỗi lần modal mở
  useEffect(() => {
    if (open) {
      setTitle(note?.title ?? "")
      setContent(note?.userDraftNote ?? "")
      setCollectionId(note?.collectionId ?? defaultCollectionId ?? "")
    }
  }, [open, note?._id, defaultCollectionId])

  /*
  Xử lý submit dữ liệu form.

  Output:
  - Gọi onSave với payload đã normalize.
  */
  const handleSave = () => {
    if (!content.trim()) return
    onSave({
      title:         title.trim() || undefined,
      userDraftNote: content,
      collectionId:  collectionId || null,
    })
  }

  const isEdit = !!note

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex h-[540px] max-h-[90vh] w-[640px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl border border-border bg-card shadow-xl focus:outline-none">

          {/* Header modal */}
          <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-3">
            <Dialog.Title className="text-sm font-semibold text-foreground">
              {isEdit ? T.MODAL_TITLE_EDIT : T.MODAL_TITLE_CREATE}
            </Dialog.Title>
            <Dialog.Close className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          {/* Hàng chọn collection */}
          <div className="flex shrink-0 items-center gap-2 border-b border-border px-5 py-2">
            <span className="text-xs text-muted-foreground">{T.COLLECTION_FIELD}:</span>
            <div className="flex items-center gap-1.5">
              {collectionId && (
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: collections.find(c => c._id === collectionId)?.color,
                  }}
                />
              )}
              <select
                value={collectionId}
                onChange={(e) => setCollectionId(e.target.value)}
                className="bg-transparent text-xs text-foreground focus:outline-none"
              >
                <option value="">{T.COLLECTION_NONE}</option>
                {collections.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Input tiêu đề */}
          <div className="shrink-0 border-b border-border px-5 py-3">
            <input
              type="text"
              placeholder={T.PLACEHOLDER_TITLE}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          {/* Textarea nội dung note */}
          <textarea
            placeholder={T.PLACEHOLDER_CONTENT}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 resize-none bg-transparent px-5 py-4 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
          />

          {/* Footer với nút lưu */}
          <div className="flex shrink-0 justify-end border-t border-border px-5 py-3">
            <button
              onClick={handleSave}
              disabled={isSaving || !content.trim()}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-50"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? T.BTN_SAVE : T.BTN_CREATE}
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
