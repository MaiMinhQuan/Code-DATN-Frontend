"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Chủ đề (Topics)</h2>
          <p className="text-sm text-slate-500">{topics.length} chủ đề</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Thêm chủ đề
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : topics.length === 0 ? (
        <div className="rounded-xl bg-white py-12 text-center text-slate-400 ring-1 ring-slate-200">
          Chưa có chủ đề nào
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Tên</th>
                <th className="px-4 py-3 text-left">Slug</th>
                <th className="px-4 py-3 text-center">Thứ tự</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topics.map((topic) => (
                <tr key={topic._id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{topic.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{topic.slug}</td>
                  <td className="px-4 py-3 text-center text-slate-600">{topic.orderIndex}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        topic.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {topic.isActive ? "Hoạt động" : "Ẩn"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(topic)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(topic._id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
