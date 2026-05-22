"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { useCreateExamQuestion, useUpdateExamQuestion } from "@/hooks/useAdminExamQuestions";
import { useTopics } from "@/hooks/useTopics";
import type { ExamQuestion } from "@/types/exam-question.types";
import type { CreateExamQuestionDto } from "@/types/admin.types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  question: ExamQuestion | null;
}

export function ExamQuestionFormModal({ isOpen, onClose, question }: Props) {
  const createQuestion = useCreateExamQuestion();
  const updateQuestion = useUpdateExamQuestion();
  const { data: topics = [] } = useTopics();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateExamQuestionDto & { tagsStr?: string }>();

  useEffect(() => {
    if (isOpen) {
      reset(question ? {
        title: question.title,
        topicId: question.topicId?._id ?? "",
        questionPrompt: question.questionPrompt,
        suggestedOutline: question.suggestedOutline ?? "",
        difficultyLevel: question.difficultyLevel,
        isPublished: question.isPublished,
        sourceReference: question.sourceReference ?? "",
        tagsStr: question.tags.join(", "),
      } : { difficultyLevel: 3, isPublished: true });
    }
  }, [isOpen, question, reset]);

  const onSubmit = handleSubmit(({ tagsStr, ...values }) => {
    const dto: CreateExamQuestionDto = {
      ...values,
      tags: tagsStr ? tagsStr.split(",").map((t) => t.trim()).filter(Boolean) : [],
    };

    if (question) {
      updateQuestion.mutate({ id: question._id, dto }, { onSuccess: onClose });
    } else {
      createQuestion.mutate(dto, { onSuccess: onClose });
    }
  });

  const isPending = createQuestion.isPending || updateQuestion.isPending;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm py-8">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            {question ? "Chỉnh sửa đề thi" : "Thêm đề thi mới"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Tiêu đề đề thi <span className="text-red-500">*</span>
            </label>
            <input
              {...register("title", { required: "Vui lòng nhập tiêu đề" })}
              placeholder="VD: Task 2 — Environment and Climate Change"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Nội dung đề thi <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("questionPrompt", { required: "Vui lòng nhập nội dung đề" })}
              rows={4}
              placeholder="You should spend about 40 minutes on this task. Write about the following topic..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            {errors.questionPrompt && <p className="mt-1 text-xs text-red-500">{errors.questionPrompt.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Gợi ý outline</label>
            <textarea
              {...register("suggestedOutline")}
              rows={3}
              placeholder="Introduction: ...\nBody 1: ...\nBody 2: ...\nConclusion: ..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Chủ đề</label>
              <select
                {...register("topicId")}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">-- Không có --</option>
                {topics.map((t) => (
                  <option key={t._id} value={t._id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Độ khó (1-5)</label>
              <input
                type="number"
                min={1}
                max={5}
                {...register("difficultyLevel", { valueAsNumber: true, min: 1, max: 5 })}
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

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Tags (phân cách bởi dấu phẩy)</label>
            <input
              {...register("tagsStr")}
              placeholder="environment, climate, technology"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Nguồn tham khảo</label>
            <input
              {...register("sourceReference")}
              placeholder="Cambridge IELTS 15, Test 1"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Hủy
            </button>
            <button type="submit" disabled={isPending}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
              {isPending ? "Đang lưu..." : question ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
