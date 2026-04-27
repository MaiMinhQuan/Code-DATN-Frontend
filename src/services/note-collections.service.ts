import { apiClient } from "./api.client";
import type {
  NoteCollection,
  CreateCollectionPayload,
  UpdateCollectionPayload,
} from "@/types/notebook.types";

export const noteCollectionsService = {
  getCollections: async (): Promise<NoteCollection[]> => {
    const { data } = await apiClient.get<NoteCollection[]>("/note-collections");
    return data;
  },

  createCollection: async (payload: CreateCollectionPayload): Promise<NoteCollection> => {
    const { data } = await apiClient.post<NoteCollection>("/note-collections", payload);
    return data;
  },

  updateCollection: async (id: string, payload: UpdateCollectionPayload): Promise<NoteCollection> => {
    const { data } = await apiClient.patch<NoteCollection>(`/note-collections/${id}`, payload);
    return data;
  },

  deleteCollection: async (id: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete<{ message: string }>(`/note-collections/${id}`);
    return data;
  },
};
