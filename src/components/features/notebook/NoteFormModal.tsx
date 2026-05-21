// Modal tạo/chỉnh sửa note với chọn collection.
"use client"

import { useState, useEffect, useRef } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { X, Loader2, ChevronDown, Check } from "lucide-react"
import { UI_TEXT } from "@/constants/ui-text"
import { useNoteCollections } from "@/hooks/useNoteCollections"
import { RichTextEditor } from "@/components/ui/RichTextEditor"
import { cn } from "@/lib/utils"
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
  const [title,           setTitle]           = useState("")
  const [content,         setContent]         = useState("")
  const [collectionId,    setCollectionId]    = useState<string>("")
  const [dropdownOpen,    setDropdownOpen]    = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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
  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").trim()

  const handleSave = () => {
    if (!stripHtml(content)) return
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
            <span className="shrink-0 text-xs text-muted-foreground">{T.COLLECTION_FIELD}:</span>
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs text-foreground transition-colors hover:bg-muted focus:outline-none"
              >
                {collectionId ? (
                  <>
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: collections.find(c => c._id === collectionId)?.color }}
                    />
                    <span>{collections.find(c => c._id === collectionId)?.name}</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">{T.COLLECTION_NONE}</span>
                )}
                <ChevronDown className={cn("h-3 w-3 text-muted-foreground transition-transform", dropdownOpen && "rotate-180")} />
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute left-0 top-full z-20 mt-1 min-w-44 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                    {/* Không có bộ */}
                    <button
                      type="button"
                      onClick={() => { setCollectionId(""); setDropdownOpen(false) }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted"
                    >
                      <span className="h-2 w-2 shrink-0 rounded-full border border-border" />
                      <span className="flex-1 text-left">{T.COLLECTION_NONE}</span>
                      {!collectionId && <Check className="h-3 w-3 text-primary" />}
                    </button>

                    {collections.length > 0 && (
                      <div className="mx-2 my-1 border-t border-border" />
                    )}

                    {collections.map((c) => (
                      <button
                        key={c._id}
                        type="button"
                        onClick={() => { setCollectionId(c._id); setDropdownOpen(false) }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-xs text-foreground transition-colors hover:bg-muted"
                      >
                        <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: c.color }} />
                        <span className="flex-1 truncate text-left">{c.name}</span>
                        {collectionId === c._id && <Check className="h-3 w-3 text-primary" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
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

          {/* Editor nội dung note với formatting */}
          <div className="flex flex-1 min-h-0 flex-col px-3 py-2">
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder={T.PLACEHOLDER_CONTENT}
              grow
            />
          </div>

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
