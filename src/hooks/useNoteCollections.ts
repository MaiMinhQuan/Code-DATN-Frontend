import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { noteCollectionsService } from "@/services/note-collections.service";
import type { CreateCollectionPayload, UpdateCollectionPayload } from "@/types/notebook.types";
import { noteKeys } from "./useNotebook";

export const collectionKeys = {
  all:   ["note-collections"] as const,
  lists: () => [...collectionKeys.all, "list"] as const,
};

export function useNoteCollections() {
  return useQuery({
    queryKey: collectionKeys.lists(),
    queryFn:  () => noteCollectionsService.getCollections(),
    staleTime: 5 * 60 * 1000,
  });
}

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

export function useDeleteCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => noteCollectionsService.deleteCollection(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: collectionKeys.lists() });
      qc.invalidateQueries({ queryKey: noteKeys.lists() });
    },
  });
}
