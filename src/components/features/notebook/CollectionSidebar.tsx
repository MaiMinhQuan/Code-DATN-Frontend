"use client"

import { useState } from "react"
import { Plus, MoreHorizontal, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { UI_TEXT } from "@/constants/ui-text"
import {
  useNoteCollections,
  useCreateCollection,
  useUpdateCollection,
  useDeleteCollection,
} from "@/hooks/useNoteCollections"

const T = UI_TEXT.NOTEBOOK

const PRESET_COLORS = [
  "#6366f1", "#10b981", "#ef4444", "#f59e0b",
  "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6",
]

interface CollectionSidebarProps {
  activeFilter: string | null
  onFilterChange: (filter: string | null) => void
}

function NavItem({
  label,
  filter,
  activeFilter,
  icon,
  onFilterChange,
}: {
  label: string
  filter: string | null
  activeFilter: string | null
  icon: React.ReactNode
  onFilterChange: (f: string | null) => void
}) {
  return (
    <button
      onClick={() => onFilterChange(filter)}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors text-left",
        activeFilter === filter
          ? "bg-primary/10 font-medium text-primary"
          : "text-foreground hover:bg-muted"
      )}
    >
      {icon}
      {label}
    </button>
  )
}

export function CollectionSidebar({ activeFilter, onFilterChange }: CollectionSidebarProps) {
  const { data: collections = [] } = useNoteCollections()
  const createCollection = useCreateCollection()
  const updateCollection = useUpdateCollection()
  const deleteCollection = useDeleteCollection()

  const [isCreating,  setIsCreating]  = useState(false)
  const [newName,     setNewName]     = useState("")
  const [newColor,    setNewColor]    = useState(PRESET_COLORS[0])
  const [renamingId,  setRenamingId]  = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState("")
  const [openMenuId,  setOpenMenuId]  = useState<string | null>(null)

  const handleCreate = () => {
    if (!newName.trim()) return
    createCollection.mutate(
      { name: newName.trim(), color: newColor },
      {
        onSuccess: () => {
          setIsCreating(false)
          setNewName("")
          setNewColor(PRESET_COLORS[0])
        },
      }
    )
  }

  const handleRename = (id: string) => {
    if (!renameValue.trim()) return
    updateCollection.mutate(
      { id, payload: { name: renameValue.trim() } },
      { onSuccess: () => setRenamingId(null) }
    )
  }

  const handleDelete = (id: string) => {
    if (!window.confirm(T.DELETE_COLLECTION_CONFIRM)) return
    deleteCollection.mutate(id, {
      onSuccess: () => {
        if (activeFilter === id) onFilterChange(null)
      },
    })
  }

  return (
    <div className="flex h-full flex-col px-3 py-4">
      <h1 className="mb-4 px-3 text-lg font-bold text-foreground">{T.PAGE_TITLE}</h1>

      {/* Mục cố định */}
      <nav className="flex flex-col gap-0.5">
        <NavItem
          label={T.FILTER_ALL}
          filter={null}
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
          icon={<span className="text-base">📋</span>}
        />
        <NavItem
          label={T.FILTER_UNCATEGORIZED}
          filter="none"
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
          icon={<span className="text-base">📁</span>}
        />
      </nav>

      {/* Danh sách collections */}
      <div className="mt-5 flex-1 overflow-y-auto">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {T.COLLECTIONS_LABEL}
        </p>

        <div className="flex flex-col gap-0.5">
          {collections.map((col) => (
            <div key={col._id} className="group relative">
              {renamingId === col._id ? (
                /* Inline rename input */
                <div className="flex items-center gap-1.5 rounded-lg bg-muted px-2 py-1.5">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: col.color }}
                  />
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter")  handleRename(col._id)
                      if (e.key === "Escape") setRenamingId(null)
                    }}
                    className="flex-1 bg-transparent text-sm text-foreground focus:outline-none"
                  />
                  <button onClick={() => handleRename(col._id)} className="text-primary">
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => setRenamingId(null)} className="text-muted-foreground">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                /* Collection item */
                <button
                  onClick={() => onFilterChange(col._id)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors text-left",
                    activeFilter === col._id
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: col.color }}
                  />
                  <span className="flex-1 truncate">{col.name}</span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation()
                      setOpenMenuId(openMenuId === col._id ? null : col._id)
                    }}
                    className="shrink-0 rounded p-0.5 opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100"
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </span>
                </button>
              )}

              {/* Dropdown menu */}
              {openMenuId === col._id && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                  <div className="absolute right-0 top-9 z-20 min-w-36 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                    <button
                      onClick={() => {
                        setRenamingId(col._id)
                        setRenameValue(col.name)
                        setOpenMenuId(null)
                      }}
                      className="flex w-full items-center px-3 py-2 text-sm hover:bg-muted"
                    >
                      {T.COLLECTION_RENAME}
                    </button>
                    <button
                      onClick={() => { handleDelete(col._id); setOpenMenuId(null) }}
                      className="flex w-full items-center px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      {T.COLLECTION_DELETE}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tạo bộ sưu tập mới */}
      <div className="shrink-0 pt-3">
        {isCreating ? (
          <div className="rounded-xl border border-border bg-muted/40 p-3">
            <input
              autoFocus
              placeholder="Tên bộ sưu tập..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter")  handleCreate()
                if (e.key === "Escape") { setIsCreating(false); setNewName("") }
              }}
              className="mb-2 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <div className="mb-2.5 flex flex-wrap gap-1.5">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setNewColor(c)}
                  className={cn(
                    "h-5 w-5 rounded-full transition-transform",
                    newColor === c && "scale-110 ring-2 ring-foreground ring-offset-1"
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                disabled={!newName.trim() || createCollection.isPending}
                className="flex-1 rounded-lg bg-primary py-1.5 text-xs font-medium text-white disabled:opacity-50"
              >
                Tạo
              </button>
              <button
                onClick={() => { setIsCreating(false); setNewName("") }}
                className="flex-1 rounded-lg border border-border py-1.5 text-xs text-muted-foreground hover:bg-muted"
              >
                Huỷ
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <Plus className="h-4 w-4" />
            {T.BTN_NEW_COLLECTION}
          </button>
        )}
      </div>
    </div>
  )
}
