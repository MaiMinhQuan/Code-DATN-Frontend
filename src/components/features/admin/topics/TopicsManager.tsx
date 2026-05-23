"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { useAdminTopics, useDeleteTopic } from "@/hooks/useAdminTopics";
import { ConfirmDialog } from "@/components/features/admin/ConfirmDialog";
import { TopicFormModal } from "./TopicFormModal";
import type { Topic } from "@/types/topic.types";

export function TopicsManager() {
  const { data: topics = [], isLoading } = useAdminTopics();
  const deleteTopic = useDeleteTopic();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleEdit = (topic: Topic) => {
    setEditingTopic(topic);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingTopic(null);
    setModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    deleteTopic.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Chủ đề (Topics)</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            {isLoading ? "Đang tải..." : `${topics.length} chủ đề`}
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          Thêm chủ đề
        </button>
      </div>

      {/* Loading skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      ) : topics.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 text-center ring-1 ring-slate-200">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <Tag className="h-7 w-7 text-slate-400" />
          </div>
          <p className="font-medium text-slate-600">Chưa có chủ đề nào</p>
          <p className="mt-1 text-sm text-slate-400">Nhấn "Thêm chủ đề" để bắt đầu</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <TopicCard
              key={topic._id}
              topic={topic}
              onEdit={() => handleEdit(topic)}
              onDelete={() => setDeleteId(topic._id)}
            />
          ))}
        </div>
      )}

      <TopicFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        topic={editingTopic}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Xóa chủ đề"
        message="Bạn có chắc muốn xóa chủ đề này? Hành động này không thể hoàn tác."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
        isLoading={deleteTopic.isPending}
      />
    </div>
  );
}

interface TopicCardProps {
  topic: Topic;
  onEdit: () => void;
  onDelete: () => void;
}

function TopicCard({ topic, onEdit, onDelete }: TopicCardProps) {
  return (
    <div className="group relative flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md">
      {/* Status badge */}
      <span
        className={`absolute right-4 top-4 rounded-full px-2.5 py-0.5 text-xs font-medium ${
          topic.isActive
            ? "bg-emerald-100 text-emerald-700"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        {topic.isActive ? "Hoạt động" : "Ẩn"}
      </span>

      {/* Icon + Name */}
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
          <Tag className="h-6 w-6 text-indigo-400" />
        </div>
        <div className="min-w-0 flex-1 pr-14">
          <p className="truncate font-semibold text-slate-900">{topic.name}</p>
          <p className="mt-0.5 font-mono text-xs text-slate-400">{topic.slug}</p>
        </div>
      </div>

      {/* Description */}
      <p className="mb-4 line-clamp-2 min-h-[2.5rem] flex-1 text-sm text-slate-500">
        {topic.description || <span className="italic text-slate-300">Chưa có mô tả</span>}
      </p>

      {/* Footer: actions */}
      <div className="flex items-center justify-end border-t border-slate-100 pt-3">
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={onEdit}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
            title="Chỉnh sửa"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
            title="Xóa"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
