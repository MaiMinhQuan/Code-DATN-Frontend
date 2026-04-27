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

export default function FlashcardSetPage() {
  const { setId } = useParams<{ setId: string }>();
  const router = useRouter();

  // ─── Card form state ──────────────────────────────────────────────────────
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  // ─── Inline edit set info state ──────────────────────────────────────────
  const [editingInfo, setEditingInfo] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [descriptionDraft, setDescriptionDraft] = useState("");

  // ─── Data ─────────────────────────────────────────────────────────────────
  const { data, isLoading, isError } = useFlashcardSetDetail(setId);
  const { set, cards = [] } = data ?? {};

  // ─── Mutations ────────────────────────────────────────────────────────────
  const createCard = useCreateFlashcard();
  const updateCard = useUpdateFlashcard();
  const deleteCard = useDeleteFlashcard();
  const updateSet = useUpdateFlashcardSet();

  const isEditing = !!editingCard;
  const isSaving = createCard.isPending || updateCard.isPending;

  // ─── Card handlers ────────────────────────────────────────────────────────
  const openAddForm = () => {
    setEditingCard(null);
    setFront("");
    setBack("");
    setShowForm(true);
  };

  const openEditForm = (card: Flashcard) => {
    setEditingCard(card);
    setFront(card.frontContent);
    setBack(card.backContent);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingCard(null);
    setFront("");
    setBack("");
  };

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

  const handleDelete = (cardId: string) => {
    if (!window.confirm(T.CONFIRM_DELETE_CARD)) return;
    deleteCard.mutate({ cardId, setId });
  };

  // ─── Set info edit handlers ───────────────────────────────────────────────
  const startEditInfo = () => {
    setTitleDraft(set?.title ?? "");
    setDescriptionDraft(set?.description ?? "");
    setEditingInfo(true);
  };

  const saveInfo = () => {
    if (!titleDraft.trim()) return;
    updateSet.mutate(
      {
        id: setId,
        payload: {
          title: titleDraft.trim(),
          description: descriptionDraft.trim() || undefined,
        },
      },
      { onSuccess: () => setEditingInfo(false) },
    );
  };

  const cancelEditInfo = () => {
    setEditingInfo(false);
    setTitleDraft("");
    setDescriptionDraft("");
  };

  // ─── Loading / Error ──────────────────────────────────────────────────────
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
      {/* Back */}
      <button
        onClick={() => router.push("/flashcards")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {T.DETAIL_BACK}
      </button>

      {/* Set header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <div>
            {editingInfo ? (
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

      {/* Add / Edit form */}
      {showForm && (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            {isEditing ? T.FORM_TITLE_EDIT : T.FORM_TITLE_ADD}
          </h2>

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

      {/* Card list */}
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
