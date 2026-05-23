"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useCreateExamQuestion, useUpdateExamQuestion } from "@/hooks/useAdminExamQuestions";
import { useTopics } from "@/hooks/useTopics";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import type { ExamQuestion } from "@/types/exam-question.types";
import type { CreateExamQuestionDto } from "@/types/admin.types";

interface Props {
  question?: ExamQuestion;
}

export function ExamQuestionForm({ question }: Props) {
  const router = useRouter();
  const createQuestion = useCreateExamQuestion();
  const updateQuestion = useUpdateExamQuestion();
  const { data: topics = [] } = useTopics();

  const [outlineHtml, setOutlineHtml] = useState(question?.suggestedOutline ?? "");

  const { register, handleSubmit, reset, setValue, formState: { errors } } =
    useForm<CreateExamQuestionDto>();

  useEffect(() => {
    const outline = question?.suggestedOutline ?? "";
    reset(question ? {
      title: question.title,
      topicId: question.topicId?._id ?? "",
      questionPrompt: question.questionPrompt,
      suggestedOutline: outline,
      difficultyLevel: question.difficultyLevel,
      isPublished: question.isPublished,
      sourceReference: question.sourceReference ?? "",
    } : { difficultyLevel: 2, isPublished: true });
    setOutlineHtml(outline);
  }, [question, reset]);

  useEffect(() => {
    if (question && topics.length > 0) {
      setValue("topicId", question.topicId?._id ?? "", { shouldDirty: false });
    }
  }, [question, topics, setValue]);

  const onSubmit = handleSubmit((values) => {
    const payload = {
      ...values,
      suggestedOutline: outlineHtml,
      isPublished: (values.isPublished as unknown as string) === "true" || values.isPublished === true,
      difficultyLevel: Number(values.difficultyLevel),
    };

    if (question) {
      updateQuestion.mutate({ id: question._id, dto: payload }, {
        onSuccess: () => router.push("/admin/exam-questions"),
      });
    } else {
      createQuestion.mutate(payload, {
        onSuccess: () => router.push("/admin/exam-questions"),
      });
    }
  });

  const isPending = createQuestion.isPending || updateQuestion.isPending;

  return (
    <form onSubmit={onSubmit}>
      <div className="flex gap-6">
        {/* Cột trái — nội dung chính */}
        <div className="flex flex-1 flex-col gap-5 min-w-0">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Tiêu đề đề thi <span className="text-red-500">*</span>
            </label>
            <input
              {...register("title", { required: "Vui lòng nhập tiêu đề" })}
              placeholder="VD: Task 2 — Environment and Climate Change"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            {errors.title && <p className="mt-1.5 text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Nội dung đề thi <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("questionPrompt", { required: "Vui lòng nhập nội dung đề" })}
              rows={5}
              placeholder="You should spend about 40 minutes on this task. Write about the following topic..."
              className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            {errors.questionPrompt && <p className="mt-1.5 text-xs text-red-500">{errors.questionPrompt.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Gợi ý outline</label>
            <RichTextEditor
              value={outlineHtml}
              onChange={(html) => {
                setOutlineHtml(html);
                setValue("suggestedOutline", html, { shouldDirty: true });
              }}
              placeholder="Introduction: ...&#10;Body 1: ...&#10;Body 2: ...&#10;Conclusion: ..."
              minHeight="10rem"
            />
          </div>
        </div>

        {/* Cột phải — metadata */}
        <div className="flex w-56 shrink-0 flex-col gap-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Chủ đề</label>
            <select
              {...register("topicId")}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">-- Không có --</option>
              {topics.map((t) => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Độ khó</label>
            <select
              {...register("difficultyLevel")}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="1">Dễ</option>
              <option value="2">Trung bình</option>
              <option value="3">Khó</option>
            </select>
          </div>

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

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Nguồn tham khảo</label>
            <input
              {...register("sourceReference")}
              placeholder="Cambridge IELTS 15, Test 1"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="mt-auto flex flex-col gap-2 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {isPending ? "Đang lưu..." : question ? "Lưu thay đổi" : "Tạo đề thi"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/exam-questions")}
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
