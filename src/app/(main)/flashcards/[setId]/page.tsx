// Trang chi tiết flashcard set: xem, thêm, sửa, xóa từng thẻ.
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, Loader2, Layers, AlertCircle, BookOpen, Pencil, Check, X } from "lucide-react";
import {
  useFlashcardSetDetail,
  useCreateFlashcard,
  useUpdateFlashcard,
  useDeleteFlashcard,
  useUpdateFlashcardSet,
} from "@/hooks/useFlashcards";
import { CardItem } from "@/components/features/flashcards/CardItem";
import { UI_TEXT } from "@/constants/ui-text";
import type { Flashcard } from "@/types/flashcard.types";

const T = UI_TEXT.FLASHCARDS;

/*
Component FlashcardSetPage.

Output:
- Quản lý chi tiết card trong set, bao gồm chỉnh sửa thông tin set và thao tác CRUD card.
*/
export default function FlashcardSetPage() {
  const { setId } = useParams<{ setId: string }>();
  const router = useRouter();

  // State form card (dùng chung cho chế độ thêm/sửa)
  const [showForm,    setShowForm]    = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [front,       setFront]       = useState("");
  const [back,        setBack]        = useState("");

  // State sửa thông tin set inline
  const [editingInfo,      setEditingInfo]      = useState(false);
  const [titleDraft,       setTitleDraft]       = useState("");
  const [descriptionDraft, setDescriptionDraft] = useState("");

  const { data, isLoading, isError } = useFlashcardSetDetail(setId);
  const { set, cards = [] } = data ?? {};

  const createCard = useCreateFlashcard();
  const updateCard = useUpdateFlashcard();
  const deleteCard = useDeleteFlashcard();
  const updateSet  = useUpdateFlashcardSet();

  // True khi đang sửa card hiện có
  const isEditing = !!editingCard;
  // True khi mutation tạo/sửa card đang chạy
  const isSaving  = createCard.isPending || updateCard.isPending;

  /*
  Mở form thêm card mới.

  Output:
  - Reset dữ liệu form và chuyển sang chế độ thêm.
  */
  const openAddForm = () => {
    setEditingCard(null);
    setFront("");
    setBack("");
    setShowForm(true);
  };

  /*
  Mở form sửa card.

  Input:
  - card — card cần chỉnh sửa.

  Output:
  - Prefill form bằng dữ liệu card được chọn.
  */
  const openEditForm = (card: Flashcard) => {
    setEditingCard(card);
    setFront(card.frontContent);
    setBack(card.backContent);
    setShowForm(true);
  };

  /*
  Đóng form card.

  Output:
  - Reset state form và thoát chế độ thêm/sửa.
  */
  const closeForm = () => {
    setShowForm(false);
    setEditingCard(null);
    setFront("");
    setBack("");
  };

  /*
  Lưu dữ liệu card từ form.

  Output:
  - Tạo card mới hoặc cập nhật card hiện tại tùy theo mode.
  */
  const handleSave = () => {
    if (!front.trim() || !back.trim()) return;
    if (isEditing && editingCard) {
      updateCard.mutate(
        { cardId: editingCard._id, payload: { frontContent: front.trim(), backContent: back.trim() } },
        { onSuccess: closeForm },
      );
    } else {
      createCard.mutate(
        { setId, payload: { frontContent: front.trim(), backContent: back.trim() } },
        { onSuccess: closeForm },
      );
    }
  };

  /*
  Xóa card theo ID.

  Input:
  - cardId — ID card cần xóa.

  Output:
  - Gọi mutation xóa card sau khi xác nhận.
  */
  const handleDelete = (cardId: string) => {
    if (!window.confirm(T.CONFIRM_DELETE_CARD)) return;
    deleteCard.mutate({ cardId, setId });
  };

  /*
  Bật chế độ sửa thông tin set inline.

  Output:
  - Prefill title/description vào draft để người dùng chỉnh sửa.
  */
  const startEditInfo = () => {
    setTitleDraft(set?.title ?? "");
    setDescriptionDraft(set?.description ?? "");
    setEditingInfo(true);
  };

  /*
  Lưu thông tin set đã chỉnh sửa.

  Output:
  - Cập nhật title/description và thoát chế độ edit khi thành công.
  */
  const saveInfo = () => {
    if (!titleDraft.trim()) return;
    updateSet.mutate(
      {
        id: setId,
        payload: {
          title:       titleDraft.trim(),
          description: descriptionDraft.trim() || undefined,
        },
      },
      { onSuccess: () => setEditingInfo(false) },
    );
  };

  /*
  Hủy chỉnh sửa thông tin set.

  Output:
  - Thoát edit mode và xóa dữ liệu draft.
  */
  const cancelEditInfo = () => {
    setEditingInfo(false);
    setTitleDraft("");
    setDescriptionDraft("");
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !set) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <p className="text-sm text-muted-foreground">{T.NOT_FOUND}</p>
        <button
          onClick={() => router.push("/flashcards")}
          className="text-sm text-primary hover:underline"
        >
          {T.DETAIL_BACK}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Nút quay về danh sách set */}
      <button
        onClick={() => router.push("/flashcards")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {T.DETAIL_BACK}
      </button>

      {/* Header set: icon, title/description editable và nút thao tác */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <div>
            {editingInfo ? (
              /* Chế độ sửa inline */
              <div className="flex flex-col gap-2">
                <input
                  autoFocus
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Escape" && cancelEditInfo()}
                  placeholder="Tên bộ thẻ"
                  className="rounded-lg border border-primary/50 bg-card px-2 py-1 text-base font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <textarea
                  value={descriptionDraft}
                  onChange={(e) => setDescriptionDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Escape" && cancelEditInfo()}
                  placeholder="Mô tả (tuỳ chọn)"
                  rows={2}
                  className="w-full resize-none rounded-lg border border-border bg-card px-2 py-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={saveInfo}
                    disabled={!titleDraft.trim() || updateSet.isPending}
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1 text-xs font-medium text-white disabled:opacity-50"
                  >
                    {updateSet.isPending
                      ? <Loader2 className="h-3 w-3 animate-spin" />
                      : <Check className="h-3 w-3" />}
                    Lưu
                  </button>
                  <button
                    onClick={cancelEditInfo}
                    className="rounded-lg px-3 py-1 text-xs text-muted-foreground hover:bg-muted"
                  >
                    Huỷ
                  </button>
                </div>
              </div>
            ) : (
              /* Chế độ xem bình thường; icon sửa hiện khi hover */
              <div className="group/info">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xl font-bold text-foreground">{set.title}</h1>
                  <button
                    onClick={startEditInfo}
                    className="rounded-lg p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover/info:opacity-100"
                    title="Sửa thông tin"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
                {set.description && (
                  <p className="mt-0.5 text-sm text-muted-foreground">{set.description}</p>
                )}
              </div>
            )}

            <p className="mt-1 text-xs text-muted-foreground">
              {T.LABEL_CARD_COUNT(cards.length)}
            </p>
          </div>
        </div>

        {/* Nút hành động: review set và thêm card */}
        <div className="flex shrink-0 items-center gap-2">
          {cards.length > 0 && (
            <button
              onClick={() => router.push(`/flashcards/${setId}/review`)}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <BookOpen className="h-4 w-4 text-primary" />
              {T.BTN_REVIEW_SET}
            </button>
          )}
          <button
            onClick={openAddForm}
            disabled={showForm}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            {T.BTN_ADD_CARD}
          </button>
        </div>
      </div>

      {/* Form thêm/sửa card */}
      {showForm && (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            {isEditing ? T.FORM_TITLE_EDIT : T.FORM_TITLE_ADD}
          </h2>

          {/* Bố cục 2 cột cho mặt trước và mặt sau */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Mặt trước</label>
              <textarea
                placeholder={T.PLACEHOLDER_FRONT}
                value={front}
                onChange={(e) => setFront(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Mặt sau</label>
              <textarea
                placeholder={T.PLACEHOLDER_BACK}
                value={back}
                onChange={(e) => setBack(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={closeForm}
              className="rounded-lg px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
            >
              {T.BTN_CANCEL}
            </button>
            <button
              onClick={handleSave}
              disabled={!front.trim() || !back.trim() || isSaving}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {T.BTN_SAVE}
            </button>
          </div>
        </div>
      )}

      {/* Danh sách card; empty state chỉ hiển thị khi form không mở */}
      {cards.length === 0 && !showForm ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
          <Layers className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">{T.EMPTY_CARDS}</p>
          <p className="mt-1 text-xs text-muted-foreground">{T.EMPTY_CARDS_HINT}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {cards.map((card) => (
            <CardItem key={card._id} card={card} onEdit={openEditForm} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
