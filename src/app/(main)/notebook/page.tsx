"use client"

import { useState } from "react"
import { Allotment } from "allotment"
import "allotment/dist/style.css"
import { Plus, StickyNote } from "lucide-react"

import { useNotes, useCreateNote, useUpdateNote, useDeleteNote } from "@/hooks/useNotebook"
import { NoteList }   from "@/components/features/notebook/NoteList"
import { NoteEditor } from "@/components/features/notebook/NoteEditor"
import { UI_TEXT }    from "@/constants/ui-text"
import type { Note }  from "@/types/notebook.types"

const T = UI_TEXT.NOTEBOOK

export default function NotebookPage() {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isCreating,   setIsCreating]   = useState(false)

  // ── Queries ──────────────────────────────────────────────────────────────────
  const { data: notes = [], isLoading } = useNotes()

  // ── Mutations ────────────────────────────────────────────────────────────────
  const createNote = useCreateNote()
  const updateNote = useUpdateNote()
  const deleteNote = useDeleteNote()

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleSelectNote = (note: Note) => {
    setSelectedNote(note)
    setIsCreating(false)
  }

  const handleNewNote = () => {
    setSelectedNote(null)
    setIsCreating(true)
  }

  const handleSave = (data: { title: string; userDraftNote: string }) => {
    if (isCreating) {
      createNote.mutate(data, {
        onSuccess: (newNote) => {
          setSelectedNote(newNote)  // chuyển sang edit mode của note vừa tạo
          setIsCreating(false)
        },
      })
    } else if (selectedNote) {
      updateNote.mutate({ id: selectedNote._id, payload: data })
    }
  }

  const handleDelete = (id: string) => {
    if (!window.confirm(T.DELETE_CONFIRM)) return
    deleteNote.mutate(id, {
      onSuccess: () => {
        if (selectedNote?._id === id) {
          setSelectedNote(null)   // xóa note đang mở → về empty state
          setIsCreating(false)
        }
      },
    })
  }

  // ── Right panel content ──────────────────────────────────────────────────────
  const showEditor  = isCreating || selectedNote !== null
  const isSaving    = createNote.isPending || updateNote.isPending

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="-m-6" style={{ height: "calc(100vh - 4rem)" }}>
      <Allotment>

        {/* Panel trái: danh sách ghi chú */}
        <Allotment.Pane minSize={260} maxSize={400} preferredSize={300}>
          <div className="flex h-full flex-col border-r border-border">

            {/* Header */}
            <div className="flex shrink-0 items-center justify-between px-4 py-3 border-b border-border">
              <div>
                <h1 className="text-sm font-bold text-foreground">{T.PAGE_TITLE}</h1>
                <p className="text-xs text-muted-foreground">{notes.length} {T.NOTE_COUNT_LABEL}</p>
              </div>
              <button
                onClick={handleNewNote}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                {T.BTN_NEW_NOTE}
              </button>
            </div>

            {/* Danh sách */}
            <div className="flex-1 overflow-y-auto">
              <NoteList
                notes={notes}
                isLoading={isLoading}
                activeNoteId={selectedNote?._id ?? null}
                onSelect={handleSelectNote}
                onDelete={handleDelete}
              />
            </div>

          </div>
        </Allotment.Pane>

        {/* Panel phải: editor hoặc empty state */}
        <Allotment.Pane minSize={400}>
          <div className="h-full overflow-hidden">
            {showEditor ? (
              <NoteEditor
                key={selectedNote?._id ?? "new"}  // ← reset form khi đổi note
                initialNote={selectedNote ?? undefined}
                isSaving={isSaving}
                onSave={handleSave}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <StickyNote className="h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">{T.EMPTY_SELECT}</p>
                <p className="text-xs text-muted-foreground/60">{T.EMPTY_SELECT_HINT}</p>
              </div>
            )}
          </div>
        </Allotment.Pane>

      </Allotment>
    </div>
  )
}
