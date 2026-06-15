"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { useCreateSampleEssay, useUpdateSampleEssay } from "@/hooks/useAdminSampleEssays";
import { useTopics } from "@/hooks/useTopics";
import type { SampleEssay } from "@/types/sample-essay.types";
import type { CreateSampleEssayDto } from "@/types/admin.types";
import { UI_TEXT } from "@/constants/ui-text";

const T = UI_TEXT.ADMIN.SAMPLE_ESSAYS;
const C = UI_TEXT.ADMIN.COMMON;

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
        outlineContent: essay.outlineContent,
        fullEssayContent: essay.fullEssayContent,
        isPublished: essay.isPublished,
        authorName: essay.authorName ?? "",
        overallBandScore: essay.overallBandScore,
      } : { overallBandScore: 7, isPublished: true });
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
            {essay ? T.MODAL_EDIT_TITLE : T.MODAL_CREATE_TITLE}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              {T.FORM_LABEL_TITLE} <span className="text-red-500">*</span>
            </label>
            <input
              {...register("title", { required: T.FORM_REQ_TITLE })}
              placeholder={T.FORM_PH_TITLE}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              {T.FORM_LABEL_TOPIC} <span className="text-red-500">*</span>
            </label>
            <select
              {...register("topicId", { required: T.FORM_REQ_TOPIC })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">{C.SELECT_TOPIC}</option>
              {topics.map((t) => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>
            {errors.topicId && <p className="mt-1 text-xs text-red-500">{errors.topicId.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              {T.FORM_LABEL_PROMPT} <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("questionPrompt", { required: T.FORM_REQ_PROMPT })}
              rows={3}
              placeholder={T.FORM_PH_PROMPT}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              {T.FORM_LABEL_OUTLINE} <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("outlineContent", { required: T.FORM_REQ_OUTLINE })}
              rows={3}
              placeholder={T.FORM_PH_OUTLINE}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              {T.FORM_LABEL_CONTENT} <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("fullEssayContent", { required: T.FORM_REQ_CONTENT })}
              rows={8}
              placeholder={T.FORM_PH_CONTENT}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">{T.FORM_LABEL_AUTHOR}</label>
              <input
                {...register("authorName")}
                placeholder={T.FORM_PH_AUTHOR}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                {T.FORM_LABEL_BAND} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.5"
                min={0}
                max={9}
                {...register("overallBandScore", {
                  valueAsNumber: true,
                  required: T.FORM_REQ_BAND,
                  min: { value: 0, message: T.FORM_VAL_BAND },
                  max: { value: 9, message: T.FORM_VAL_BAND },
                })}
                placeholder="7.5"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
              {errors.overallBandScore && (
                <p className="mt-1 text-xs text-red-500">{errors.overallBandScore.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">{T.FORM_LABEL_STATUS}</label>
              <select
                {...register("isPublished")}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="true">{T.STATUS_PUBLISHED}</option>
                <option value="false">{T.STATUS_DRAFT}</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              {C.BTN_CANCEL}
            </button>
            <button type="submit" disabled={isPending}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
              {isPending ? C.SAVING : essay ? C.BTN_UPDATE : T.BTN_CREATE}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
