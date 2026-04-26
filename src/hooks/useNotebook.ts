import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notebookService } from "@/services/notebook.service";
import type { CreateNotePayload, UpdateNotePayload } from "@/types/notebook.types";

export const noteKeys = {
  all:     ["notebook"] as const,
  lists:   () => [...noteKeys.all, "list"]       as const,
  details: () => [...noteKeys.all, "detail"]     as const,
  detail:  (id: string) => [...noteKeys.details(), id] as const,
};

export function useNotes() {
  return useQuery({
    queryKey: noteKeys.lists(),
    queryFn:  () => notebookService.getNotes(),
    staleTime: 2 * 60 * 1000, // 2 phút — ghi chú thay đổi thường xuyên hơn bài mẫu
  });
}

export function useNote(id: string) {
  return useQuery({
    queryKey: noteKeys.detail(id),
    queryFn:  () => notebookService.getNoteById(id),
    enabled:  !!id,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateNotePayload) =>
      notebookService.createNote(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: noteKeys.lists() });
    },
  });
}

export function useUpdateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateNotePayload }) =>
      notebookService.updateNote(id, payload),
    onSuccess: (updatedNote) => {
      // Cập nhật luôn cache của item detail — tránh phải fetch lại
      qc.setQueryData(noteKeys.detail(updatedNote._id), updatedNote);
      qc.invalidateQueries({ queryKey: noteKeys.lists() });
    },
  });
}

export function useDeleteNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notebookService.deleteNote(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: noteKeys.lists() });
    },
  });
}
