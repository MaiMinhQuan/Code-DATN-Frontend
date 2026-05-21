"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { useCreateTopic, useUpdateTopic } from "@/hooks/useAdminTopics";
import type { Topic } from "@/types/topic.types";
import type { CreateTopicDto } from "@/types/admin.types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  topic: Topic | null;
}

export function TopicFormModal({ isOpen, onClose, topic }: Props) {
  const createTopic = useCreateTopic();
  const updateTopic = useUpdateTopic();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateTopicDto & { isActive?: boolean }>();

  useEffect(() => {
    if (isOpen) {
      reset(topic ? {
        name: topic.name,
        description: topic.description ?? "",
        iconUrl: topic.iconUrl ?? "",
        orderIndex: topic.orderIndex,
        isActive: topic.isActive,
      } : { orderIndex: 0, isActive: true });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            {topic ? "Chỉnh sửa chủ đề" : "Thêm chủ đề mới"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Tên chủ đề <span className="text-red-500">*</span>
            </label>
            <input
              {...register("name", { required: "Vui lòng nhập tên" })}
              placeholder="VD: Academic Writing"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Mô tả</label>
            <textarea
              {...register("description")}
              rows={2}
              placeholder="Mô tả ngắn về chủ đề..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Thứ tự</label>
              <input
                type="number"
                {...register("orderIndex", { valueAsNumber: true })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Trạng thái</label>
              <select
                {...register("isActive")}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="true">Hoạt động</option>
                <option value="false">Ẩn</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">URL Icon</label>
            <input
              {...register("iconUrl")}
              placeholder="https://..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {isPending ? "Đang lưu..." : topic ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
