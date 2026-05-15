// React Query hooks cho notebook notes (CRUD).

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notebookService } from "@/services/notebook.service";
import type { CreateNotePayload, UpdateNotePayload } from "@/types/notebook.types";

// Factory query key cho cache notebook notes.
export const noteKeys = {
  all:     ["notebook"] as const,

  lists:   () => [...noteKeys.all, "list"]                    as const,

  // Sinh key danh sách notes theo collectionId (null = tất cả notes).
  list:    (filter?: string) => [...noteKeys.lists(), filter ?? null] as const,

  details: () => [...noteKeys.all, "detail"]                  as const,

  // Sinh key chi tiết note theo id.
  detail:  (id: string) => [...noteKeys.details(), id]        as const,
};

/*
Hook lấy danh sách notes, có thể lọc theo collection.

Input:
- collectionId — collectionId (optional).

Output:
- Kết quả useQuery chứa danh sách notes.
*/
export function useNotes(collectionId?: string) {
  return useQuery({
    queryKey: noteKeys.list(collectionId),
    queryFn:  () => notebookService.getNotes(collectionId),
    staleTime: 2 * 60 * 1000,
  });
}

/*
Hook lấy chi tiết note theo id.

Input:
- id — noteId.

Output:
- Kết quả useQuery chứa chi tiết note.
*/
export function useNote(id: string) {
  return useQuery({
    queryKey: noteKeys.detail(id),
    queryFn:  () => notebookService.getNoteById(id),
    enabled:  !!id,
    staleTime: 2 * 60 * 1000,
  });
}

/*
Hook tạo note mới và invalidate toàn bộ cache danh sách notes.
*/
export function useCreateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateNotePayload) =>
      notebookService.createNote(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: noteKeys.lists(), refetchType: "all" });
    },
  });
}

/*
Hook cập nhật note và làm mới cache liên quan.
*/
export function useUpdateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateNotePayload }) =>
      notebookService.updateNote(id, payload),
    onSuccess: (updatedNote) => {
      // Ghi trực tiếp note mới vào cache detail
      qc.setQueryData(noteKeys.detail(updatedNote._id), updatedNote);
      // Xóa cache list để các màn hình collection fetch lại dữ liệu mới
      qc.removeQueries({ queryKey: noteKeys.lists() });
    },
  });
}

/*
Hook xóa note và invalidate toàn bộ cache danh sách notes.
*/
export function useDeleteNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notebookService.deleteNote(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: noteKeys.lists(), refetchType: "all" });
    },
  });
}
