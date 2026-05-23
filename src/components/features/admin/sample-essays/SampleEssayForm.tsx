"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Eye, EyeOff, Check, X } from "lucide-react";
import { useCreateSampleEssay, useUpdateSampleEssay } from "@/hooks/useAdminSampleEssays";
import { useTopics } from "@/hooks/useTopics";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import type { SampleEssay, HighlightAnnotation, HighlightType } from "@/types/sample-essay.types";
import type { CreateSampleEssayDto, CreateHighlightAnnotationDto } from "@/types/admin.types";
import { TargetBand } from "@/types/enums";

const TARGET_BAND_LABELS: Record<TargetBand, string> = {
  BAND_5_0: "Band 5.0",
  BAND_6_0: "Band 6.0",
  BAND_7_PLUS: "Band 7+",
};

const HIGHLIGHT_TYPES: {
  value: HighlightType;
  label: string;
  dot: string;
  markBg: string;
  badge: string;
}[] = [
  { value: "VOCABULARY", label: "Từ vựng",  dot: "bg-amber-400", markBg: "bg-amber-100", badge: "bg-amber-100 text-amber-800" },
  { value: "GRAMMAR",    label: "Ngữ pháp", dot: "bg-red-400",   markBg: "bg-red-100",   badge: "bg-red-100 text-red-800"     },
  { value: "STRUCTURE",  label: "Cấu trúc", dot: "bg-blue-400",  markBg: "bg-blue-100",  badge: "bg-blue-100 text-blue-800"   },
  { value: "ARGUMENT",   label: "Lập luận", dot: "bg-green-400", markBg: "bg-green-100", badge: "bg-green-100 text-green-800" },
];

const HIGHLIGHT_MAP = Object.fromEntries(
  HIGHLIGHT_TYPES.map((t) => [t.value, t])
) as Record<HighlightType, (typeof HIGHLIGHT_TYPES)[number]>;

function buildSegments(text: string, annotations: HighlightAnnotation[]) {
  type Located = { ann: HighlightAnnotation; start: number; end: number };
  const located: Located[] = [];
  for (const ann of annotations) {
    if (!ann.text) continue;
    const start = text.indexOf(ann.text);
    if (start === -1) continue;
    located.push({ ann, start, end: start + ann.text.length });
  }
  located.sort((a, b) => a.start - b.start);
  const noOverlap: Located[] = [];
  let cursor = 0;
  for (const loc of located) {
    if (loc.start >= cursor) {
      noOverlap.push(loc);
      cursor = loc.end;
    }
  }
  const segments: Array<{ text: string; ann?: HighlightAnnotation; id: number }> = [];
  cursor = 0;
  let id = 0;
  for (const loc of noOverlap) {
    if (loc.start > cursor) segments.push({ id: id++, text: text.slice(cursor, loc.start) });
    segments.push({ id: id++, text: loc.ann.text, ann: loc.ann });
    cursor = loc.end;
  }
  if (cursor < text.length) segments.push({ id: id++, text: text.slice(cursor) });
  return segments;
}

interface DraftAnnotation {
  text: string;
  highlightType: HighlightType;
  explanation: string;
}

const EMPTY_DRAFT: DraftAnnotation = {
  text: "",
  highlightType: "VOCABULARY",
  explanation: "",
};

function AnnotationForm({
  draft,
  onChange,
  onSave,
  onCancel,
}: {
  draft: DraftAnnotation;
  onChange: (d: DraftAnnotation) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const isValid = draft.text.trim().length > 0 && draft.explanation.trim().length > 0;
  return (
    <div className="flex flex-col gap-2.5">
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">Đoạn text cần highlight</label>
        <input
          value={draft.text}
          onChange={(e) => onChange({ ...draft, text: e.target.value })}
          placeholder="Dán đoạn text từ bài essay..."
          className="w-full rounded-lg border border-slate-200 px-2.5 py-2 text-xs outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">Loại</label>
        <select
          value={draft.highlightType}
          onChange={(e) => onChange({ ...draft, highlightType: e.target.value as HighlightType })}
          className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        >
          {HIGHLIGHT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">Giải thích</label>
        <textarea
          value={draft.explanation}
          onChange={(e) => onChange({ ...draft, explanation: e.target.value })}
          rows={3}
          placeholder="Tại sao đoạn này hay? Phân tích từ vựng/ngữ pháp..."
          className="w-full resize-none rounded-lg border border-slate-200 px-2.5 py-2 text-xs leading-relaxed outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onSave}
          disabled={!isValid}
          className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          <Check className="h-3.5 w-3.5" /> Lưu
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Hủy
        </button>
      </div>
    </div>
  );
}

interface Props {
  essay?: SampleEssay;
}

export function SampleEssayForm({ essay }: Props) {
  const router = useRouter();
  const createEssay = useCreateSampleEssay();
  const updateEssay = useUpdateSampleEssay();
  const { data: topics = [] } = useTopics();

  const [outlineHtml, setOutlineHtml] = useState(essay?.outlineContent ?? "");
  const [annotations, setAnnotations] = useState<HighlightAnnotation[]>(
    essay?.highlightAnnotations ?? []
  );
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [draft, setDraft] = useState<DraftAnnotation>(EMPTY_DRAFT);
  const [showPreview, setShowPreview] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateSampleEssayDto>();

  const essayContent = watch("fullEssayContent", essay?.fullEssayContent ?? "");

  useEffect(() => {
    const outline = essay?.outlineContent ?? "";
    reset(
      essay
        ? {
            title: essay.title,
            topicId: essay.topicId._id,
            questionPrompt: essay.questionPrompt,
            targetBand: essay.targetBand,
            outlineContent: outline,
            fullEssayContent: essay.fullEssayContent,
            isPublished: essay.isPublished,
            authorName: essay.authorName ?? "",
            overallBandScore: essay.overallBandScore,
          }
        : { targetBand: TargetBand.BAND_7_PLUS, isPublished: true }
    );
    setOutlineHtml(outline);
    setAnnotations(essay?.highlightAnnotations ?? []);
  }, [essay, reset]);

  useEffect(() => {
    if (essay && topics.length > 0) {
      setValue("topicId", essay.topicId._id, { shouldDirty: false });
    }
  }, [essay, topics, setValue]);

  const openAdd = () => {
    setDraft(EMPTY_DRAFT);
    setEditingIdx(null);
    setAddingNew(true);
  };

  const openEdit = (idx: number) => {
    const a = annotations[idx];
    setDraft({ text: a.text, highlightType: a.highlightType, explanation: a.explanation });
    setAddingNew(false);
    setEditingIdx(idx);
  };

  const cancelForm = () => {
    setAddingNew(false);
    setEditingIdx(null);
  };

  const saveAnnotation = () => {
    if (!draft.text.trim() || !draft.explanation.trim()) return;
    const item: CreateHighlightAnnotationDto = {
      text: draft.text.trim(),
      highlightType: draft.highlightType,
      explanation: draft.explanation.trim(),
    };
    if (editingIdx !== null) {
      setAnnotations((prev) => prev.map((a, i) => (i === editingIdx ? item : a)));
      setEditingIdx(null);
    } else {
      setAnnotations((prev) => [...prev, item]);
      setAddingNew(false);
    }
  };

  const deleteAnnotation = (idx: number) => {
    setAnnotations((prev) => prev.filter((_, i) => i !== idx));
    if (editingIdx === idx) setEditingIdx(null);
  };

  const onSubmit = handleSubmit((values) => {
    const payload: CreateSampleEssayDto = {
      ...values,
      outlineContent: outlineHtml,
      isPublished:
        (values.isPublished as unknown as string) === "true" ||
        values.isPublished === true,
      overallBandScore: values.overallBandScore
        ? Number(values.overallBandScore)
        : undefined,
      highlightAnnotations: annotations,
    };

    if (essay) {
      updateEssay.mutate(
        { id: essay._id, dto: payload },
        { onSuccess: () => router.push("/admin/sample-essays") }
      );
    } else {
      createEssay.mutate(payload, {
        onSuccess: () => router.push("/admin/sample-essays"),
      });
    }
  });

  const isPending = createEssay.isPending || updateEssay.isPending;
  const isFormOpen = addingNew || editingIdx !== null;

  return (
    <form onSubmit={onSubmit}>
      <div className="flex gap-6">
        {/* ── Cột trái ── */}
        <div className="flex flex-1 flex-col gap-5 min-w-0">
          {/* Tiêu đề */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              {...register("title", { required: "Vui lòng nhập tiêu đề" })}
              placeholder="VD: Band 7.5 Essay — Environmental Pollution"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            {errors.title && (
              <p className="mt-1.5 text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Nội dung đề thi */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Nội dung đề thi <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("questionPrompt", { required: "Vui lòng nhập nội dung đề" })}
              rows={3}
              placeholder="You should spend about 40 minutes on this task..."
              className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            {errors.questionPrompt && (
              <p className="mt-1.5 text-xs text-red-500">{errors.questionPrompt.message}</p>
            )}
          </div>

          {/* Dàn ý */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Dàn ý <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              value={outlineHtml}
              onChange={(html) => {
                setOutlineHtml(html);
                setValue("outlineContent", html, { shouldDirty: true });
              }}
              placeholder="Introduction: ...&#10;Body 1: ...&#10;Body 2: ...&#10;Conclusion: ..."
              minHeight="8rem"
            />
          </div>

          {/* Nội dung bài mẫu */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Nội dung bài mẫu <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("fullEssayContent", { required: "Vui lòng nhập nội dung bài viết" })}
              rows={16}
              placeholder="Nội dung bài essay hoàn chỉnh..."
              className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm leading-relaxed outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            {errors.fullEssayContent && (
              <p className="mt-1.5 text-xs text-red-500">{errors.fullEssayContent.message}</p>
            )}
          </div>

          {/* Preview section */}
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="flex w-full items-center justify-between bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <span className="flex items-center gap-2">
                {showPreview ? (
                  <EyeOff className="h-4 w-4 text-slate-400" />
                ) : (
                  <Eye className="h-4 w-4 text-slate-400" />
                )}
                Preview highlights
                {annotations.length > 0 && (
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                    {annotations.length}
                  </span>
                )}
              </span>
              <span className="text-xs text-slate-400">{showPreview ? "Thu gọn" : "Mở rộng"}</span>
            </button>

            {showPreview && (
              <div className="border-t border-slate-200 bg-white px-5 py-5">
                {/* Chú thích màu */}
                <div className="mb-4 flex flex-wrap gap-3">
                  {HIGHLIGHT_TYPES.map((t) => (
                    <span key={t.value} className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span className={`h-2 w-2 rounded-full ${t.dot}`} />
                      {t.label}
                    </span>
                  ))}
                </div>

                {!essayContent ? (
                  <p className="text-sm text-slate-400 italic">Chưa có nội dung bài viết.</p>
                ) : annotations.length === 0 ? (
                  <p className="whitespace-pre-wrap text-sm leading-8 text-slate-700">{essayContent}</p>
                ) : (
                  <p className="whitespace-pre-wrap text-sm leading-8 text-slate-700">
                    {buildSegments(essayContent, annotations).map((seg) => {
                      if (!seg.ann) return <span key={seg.id}>{seg.text}</span>;
                      const style = HIGHLIGHT_MAP[seg.ann.highlightType];
                      return (
                        <mark
                          key={seg.id}
                          title={seg.ann.explanation}
                          className={`rounded-sm px-0.5 cursor-help ${style.markBg}`}
                        >
                          {seg.text}
                        </mark>
                      );
                    })}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Cột phải ── */}
        <div className="flex w-80 shrink-0 flex-col gap-5">
          {/* Chủ đề */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Chủ đề <span className="text-red-500">*</span>
            </label>
            <select
              {...register("topicId", { required: "Vui lòng chọn chủ đề" })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">-- Chọn chủ đề --</option>
              {topics.map((t) => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>
            {errors.topicId && (
              <p className="mt-1.5 text-xs text-red-500">{errors.topicId.message}</p>
            )}
          </div>

          {/* Target Band */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Target Band</label>
            <select
              {...register("targetBand")}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              {Object.entries(TARGET_BAND_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          {/* Tác giả + Band score */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Tác giả</label>
              <input
                {...register("authorName")}
                placeholder="Tên tác giả"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Band Score</label>
              <input
                type="number"
                step="0.5"
                min={0}
                max={9}
                {...register("overallBandScore", { valueAsNumber: true })}
                placeholder="7.5"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Trạng thái */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Trạng thái</label>
            <select
              {...register("isPublished")}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="true">Xuất bản</option>
              <option value="false">Nháp</option>
            </select>
          </div>

          {/* ── Highlights ── */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">
                Highlights
                {annotations.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                    {annotations.length}
                  </span>
                )}
              </span>
              {!isFormOpen && (
                <button
                  type="button"
                  onClick={openAdd}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" /> Thêm
                </button>
              )}
            </div>

            {/* Danh sách annotations */}
            {annotations.length === 0 && !isFormOpen ? (
              <p className="text-xs italic text-slate-400">Chưa có highlight nào</p>
            ) : (
              <div className="flex flex-col gap-2">
                {annotations.map((ann, idx) => {
                  const style = HIGHLIGHT_MAP[ann.highlightType];
                  const isEditing = editingIdx === idx;
                  return (
                    <div
                      key={idx}
                      className={`rounded-lg border bg-white p-3 ${
                        isEditing ? "border-indigo-300" : "border-slate-200"
                      }`}
                    >
                      {isEditing ? (
                        <AnnotationForm
                          draft={draft}
                          onChange={setDraft}
                          onSave={saveAnnotation}
                          onCancel={cancelForm}
                        />
                      ) : (
                        <div>
                          <div className="mb-1.5 flex items-start justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className={`h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
                              <span className="text-xs font-semibold text-slate-700">{style.label}</span>
                            </div>
                            <div className="flex shrink-0 items-center gap-0.5">
                              <button
                                type="button"
                                onClick={() => openEdit(idx)}
                                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteAnnotation(idx)}
                                className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                          <p
                            className={`mb-1.5 inline-block max-w-full truncate rounded px-1.5 py-0.5 text-xs font-medium ${style.markBg} text-slate-800`}
                          >
                            &ldquo;{ann.text.length > 55 ? ann.text.slice(0, 55) + "…" : ann.text}&rdquo;
                          </p>
                          <p className="text-xs leading-relaxed text-slate-500">{ann.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}

                {addingNew && (
                  <div className="rounded-lg border border-indigo-300 bg-white p-3">
                    <AnnotationForm
                      draft={draft}
                      onChange={setDraft}
                      onSave={saveAnnotation}
                      onCancel={cancelForm}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Nút lưu / hủy */}
          <div className="mt-auto flex flex-col gap-2 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {isPending ? "Đang lưu..." : essay ? "Lưu thay đổi" : "Tạo bài mẫu"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/sample-essays")}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
