// React Query hooks cho note collections (thư mục màu).

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { noteCollectionsService } from "@/services/note-collections.service";
import type { CreateCollectionPayload, UpdateCollectionPayload } from "@/types/notebook.types";
import { noteKeys } from "./useNotebook";

// Factory query key cho cache note collections.
export const collectionKeys = {
  all:   ["note-collections"] as const,

  lists: () => [...collectionKeys.all, "list"] as const,
};

/*
Hook lấy danh sách collections của user hiện tại.

Output:
- Kết quả useQuery chứa danh sách collections.
*/
export function useNoteCollections() {
  return useQuery({
    queryKey: collectionKeys.lists(),
    queryFn:  () => noteCollectionsService.getCollections(),
    staleTime: 5 * 60 * 1000,
  });
}

/*
Hook tạo collection mới và làm mới cache danh sách collections.
*/
export function useCreateCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCollectionPayload) =>
      noteCollectionsService.createCollection(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: collectionKeys.lists() });
    },
  });
}

/*
Hook cập nhật collection (name/color) và làm mới cache danh sách.
*/
export function useUpdateCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCollectionPayload }) =>
      noteCollectionsService.updateCollection(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: collectionKeys.lists() });
    },
  });
}

/*
Hook xóa collection và invalidate cả cache collections lẫn notes.
*/
export function useDeleteCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => noteCollectionsService.deleteCollection(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: collectionKeys.lists() });
      // Notes theo collection cũ có thể stale, cần refresh
      qc.invalidateQueries({ queryKey: noteKeys.lists() });
    },
  });
}
