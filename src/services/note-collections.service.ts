// Service gọi API note collections (thư mục màu để phân loại notes).

import { apiClient } from "./api.client";
import type {
  NoteCollection,
  CreateCollectionPayload,
  UpdateCollectionPayload,
} from "@/types/notebook.types";

export const noteCollectionsService = {
  /*
  Lấy danh sách collections của user hiện tại.
  Output:
  - Danh sách NoteCollection.
  */
  getCollections: async (): Promise<NoteCollection[]> => {
    const { data } = await apiClient.get<NoteCollection[]>("/note-collections");
    return data;
  },

  /*
  Tạo mới một collection.
  Input:
  - payload — dữ liệu tạo collection.
  Output:
  - NoteCollection.
  */
  createCollection: async (payload: CreateCollectionPayload): Promise<NoteCollection> => {
    const { data } = await apiClient.post<NoteCollection>("/note-collections", payload);
    return data;
  },

  /*
  Cập nhật collection (name/color).
  Input:
  - id — collectionId.
  - payload — fields cần cập nhật.
  Output:
  - NoteCollection.
  */
  updateCollection: async (id: string, payload: UpdateCollectionPayload): Promise<NoteCollection> => {
    const { data } = await apiClient.patch<NoteCollection>(`/note-collections/${id}`, payload);
    return data;
  },

  /*
  Xoá collection (các note bên trong có thể trở thành uncategorized).
  Input:
  - id — collectionId.
  Output:
  - { message }.
  */
  deleteCollection: async (id: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete<{ message: string }>(`/note-collections/${id}`);
    return data;
  },
};
