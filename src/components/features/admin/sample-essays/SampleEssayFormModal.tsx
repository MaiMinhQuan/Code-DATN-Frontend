"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { useCreateSampleEssay, useUpdateSampleEssay } from "@/hooks/useAdminSampleEssays";
import { useTopics } from "@/hooks/useTopics";
import type { SampleEssay } from "@/types/sample-essay.types";
import type { CreateSampleEssayDto } from "@/types/admin.types";
import { TargetBand } from "@/types/enums";

const TARGET_BAND_LABELS: Record<TargetBand, string> = {
  BAND_5_0: "Band 5.0",
  BAND_6_0: "Band 6.0",
  BAND_7_PLUS: "Band 7+",
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  essay: SampleEssay | null;
}

export function SampleEssayFormModal({ isOpen, onClose, essay }: Props) {
  const createEssay = useCreateSampleEssay();
  const updateEssay = useUpdateSampleEssay();
  const { data: topics = [] } = useTopics();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateSampleEssayDto>();

  useEffect(() => {
    if (isOpen) {
      reset(essay ? {
        title: essay.title,
        topicId: essay.topicId._id,
        questionPrompt: essay.questionPrompt,
        targetBand: essay.targetBand,
        outlineContent: essay.outlineContent,
        fullEssayContent: essay.fullEssayContent,
        isPublished: essay.isPublished,
        authorName: essay.authorName ?? "",
        overallBandScore: essay.overallBandScore,
      } : { targetBand: TargetBand.BAND_7_PLUS, isPublished: true });
    }
  }, [isOpen, essay, reset]);

  const onSubmit = handleSubmit((values) => {
    if (essay) {
      updateEssay.mutate({ id: essay._id, dto: values }, { onSuccess: onClose });
    } else {
      createEssay.mutate(values, { onSuccess: onClose });
    }
  });

  const isPending = createEssay.isPending || updateEssay.isPending;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm py-8">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            {essay ? "Chỉnh sửa bài mẫu" : "Thêm bài mẫu mới"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              {...register("title", { required: "Vui lòng nhập tiêu đề" })}
              placeholder="VD: Band 7.5 Essay — Environmental Pollution"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Chủ đề <span className="text-red-500">*</span>
              </label>
              <select
                {...register("topicId", { required: "Vui lòng chọn chủ đề" })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">-- Chọn chủ đề --</option>
                {topics.map((t) => (
                  <option key={t._id} value={t._id}>{t.name}</option>
                ))}
              </select>
              {errors.topicId && <p className="mt-1 text-xs text-red-500">{errors.topicId.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Target Band</label>
              <select
                {...register("targetBand")}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                {Object.entries(TARGET_BAND_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Nội dung đề thi <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("questionPrompt", { required: "Vui lòng nhập đề" })}
              rows={3}
              placeholder="You should spend about 40 minutes on this task..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Outline <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("outlineContent", { required: "Vui lòng nhập outline" })}
              rows={3}
              placeholder="Introduction: ...\nBody: ...\nConclusion: ..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Nội dung bài mẫu <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("fullEssayContent", { required: "Vui lòng nhập bài mẫu" })}
              rows={8}
              placeholder="Nội dung bài essay..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Tác giả</label>
              <input
                {...register("authorName")}
                placeholder="Tên tác giả"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Band score</label>
              <input
                type="number"
                step="0.5"
                min={0}
                max={9}
                {...register("overallBandScore", { valueAsNumber: true })}
                placeholder="7.5"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Trạng thái</label>
              <select
                {...register("isPublished")}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="true">Xuất bản</option>
                <option value="false">Nháp</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Hủy
            </button>
            <button type="submit" disabled={isPending}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
              {isPending ? "Đang lưu..." : essay ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
