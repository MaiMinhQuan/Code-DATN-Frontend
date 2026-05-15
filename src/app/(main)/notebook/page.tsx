// Trang notebook dạng 2 cột: sidebar collection và danh sách note theo bộ lọc.
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

/*
Component NotebookPage.

Output:
- Quản lý note/collection, lọc theo collection và mở modal tạo/sửa note.
*/
export default function NotebookPage() {
  // null = tất cả note; "none" = chưa phân loại; còn lại là collectionId
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [modalOpen,    setModalOpen]    = useState(false)
  const [editingNote,  setEditingNote]  = useState<Note | null>(null)

  const { data: notes       = [], isLoading } = useNotes(activeFilter ?? undefined)
  const { data: collections = [] }            = useNoteCollections()

  const createNote = useCreateNote()
  const updateNote = useUpdateNote()
  const deleteNote = useDeleteNote()

  // True khi mutation tạo/sửa note đang chạy
  const isSaving = createNote.isPending || updateNote.isPending

  /*
  Mở modal note.

  Input:
  - note — note cần sửa; truyền null để mở chế độ tạo mới.

  Output:
  - Mở modal với state phù hợp theo mode tạo/sửa.
  */
  const openModal = (note: Note | null) => {
    setEditingNote(note)
    setModalOpen(true)
  }

  /*
  Đóng modal note.

  Output:
  - Tắt modal và reset trạng thái chỉnh sửa.
  */
  const closeModal = () => {
    setModalOpen(false)
    setEditingNote(null)
  }

  /*
  Lưu note từ dữ liệu form modal.

  Input:
  - data — payload tạo/sửa note.

  Output:
  - Cập nhật note hiện có hoặc tạo note mới, rồi đóng modal khi thành công.
  */
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

  /*
  Xóa note theo ID.

  Input:
  - id — ID note cần xóa.

  Output:
  - Gọi mutation xóa sau khi người dùng xác nhận.
  */
  const handleDelete = (id: string) => {
    if (!window.confirm(T.DELETE_CONFIRM)) return
    deleteNote.mutate(id)
  }

  // Nhãn header thay đổi theo filter đang active
  const filterLabel = (() => {
    if (activeFilter === null)   return T.FILTER_ALL
    if (activeFilter === "none") return T.FILTER_UNCATEGORIZED
    return collections.find((c) => c._id === activeFilter)?.name ?? ""
  })()

  // Prefill collection trong modal khi đang đứng ở filter collection cụ thể
  const defaultCollectionId =
    activeFilter && activeFilter !== "none" ? activeFilter : null

  return (
    // Layout 2 cột full-height; -m-6 để bù padding trang cha
    <div className="-m-6 flex" style={{ height: "calc(100vh - 4rem)" }}>

      {/* Cột trái: sidebar collection */}
      <aside className="w-72 shrink-0 overflow-y-auto border-r border-border">
        <CollectionSidebar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </aside>

      {/* Cột phải: header + danh sách note */}
      <main className="flex flex-1 flex-col overflow-hidden">

        {/* Header với tên filter hiện tại và nút tạo note */}
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

        {/* Danh sách note có thể cuộn */}
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

      {/* Modal tạo/sửa note */}
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
