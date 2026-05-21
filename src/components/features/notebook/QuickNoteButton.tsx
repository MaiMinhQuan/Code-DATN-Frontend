"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { PenLine, X, ChevronDown, Check, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useNoteCollections } from "@/hooks/useNoteCollections"
import { useCreateNote } from "@/hooks/useNotebook"
import { RichTextEditor } from "@/components/ui/RichTextEditor"

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").trim()

export function QuickNoteButton() {
  const [open,          setOpen]          = useState(false)
  const [title,         setTitle]         = useState("")
  const [content,       setContent]       = useState("")
  const [collectionId,  setCollectionId]  = useState("")
  const [dropdownOpen,  setDropdownOpen]  = useState(false)

  const pathname = usePathname()

  const { data: collections = [] } = useNoteCollections()
  const createNote = useCreateNote()

  if (pathname === "/notebook") return null

  const selectedCollection = collections.find((c) => c._id === collectionId)

  const handleOpen = () => {
    setTitle("")
    setContent("")
    setCollectionId("")
    setDropdownOpen(false)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setDropdownOpen(false)
  }

  const handleSave = () => {
    if (!stripHtml(content)) return
    createNote.mutate(
      {
        title:         title.trim() || undefined,
        userDraftNote: content,
        collectionId:  collectionId || null,
      },
      {
        onSuccess: () => {
          toast.success("Đã lưu ghi chú vào Sổ tay")
          handleClose()
        },
      }
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Popover */}
      {open && (
        <>
          {/* Overlay bắt click ngoài */}
          <div className="fixed inset-0 z-40" onClick={handleClose} />

          <div className="absolute bottom-full right-0 z-50 mb-4 flex w-[420px] flex-col rounded-2xl border border-border bg-card shadow-2xl" style={{ height: "520px" }}>

            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
              <span className="text-sm font-semibold text-foreground">Ghi chú nhanh</span>
              <button
                onClick={handleClose}
                className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chọn bộ */}
            <div className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-2">
              <span className="shrink-0 text-xs text-muted-foreground">Bộ:</span>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs text-foreground transition-colors hover:bg-muted focus:outline-none"
                >
                  {selectedCollection ? (
                    <>
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: selectedCollection.color }}
                      />
                      <span>{selectedCollection.name}</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">Không có</span>
                  )}
                  <ChevronDown className={cn("h-3 w-3 text-muted-foreground transition-transform", dropdownOpen && "rotate-180")} />
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-[60]" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute left-0 top-full z-[70] mt-1 min-w-44 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                      <button
                        type="button"
                        onClick={() => { setCollectionId(""); setDropdownOpen(false) }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted"
                      >
                        <span className="h-2 w-2 shrink-0 rounded-full border border-border" />
                        <span className="flex-1 text-left">Không có</span>
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

            {/* Tiêu đề */}
            <div className="shrink-0 border-b border-border px-4 py-2.5">
              <input
                type="text"
                placeholder="Tiêu đề (tùy chọn)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>

            {/* Editor nội dung */}
            <div className="flex flex-1 min-h-0 flex-col px-3 py-2">
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Nội dung ghi chú..."
                grow
              />
            </div>

            {/* Footer */}
            <div className="flex shrink-0 items-center justify-end gap-2 border-t border-border px-4 py-3">
              <button
                onClick={handleClose}
                className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
              >
                Huỷ
              </button>
              <button
                onClick={handleSave}
                disabled={createNote.isPending || !stripHtml(content)}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-white transition-opacity disabled:opacity-50"
              >
                {createNote.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Lưu ghi chú
              </button>
            </div>
          </div>
        </>
      )}

      {/* FAB */}
      <button
        onClick={open ? handleClose : handleOpen}
        title="Ghi chú nhanh"
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all duration-200",
          open
            ? "bg-muted text-foreground hover:bg-muted/80"
            : "bg-primary text-white hover:bg-primary/90 hover:shadow-xl hover:scale-105"
        )}
      >
        {open ? <X className="h-5 w-5" /> : <PenLine className="h-5 w-5" />}
      </button>
    </div>
  )
}
