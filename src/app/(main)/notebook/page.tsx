"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { useNotes, useCreateNote, useUpdateNote, useDeleteNote } from "@/hooks/useNotebook"
import { useNoteCollections } from "@/hooks/useNoteCollections"
import { CollectionSidebar } from "@/components/features/notebook/CollectionSidebar"
import { NoteList }          from "@/components/features/notebook/NoteList"
import { NoteFormModal }     from "@/components/features/notebook/NoteFormModal"
import { UI_TEXT }           from "@/constants/ui-text"
import type { Note, CreateNotePayload, UpdateNotePayload } from "@/types/notebook.types"

const T = UI_TEXT.NOTEBOOK

export default function NotebookPage() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [modalOpen,    setModalOpen]    = useState(false)
  const [editingNote,  setEditingNote]  = useState<Note | null>(null)

  const { data: notes       = [], isLoading } = useNotes(activeFilter ?? undefined)
  const { data: collections = [] }            = useNoteCollections()

  const createNote = useCreateNote()
  const updateNote = useUpdateNote()
  const deleteNote = useDeleteNote()

  const isSaving = createNote.isPending || updateNote.isPending

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const openModal = (note: Note | null) => {
    setEditingNote(note)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingNote(null)
  }

  const handleSave = (data: CreateNotePayload | UpdateNotePayload) => {
    if (editingNote) {
      updateNote.mutate(
        { id: editingNote._id, payload: data as UpdateNotePayload },
        { onSuccess: closeModal }
      )
    } else {
      createNote.mutate(data as CreateNotePayload, { onSuccess: closeModal })
    }
  }

  const handleDelete = (id: string) => {
    if (!window.confirm(T.DELETE_CONFIRM)) return
    deleteNote.mutate(id)
  }

  // ── Header label ─────────────────────────────────────────────────────────────

  const filterLabel = (() => {
    if (activeFilter === null)   return T.FILTER_ALL
    if (activeFilter === "none") return T.FILTER_UNCATEGORIZED
    return collections.find((c) => c._id === activeFilter)?.name ?? ""
  })()

  // ── defaultCollectionId for modal ────────────────────────────────────────────
  // Nếu đang xem bộ cụ thể → pre-fill bộ đó; ngược lại không pre-fill
  const defaultCollectionId =
    activeFilter && activeFilter !== "none" ? activeFilter : null

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="-m-6 flex" style={{ height: "calc(100vh - 4rem)" }}>

      {/* Cột trái — Sidebar */}
      <aside className="w-72 shrink-0 overflow-y-auto border-r border-border">
        <CollectionSidebar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </aside>

      {/* Cột phải — Main content */}
      <main className="flex flex-1 flex-col overflow-hidden">

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-3">
          <h2 className="text-base font-semibold text-foreground">{filterLabel}</h2>
          <button
            onClick={() => openModal(null)}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" />
            {T.BTN_NEW_NOTE}
          </button>
        </div>

        {/* Danh sách ghi chú */}
        <div className="flex-1 overflow-y-auto">
          <NoteList
            notes={notes}
            isLoading={isLoading}
            collections={collections}
            onEdit={openModal}
            onDelete={handleDelete}
          />
        </div>

      </main>

      {/* Modal soạn thảo */}
      <NoteFormModal
        open={modalOpen}
        note={editingNote ?? undefined}
        defaultCollectionId={defaultCollectionId}
        isSaving={isSaving}
        onClose={closeModal}
        onSave={handleSave}
      />

    </div>
  )
}
