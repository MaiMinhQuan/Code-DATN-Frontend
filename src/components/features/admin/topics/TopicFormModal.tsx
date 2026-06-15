"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { useCreateTopic, useUpdateTopic } from "@/hooks/useAdminTopics";
import type { Topic } from "@/types/topic.types";
import type { CreateTopicDto } from "@/types/admin.types";
import { UI_TEXT } from "@/constants/ui-text";

const T = UI_TEXT.ADMIN.TOPICS;
const C = UI_TEXT.ADMIN.COMMON;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  topic: Topic | null;
}

export function TopicFormModal({ isOpen, onClose, topic }: Props) {
  const createTopic = useCreateTopic();
  const updateTopic = useUpdateTopic();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateTopicDto & { isActive?: boolean; }>();

  useEffect(() => {
    if (isOpen) {
      const defaults = topic
        ? { name: topic.name, description: topic.description ?? "", isActive: topic.isActive }
        : { name: "", description: "", isActive: true };
      reset(defaults);
    }
  }, [isOpen, topic, reset]);

  const onSubmit = handleSubmit((values) => {
    if (topic) {
      updateTopic.mutate({ id: topic._id, dto: values }, { onSuccess: onClose });
    } else {
      createTopic.mutate(values, { onSuccess: onClose });
    }
  });

  const isPending = createTopic.isPending || updateTopic.isPending;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              {topic ? T.MODAL_EDIT_TITLE : T.MODAL_CREATE_TITLE}
            </h3>
            <p className="mt-0.5 text-xs text-slate-400">
              {topic ? `Đang chỉnh sửa: ${topic.name}` : T.MODAL_CREATE_HINT}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="px-6 py-5 space-y-5">
            {/* Topic name */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {T.LABEL_NAME} <span className="text-red-500">*</span>
              </label>
              <input
                {...register("name", { required: T.REQUIRED_NAME })}
                placeholder={T.PLACEHOLDER_NAME}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">{T.LABEL_DESC}</label>
              <textarea
                {...register("description")}
                rows={3}
                placeholder={T.PLACEHOLDER_DESC}
                className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Status */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">{T.LABEL_STATUS}</label>
              <select
                {...register("isActive")}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="true">{T.STATUS_ACTIVE}</option>
                <option value="false">{T.STATUS_HIDDEN}</option>
              </select>
              <p className="mt-1 text-xs text-slate-400">{T.STATUS_HIDDEN_HINT}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {C.BTN_CANCEL}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {isPending ? C.SAVING : topic ? C.BTN_SAVE : T.BTN_CREATE}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
