import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notebookService } from "@/services/notebook.service";
import type { CreateNotePayload, UpdateNotePayload } from "@/types/notebook.types";

export const noteKeys = {
  all:     ["notebook"] as const,
  lists:   () => [...noteKeys.all, "list"]                    as const,
  list:    (filter?: string) => [...noteKeys.lists(), filter ?? null] as const,
  details: () => [...noteKeys.all, "detail"]                  as const,
  detail:  (id: string) => [...noteKeys.details(), id]        as const,
};

export function useNotes(collectionId?: string) {
  return useQuery({
    queryKey: noteKeys.list(collectionId),
    queryFn:  () => notebookService.getNotes(collectionId),
    staleTime: 2 * 60 * 1000,
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
      qc.invalidateQueries({ queryKey: noteKeys.lists(), refetchType: "all" });
    },
  });
}

export function useUpdateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateNotePayload }) =>
      notebookService.updateNote(id, payload),
    onSuccess: (updatedNote) => {
      qc.setQueryData(noteKeys.detail(updatedNote._id), updatedNote);
      // refetchType: "all" — refetch cả active lẫn inactive queries
      // đảm bảo collection vừa được gán cũng nhận data mới dù chưa được xem
      qc.invalidateQueries({ queryKey: noteKeys.lists(), refetchType: "all" });
    },
  });
}

export function useDeleteNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notebookService.deleteNote(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: noteKeys.lists(), refetchType: "all" });
    },
  });
}
