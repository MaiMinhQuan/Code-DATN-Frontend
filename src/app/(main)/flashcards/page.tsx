// Trang danh sách bộ flashcard, hỗ trợ tạo set mới ngay trên trang.
"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import {
  useFlashcardSets,
  useCreateFlashcardSet,
  useDeleteFlashcardSet,
} from "@/hooks/useFlashcards";
import { SetList } from "@/components/features/flashcards/SetList";
import { UI_TEXT } from "@/constants/ui-text";

const T = UI_TEXT.FLASHCARDS;

/*
Component FlashcardsPage.

Output:
- Danh sách flashcard set, form tạo mới và thao tác xóa set.
*/
export default function FlashcardsPage() {
  const [showForm,     setShowForm]     = useState(false);
  const [title,        setTitle]        = useState("");
  const [description,  setDescription]  = useState("");

  const { data: sets = [], isLoading } = useFlashcardSets();
  const createSet = useCreateFlashcardSet();
  const deleteSet = useDeleteFlashcardSet();

  /*
  Tạo flashcard set mới.

  Output:
  - Gọi mutation tạo set, reset form và đóng form khi thành công.
  */
  const handleCreate = () => {
    if (!title.trim()) return;
    createSet.mutate(
      { title: title.trim(), description: description.trim() || undefined },
      {
        onSuccess: () => {
          setTitle("");
          setDescription("");
          setShowForm(false);
        },
      },
    );
  };

  /*
  Hủy form tạo set.

  Output:
  - Đóng form và reset dữ liệu nhập.
  */
  const handleCancelForm = () => {
    setShowForm(false);
    setTitle("");
    setDescription("");
  };

  /*
  Xóa flashcard set.

  Input:
  - id — ID của set cần xóa.

  Output:
  - Gọi mutation xóa set sau khi người dùng xác nhận.
  */
  const handleDelete = (id: string) => {
    if (!window.confirm(T.CONFIRM_DELETE_SET)) return;
    deleteSet.mutate(id);
  };

  return (
    <div className="space-y-6">
      {/* Header trang + nút tạo set mới */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{T.PAGE_TITLE}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{T.PAGE_SUBTITLE}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowForm(true)}
            disabled={showForm}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            {T.BTN_NEW_SET}
          </button>
        </div>
      </div>

      {/* Form tạo set hiển thị inline */}
      {showForm && (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            {T.BTN_NEW_SET}
          </h2>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder={T.PLACEHOLDER_SET_TITLE}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              autoFocus
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <input
              type="text"
              placeholder={T.PLACEHOLDER_SET_DESC}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancelForm}
                className="rounded-lg px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
              >
                {T.BTN_CANCEL}
              </button>
              <button
                onClick={handleCreate}
                disabled={!title.trim() || createSet.isPending}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {createSet.isPending && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                {T.BTN_SAVE}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Danh sách set hiện có */}
      <SetList sets={sets} isLoading={isLoading} onDelete={handleDelete} />
    </div>
  );
}
