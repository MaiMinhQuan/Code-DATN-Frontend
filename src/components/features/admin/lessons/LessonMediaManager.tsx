"use client";

// Quản lý nội dung media (Videos, Vocabulary, Grammar) nhúng trong lesson.
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2, Video, BookOpen, Layers } from "lucide-react";
import {
  useAdminLessonDetail,
  useAddVideo, useRemoveVideo,
  useAddVocabulary, useRemoveVocabulary,
  useAddGrammar, useRemoveGrammar,
} from "@/hooks/useAdminCourses";
import type { AddVideoDto, AddVocabularyDto, AddGrammarDto } from "@/types/admin.types";

type MediaTab = "videos" | "vocabulary" | "grammar";

interface Props {
  lessonId: string;
}

export function LessonMediaManager({ lessonId }: Props) {
  const [activeTab, setActiveTab] = useState<MediaTab>("videos");
  const { data: lesson, isLoading } = useAdminLessonDetail(lessonId);

  if (isLoading) return <div className="h-40 animate-pulse rounded-xl bg-slate-200" />;
  if (!lesson) return null;

  return (
    <div className="mt-4 rounded-xl bg-white ring-1 ring-slate-200">
      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {([
          { key: "videos" as const,     label: `Videos (${lesson.videos.length})`,       icon: Video },
          { key: "vocabulary" as const, label: `Từ vựng (${lesson.vocabularies.length})`, icon: BookOpen },
          { key: "grammar" as const,    label: `Ngữ pháp (${lesson.grammars.length})`,    icon: Layers },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === key
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      <div className="p-4">
        {activeTab === "videos" && (
          <VideoPanel lessonId={lessonId} videos={lesson.videos} />
        )}
        {activeTab === "vocabulary" && (
          <VocabularyPanel lessonId={lessonId} vocabularies={lesson.vocabularies} />
        )}
        {activeTab === "grammar" && (
          <GrammarPanel lessonId={lessonId} grammars={lesson.grammars} />
        )}
      </div>
    </div>
  );
}

function VideoPanel({ lessonId, videos }: { lessonId: string; videos: any[] }) {
  const addVideo = useAddVideo();
  const removeVideo = useRemoveVideo();
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset } = useForm<AddVideoDto>();

  const onSubmit = handleSubmit((dto) => {
    addVideo.mutate({ lessonId, dto }, {
      onSuccess: () => { setShowForm(false); reset(); },
    });
  });

  return (
    <div className="space-y-3">
      {videos.map((v, i) => (
        <div key={i} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
          <div>
            <p className="text-sm font-medium text-slate-800">{v.title}</p>
            <p className="text-xs text-slate-500 truncate max-w-xs">{v.videoUrl}</p>
          </div>
          <button onClick={() => removeVideo.mutate({ lessonId, index: i })}
            className="ml-2 rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}

      {showForm ? (
        <form onSubmit={onSubmit} className="space-y-2 rounded-lg bg-slate-50 p-3">
          <input {...register("title", { required: true })} placeholder="Tiêu đề video *"
            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-indigo-400" />
          <input {...register("videoUrl", { required: true })} placeholder="URL video (YouTube, v.v.) *"
            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-indigo-400" />
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowForm(false)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100">
              Hủy
            </button>
            <button type="submit" disabled={addVideo.isPending}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
              Thêm
            </button>
          </div>
        </form>
      ) : (
        <button onClick={() => setShowForm(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 py-2 text-sm text-slate-400 hover:border-indigo-300 hover:text-indigo-500">
          <Plus className="h-4 w-4" /> Thêm video
        </button>
      )}
    </div>
  );
}

function VocabularyPanel({ lessonId, vocabularies }: { lessonId: string; vocabularies: any[] }) {
  const addVocab = useAddVocabulary();
  const removeVocab = useRemoveVocabulary();
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset } = useForm<AddVocabularyDto>();

  const onSubmit = handleSubmit((dto) => {
    addVocab.mutate({ lessonId, dto }, {
      onSuccess: () => { setShowForm(false); reset(); },
    });
  });

  return (
    <div className="space-y-3">
      {vocabularies.map((v, i) => (
        <div key={i} className="flex items-start justify-between rounded-lg bg-slate-50 px-3 py-2">
          <div>
            <p className="text-sm font-semibold text-slate-800">{v.word}
              {v.pronunciation && <span className="ml-2 text-xs font-normal text-slate-400">/{v.pronunciation}/</span>}
            </p>
            <p className="text-xs text-slate-600">{v.definition}</p>
          </div>
          <button onClick={() => removeVocab.mutate({ lessonId, index: i })}
            className="ml-2 rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}

      {showForm ? (
        <form onSubmit={onSubmit} className="space-y-2 rounded-lg bg-slate-50 p-3">
          <div className="grid grid-cols-2 gap-2">
            <input {...register("word", { required: true })} placeholder="Từ vựng *"
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-indigo-400" />
            <input {...register("pronunciation")} placeholder="Phiên âm"
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-indigo-400" />
          </div>
          <input {...register("definition", { required: true })} placeholder="Định nghĩa *"
            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-indigo-400" />
          <input {...register("translation")} placeholder="Dịch nghĩa"
            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-indigo-400" />
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowForm(false)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100">
              Hủy
            </button>
            <button type="submit" disabled={addVocab.isPending}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
              Thêm
            </button>
          </div>
        </form>
      ) : (
        <button onClick={() => setShowForm(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 py-2 text-sm text-slate-400 hover:border-indigo-300 hover:text-indigo-500">
          <Plus className="h-4 w-4" /> Thêm từ vựng
        </button>
      )}
    </div>
  );
}

function GrammarPanel({ lessonId, grammars }: { lessonId: string; grammars: any[] }) {
  const addGrammar = useAddGrammar();
  const removeGrammar = useRemoveGrammar();
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset } = useForm<AddGrammarDto>();

  const onSubmit = handleSubmit((dto) => {
    addGrammar.mutate({ lessonId, dto }, {
      onSuccess: () => { setShowForm(false); reset(); },
    });
  });

  return (
    <div className="space-y-3">
      {grammars.map((g, i) => (
        <div key={i} className="flex items-start justify-between rounded-lg bg-slate-50 px-3 py-2">
          <div>
            <p className="text-sm font-semibold text-slate-800">{g.title}</p>
            <p className="text-xs text-slate-600 line-clamp-2">{g.explanation}</p>
          </div>
          <button onClick={() => removeGrammar.mutate({ lessonId, index: i })}
            className="ml-2 rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}

      {showForm ? (
        <form onSubmit={onSubmit} className="space-y-2 rounded-lg bg-slate-50 p-3">
          <input {...register("title", { required: true })} placeholder="Tiêu đề ngữ pháp *"
            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-indigo-400" />
          <textarea {...register("explanation", { required: true })} rows={2} placeholder="Giải thích *"
            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-indigo-400" />
          <input {...register("structure")} placeholder="Cấu trúc (VD: S + V + O)"
            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-indigo-400" />
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowForm(false)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100">
              Hủy
            </button>
            <button type="submit" disabled={addGrammar.isPending}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
              Thêm
            </button>
          </div>
        </form>
      ) : (
        <button onClick={() => setShowForm(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 py-2 text-sm text-slate-400 hover:border-indigo-300 hover:text-indigo-500">
          <Plus className="h-4 w-4" /> Thêm ngữ pháp
        </button>
      )}
    </div>
  );
}
