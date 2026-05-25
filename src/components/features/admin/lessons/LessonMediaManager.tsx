"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2, Video, BookOpen, Layers, Pencil, Eye, EyeOff, Loader2 } from "lucide-react";
import {
  useAdminLessonDetail,
  useAddVideo, useUpdateVideo, useRemoveVideo,
  useAddVocabulary, useUpdateVocabulary, useRemoveVocabulary,
  useAddGrammar, useUpdateGrammar, useRemoveGrammar,
} from "@/hooks/useAdminCourses";
import {
  useAdminFlashcardSetByLesson,
  useAdminAddCard,
  useAdminUpdateCard,
  useAdminDeleteCard,
} from "@/hooks/useFlashcards";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import type { AddVideoDto, UpdateVideoDto, AddVocabularyDto, UpdateVocabularyDto, AddGrammarDto, UpdateGrammarDto } from "@/types/admin.types";
import type { CreateFlashcardPayload, UpdateFlashcardPayload } from "@/types/flashcard.types";

type MediaTab = "videos" | "vocabulary" | "grammar" | "flashcards";

interface Props {
  lessonId: string;
}

export function LessonMediaManager({ lessonId }: Props) {
  const [activeTab, setActiveTab] = useState<MediaTab>("videos");
  const { data: lesson, isLoading } = useAdminLessonDetail(lessonId);

  if (isLoading) return <div className="h-40 animate-pulse rounded-xl bg-slate-200" />;
  if (!lesson) return null;

  const tabs = [
    { key: "videos" as const,      label: "Videos",    count: lesson.videos.length,       icon: Video    },
    { key: "vocabulary" as const,  label: "Từ vựng",   count: lesson.vocabularies.length, icon: BookOpen },
    { key: "grammar" as const,     label: "Ngữ pháp",  count: lesson.grammars.length,     icon: Layers   },
    { key: "flashcards" as const,  label: "Flashcard", count: null,                       icon: Layers   },
  ];

  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 px-2 pt-2">
        {tabs.map(({ key, label, count, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === key
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
            {count !== null && (
              <span className={`rounded-full px-1.5 py-0.5 text-xs ${
                activeTab === key ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"
              }`}>{count}</span>
            )}
          </button>
        ))}
      </div>

      <div className="p-5">
        {activeTab === "videos"      && <VideoPanel      lessonId={lessonId} videos={lesson.videos} />}
        {activeTab === "vocabulary"  && <VocabularyPanel lessonId={lessonId} vocabularies={lesson.vocabularies} />}
        {activeTab === "grammar"     && <GrammarPanel    lessonId={lessonId} grammars={lesson.grammars} />}
        {activeTab === "flashcards"  && <FlashcardPanel  lessonId={lessonId} />}
      </div>
    </div>
  );
}

// ─── Video Panel ──────────────────────────────────────────────────────────────

function toYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}` : null;
}

function VideoPanel({ lessonId, videos }: { lessonId: string; videos: any[] }) {
  const addVideo = useAddVideo();
  const updateVideo = useUpdateVideo();
  const removeVideo = useRemoveVideo();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const addForm = useForm<AddVideoDto>();
  const editForm = useForm<UpdateVideoDto>();

  const onAdd = addForm.handleSubmit((dto) => {
    addVideo.mutate({ lessonId, dto }, { onSuccess: () => { setShowAddForm(false); addForm.reset(); } });
  });

  const onEdit = editForm.handleSubmit((dto) => {
    if (editingIndex === null) return;
    updateVideo.mutate({ lessonId, index: editingIndex, dto }, {
      onSuccess: () => { setEditingIndex(null); editForm.reset(); },
    });
  });

  const startEdit = (i: number, v: any) => {
    setEditingIndex(i);
    setShowAddForm(false);
    setPreviewIndex(null);
    editForm.reset({ title: v.title, videoUrl: v.videoUrl, duration: v.duration });
  };

  const togglePreview = (i: number) => {
    setPreviewIndex((prev) => (prev === i ? null : i));
  };

  const formatDuration = (sec?: number) => {
    if (!sec) return "";
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-3">
      {videos.map((v, i) => (
        <div key={i}>
          {editingIndex === i ? (
            <form onSubmit={onEdit} className="space-y-3 rounded-xl bg-indigo-50 p-4 ring-1 ring-indigo-200">
              <p className="text-xs font-semibold text-indigo-700">Chỉnh sửa video #{i + 1}</p>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Tiêu đề video *</label>
                <input {...editForm.register("title", { required: true })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">URL video *</label>
                <input {...editForm.register("videoUrl", { required: true })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Thời lượng (giây)</label>
                <input type="number" {...editForm.register("duration", { valueAsNumber: true })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => { setEditingIndex(null); editForm.reset(); }}
                  className="rounded-lg border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
                  Hủy
                </button>
                <button type="submit" disabled={updateVideo.isPending}
                  className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
                  Lưu
                </button>
              </div>
            </form>
          ) : (
            <div className="overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-100">
              <div className="flex items-center gap-3 px-4 py-3">
                <Video className="h-4 w-4 shrink-0 text-slate-400" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">{v.title}</p>
                  <p className="truncate text-xs text-slate-400">{v.videoUrl}</p>
                </div>
                {v.duration && <span className="shrink-0 text-xs text-slate-400">{formatDuration(v.duration)}</span>}
                <button
                  onClick={() => togglePreview(i)}
                  title={previewIndex === i ? "Ẩn preview" : "Xem video"}
                  className={`shrink-0 rounded-lg p-1.5 transition-colors ${
                    previewIndex === i
                      ? "bg-indigo-100 text-indigo-600"
                      : "text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                  }`}
                >
                  {previewIndex === i ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button onClick={() => startEdit(i, v)}
                  className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => removeVideo.mutate({ lessonId, index: i })}
                  className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {previewIndex === i && (() => {
                const embedUrl = toYouTubeEmbedUrl(v.videoUrl);
                return embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="aspect-video w-full border-t border-slate-200 bg-black"
                  />
                ) : (
                  <video
                    src={v.videoUrl}
                    controls
                    className="aspect-video w-full border-t border-slate-200 bg-black"
                  />
                );
              })()}
            </div>
          )}
        </div>
      ))}

      {showAddForm ? (
        <form onSubmit={onAdd} className="space-y-3 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Tiêu đề video *</label>
            <input {...addForm.register("title", { required: true })} placeholder="VD: IELTS Task Response Tips"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">URL video *</label>
            <input {...addForm.register("videoUrl", { required: true })} placeholder="https://www.youtube.com/watch?v=..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Thời lượng (giây)</label>
            <input type="number" {...addForm.register("duration", { valueAsNumber: true })} placeholder="VD: 720 (= 12 phút)"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => { setShowAddForm(false); addForm.reset(); }}
              className="rounded-lg border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
              Hủy
            </button>
            <button type="submit" disabled={addVideo.isPending}
              className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
              Thêm
            </button>
          </div>
        </form>
      ) : (
        <button onClick={() => { setShowAddForm(true); setEditingIndex(null); }}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-3 text-sm text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors">
          <Plus className="h-4 w-4" /> Thêm video
        </button>
      )}
    </div>
  );
}

// ─── Flashcard Panel ──────────────────────────────────────────────────────────

function FlashcardPanel({ lessonId }: { lessonId: string }) {
  const { data, isLoading } = useAdminFlashcardSetByLesson(lessonId);
  const adminAdd    = useAdminAddCard();
  const adminUpdate = useAdminUpdateCard();
  const adminDelete = useAdminDeleteCard();

  const [showAddForm,  setShowAddForm]  = useState(false);
  const [editingId,    setEditingId]    = useState<string | null>(null);
  const [frontAdd,     setFrontAdd]     = useState("");
  const [backAdd,      setBackAdd]      = useState("");
  const [frontEdit,    setFrontEdit]    = useState("");
  const [backEdit,     setBackEdit]     = useState("");

  const isEmptyHtml = (html: string) => !html || html.replace(/<[^>]*>/g, "").trim() === "";

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
      </div>
    );
  }

  const set   = data?.set   ?? null;
  const cards = data?.cards ?? [];

  const handleAdd = () => {
    if (isEmptyHtml(frontAdd) || isEmptyHtml(backAdd) || !set) return;
    adminAdd.mutate(
      { setId: set._id, payload: { frontContent: frontAdd, backContent: backAdd } },
      { onSuccess: () => { setShowAddForm(false); setFrontAdd(""); setBackAdd(""); } },
    );
  };

  const startEdit = (card: any) => {
    setEditingId(card._id);
    setFrontEdit(card.frontContent);
    setBackEdit(card.backContent);
  };

  const handleSave = (cardId: string) => {
    if (isEmptyHtml(frontEdit) || isEmptyHtml(backEdit)) return;
    adminUpdate.mutate(
      { cardId, payload: { frontContent: frontEdit, backContent: backEdit } },
      { onSuccess: () => setEditingId(null) },
    );
  };

  return (
    <div className="space-y-3">
      {!set ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 py-10 text-center">
          <Layers className="mb-2 h-8 w-8 text-slate-300" />
          <p className="text-sm text-slate-400">Lesson này chưa có flashcard set</p>
          <p className="mt-1 text-xs text-slate-400">Chạy pipeline để tạo tự động</p>
        </div>
      ) : (
        <>
          {/* Header set */}
          <div className="flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2.5 ring-1 ring-indigo-100">
            <Layers className="h-4 w-4 text-indigo-500" />
            <span className="text-sm font-semibold text-indigo-700">{set.title}</span>
            <span className="ml-auto rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-600">
              {cards.length} thẻ
            </span>
          </div>

          {/* Danh sách cards */}
          {cards.map((card: any) => (
            <div key={card._id}>
              {editingId === card._id ? (
                <div className="space-y-3 rounded-xl bg-indigo-50 p-4 ring-1 ring-indigo-200">
                  <p className="text-xs font-semibold text-indigo-700">Chỉnh sửa thẻ</p>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">Mặt trước *</label>
                    <RichTextEditor value={frontEdit} onChange={setFrontEdit} minHeight="80px" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">Mặt sau *</label>
                    <RichTextEditor value={backEdit} onChange={setBackEdit} minHeight="80px" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="rounded-lg border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSave(card._id)}
                      disabled={adminUpdate.isPending}
                      className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                    >
                      Lưu
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
                  <div className="min-w-0 flex-1">
                    <div
                      className="tiptap text-sm font-medium text-slate-800 [&_p]:leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: card.frontContent }}
                    />
                    <div
                      className="tiptap mt-1 text-xs text-slate-500 [&_p]:leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: card.backContent }}
                    />
                  </div>
                  <button
                    onClick={() => startEdit(card)}
                    className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => adminDelete.mutate({ cardId: card._id, lessonId })}
                    className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Form thêm card mới */}
          {showAddForm ? (
            <div className="space-y-3 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Mặt trước *</label>
                <RichTextEditor value={frontAdd} onChange={setFrontAdd} placeholder="VD: debris" minHeight="80px" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Mặt sau *</label>
                <RichTextEditor value={backAdd} onChange={setBackAdd} placeholder="VD: rác thải / mảnh vỡ" minHeight="80px" />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setShowAddForm(false); setFrontAdd(""); setBackAdd(""); }}
                  className="rounded-lg border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={isEmptyHtml(frontAdd) || isEmptyHtml(backAdd) || adminAdd.isPending}
                  className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  Thêm
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => { setShowAddForm(true); setEditingId(null); }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-3 text-sm text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors"
            >
              <Plus className="h-4 w-4" /> Thêm thẻ
            </button>
          )}
        </>
      )}
    </div>
  );
}

// ─── Vocabulary Panel ─────────────────────────────────────────────────────────

function VocabularyPanel({ lessonId, vocabularies }: { lessonId: string; vocabularies: any[] }) {
  const addVocab = useAddVocabulary();
  const updateVocab = useUpdateVocabulary();
  const removeVocab = useRemoveVocabulary();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addForm = useForm<AddVocabularyDto & { exampleRaw?: string }>();
  const editForm = useForm<UpdateVocabularyDto & { exampleRaw?: string }>();

  const onAdd = addForm.handleSubmit(({ exampleRaw, timestamp, ...dto }) => {
    const examples = exampleRaw?.trim() ? [exampleRaw.trim()] : [];
    addVocab.mutate({ lessonId, dto: { ...dto, examples, timestamp: timestamp || undefined } }, {
      onSuccess: () => { setShowAddForm(false); addForm.reset(); },
    });
  });

  const onEdit = editForm.handleSubmit(({ exampleRaw, timestamp, ...dto }) => {
    if (editingIndex === null) return;
    const examples = exampleRaw?.trim() ? [exampleRaw.trim()] : [];
    updateVocab.mutate({ lessonId, index: editingIndex, dto: { ...dto, examples, timestamp: timestamp || undefined } }, {
      onSuccess: () => { setEditingIndex(null); editForm.reset(); },
    });
  });

  const startEdit = (i: number, v: any) => {
    setEditingIndex(i);
    setShowAddForm(false);
    editForm.reset({
      word: v.word,
      pronunciation: v.pronunciation,
      definition: v.definition,
      translation: v.translation,
      exampleRaw: v.examples?.[0] ?? "",
      timestamp: v.timestamp,
      contextSentence: v.contextSentence,
    });
  };

  const inputCls = "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400";

  return (
    <div className="space-y-3">
      {vocabularies.map((v, i) => (
        <div key={i}>
          {editingIndex === i ? (
            <form onSubmit={onEdit} className="space-y-3 rounded-xl bg-indigo-50 p-4 ring-1 ring-indigo-200">
              <p className="text-xs font-semibold text-indigo-700">Chỉnh sửa từ vựng #{i + 1}</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Từ vựng *</label>
                  <input {...editForm.register("word", { required: true })} className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Phiên âm IPA</label>
                  <input {...editForm.register("pronunciation")} className={`${inputCls} font-mono`} />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Định nghĩa (EN) *</label>
                <input {...editForm.register("definition", { required: true })} className={inputCls} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Nghĩa tiếng Việt</label>
                <input {...editForm.register("translation")} className={inputCls} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Ví dụ</label>
                <input {...editForm.register("exampleRaw")} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Mốc thời gian (giây)</label>
                  <input type="number" step="0.1" {...editForm.register("timestamp", { valueAsNumber: true })}
                    placeholder="VD: 96.5" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Câu ngữ cảnh trong video</label>
                  <input {...editForm.register("contextSentence")} placeholder="Câu chứa từ trong video"
                    className={inputCls} />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => { setEditingIndex(null); editForm.reset(); }}
                  className="rounded-lg border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
                  Hủy
                </button>
                <button type="submit" disabled={updateVocab.isPending}
                  className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
                  Lưu
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800">
                  {v.word}
                  {v.pronunciation && <span className="ml-2 font-normal text-slate-400">/{v.pronunciation}/</span>}
                  {v.translation && <span className="ml-2 text-xs font-normal text-indigo-500">{v.translation}</span>}
                </p>
                <p className="text-xs text-slate-600">{v.definition}</p>
                {v.examples?.[0] && <p className="mt-1 text-xs italic text-slate-400">"{v.examples[0]}"</p>}
              </div>
              <button onClick={() => startEdit(i, v)}
                className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => removeVocab.mutate({ lessonId, index: i })}
                className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      ))}

      {showAddForm ? (
        <form onSubmit={onAdd} className="space-y-3 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Từ vựng *</label>
              <input {...addForm.register("word", { required: true })} placeholder="VD: electrification"
                className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Phiên âm IPA</label>
              <input {...addForm.register("pronunciation")} placeholder="/ɪˌlektrɪfɪˈkeɪʃn/"
                className={`${inputCls} font-mono`} />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Định nghĩa (EN) *</label>
            <input {...addForm.register("definition", { required: true })} placeholder="The process of transitioning to electric power"
              className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Nghĩa tiếng Việt</label>
            <input {...addForm.register("translation")} placeholder="điện khí hóa"
              className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Ví dụ</label>
            <input {...addForm.register("exampleRaw")} placeholder="The electrification of transport could reduce urban emissions."
              className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Mốc thời gian (giây)</label>
              <input type="number" step="0.1" {...addForm.register("timestamp", { valueAsNumber: true })}
                placeholder="VD: 96.5" className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Câu ngữ cảnh trong video</label>
              <input {...addForm.register("contextSentence")} placeholder="Câu chứa từ trong video"
                className={inputCls} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => { setShowAddForm(false); addForm.reset(); }}
              className="rounded-lg border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
              Hủy
            </button>
            <button type="submit" disabled={addVocab.isPending}
              className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
              Thêm
            </button>
          </div>
        </form>
      ) : (
        <button onClick={() => { setShowAddForm(true); setEditingIndex(null); }}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-3 text-sm text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors">
          <Plus className="h-4 w-4" /> Thêm từ vựng
        </button>
      )}
    </div>
  );
}

// ─── Grammar Panel ────────────────────────────────────────────────────────────

function GrammarPanel({ lessonId, grammars }: { lessonId: string; grammars: any[] }) {
  const addGrammar = useAddGrammar();
  const updateGrammar = useUpdateGrammar();
  const removeGrammar = useRemoveGrammar();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addForm = useForm<AddGrammarDto & { exampleRaw?: string }>();
  const editForm = useForm<UpdateGrammarDto & { exampleRaw?: string }>();

  const onAdd = addForm.handleSubmit(({ exampleRaw, timestamp, ...dto }) => {
    const examples = exampleRaw?.trim() ? [exampleRaw.trim()] : [];
    addGrammar.mutate({ lessonId, dto: { ...dto, examples, timestamp: timestamp || undefined } }, {
      onSuccess: () => { setShowAddForm(false); addForm.reset(); },
    });
  });

  const onEdit = editForm.handleSubmit(({ exampleRaw, timestamp, ...dto }) => {
    if (editingIndex === null) return;
    const examples = exampleRaw?.trim() ? [exampleRaw.trim()] : [];
    updateGrammar.mutate({ lessonId, index: editingIndex, dto: { ...dto, examples, timestamp: timestamp || undefined } }, {
      onSuccess: () => { setEditingIndex(null); editForm.reset(); },
    });
  });

  const startEdit = (i: number, g: any) => {
    setEditingIndex(i);
    setShowAddForm(false);
    editForm.reset({
      title: g.title,
      structure: g.structure,
      explanation: g.explanation,
      exampleRaw: g.examples?.[0] ?? "",
      timestamp: g.timestamp,
      contextSentence: g.contextSentence,
    });
  };

  const inputCls = "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400";

  return (
    <div className="space-y-3">
      {grammars.map((g, i) => (
        <div key={i}>
          {editingIndex === i ? (
            <form onSubmit={onEdit} className="space-y-3 rounded-xl bg-indigo-50 p-4 ring-1 ring-indigo-200">
              <p className="text-xs font-semibold text-indigo-700">Chỉnh sửa ngữ pháp #{i + 1}</p>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Tiêu đề *</label>
                <input {...editForm.register("title", { required: true })} className={inputCls} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Cấu trúc</label>
                <input {...editForm.register("structure")} className={`${inputCls} font-mono`} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Giải thích *</label>
                <textarea {...editForm.register("explanation", { required: true })} rows={3}
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Ví dụ</label>
                <input {...editForm.register("exampleRaw")} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Mốc thời gian (giây)</label>
                  <input type="number" step="0.1" {...editForm.register("timestamp", { valueAsNumber: true })}
                    placeholder="VD: 152.4" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Câu ngữ cảnh trong video</label>
                  <input {...editForm.register("contextSentence")} placeholder="Câu chứa cấu trúc trong video"
                    className={inputCls} />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => { setEditingIndex(null); editForm.reset(); }}
                  className="rounded-lg border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
                  Hủy
                </button>
                <button type="submit" disabled={updateGrammar.isPending}
                  className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
                  Lưu
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800">{g.title}</p>
                {g.structure && <p className="mt-0.5 font-mono text-xs text-indigo-500">{g.structure}</p>}
                <p className="mt-0.5 text-xs text-slate-600 line-clamp-2">{g.explanation}</p>
                {g.examples?.[0] && <p className="mt-1 text-xs italic text-slate-400">"{g.examples[0]}"</p>}
              </div>
              <button onClick={() => startEdit(i, g)}
                className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => removeGrammar.mutate({ lessonId, index: i })}
                className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      ))}

      {showAddForm ? (
        <form onSubmit={onAdd} className="space-y-3 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Tiêu đề *</label>
            <input {...addForm.register("title", { required: true })} placeholder="VD: Passive Voice with Modal Verbs"
              className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Cấu trúc</label>
            <input {...addForm.register("structure")} placeholder="S + modal + be + past participle"
              className={`${inputCls} font-mono`} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Giải thích *</label>
            <textarea {...addForm.register("explanation", { required: true })} rows={3}
              placeholder="Dùng để diễn đạt khả năng/bắt buộc ở dạng bị động..."
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Ví dụ</label>
            <input {...addForm.register("exampleRaw")} placeholder="Many jobs could be replaced by artificial intelligence."
              className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Mốc thời gian (giây)</label>
              <input type="number" step="0.1" {...addForm.register("timestamp", { valueAsNumber: true })}
                placeholder="VD: 152.4" className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Câu ngữ cảnh trong video</label>
              <input {...addForm.register("contextSentence")} placeholder="Câu chứa cấu trúc trong video"
                className={inputCls} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => { setShowAddForm(false); addForm.reset(); }}
              className="rounded-lg border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
              Hủy
            </button>
            <button type="submit" disabled={addGrammar.isPending}
              className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
              Thêm
            </button>
          </div>
        </form>
      ) : (
        <button onClick={() => { setShowAddForm(true); setEditingIndex(null); }}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-3 text-sm text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors">
          <Plus className="h-4 w-4" /> Thêm ngữ pháp
        </button>
      )}
    </div>
  );
}
