// Service gọi API notebook notes (CRUD).

import { apiClient } from "./api.client";
import type {
  Note,
  CreateNotePayload,
  UpdateNotePayload,
  DeleteNoteResponse,
} from "@/types/notebook.types";

export const notebookService = {
  /*
  Lấy danh sách notes của user hiện tại, có thể lọc theo collection.
  Nếu không truyền `collectionId` thì lấy tất cả notes.
  Input:
  - collectionId — collectionId (optional).
  Output:
  - Danh sách Note.
  */
  getNotes: async (collectionId?: string): Promise<Note[]> => {
    const params = collectionId ? { collectionId } : {}; // omit param entirely for "all notes" view
    const { data } = await apiClient.get<Note[]>("/notebook", { params });
    return data;
  },

  /*
  Lấy chi tiết note theo id.
  Input:
  - id — noteId.
  Output:
  - Note.
  */
  getNoteById: async (id: string): Promise<Note> => {
    const { data } = await apiClient.get<Note>(`/notebook/${id}`);
    return data;
  },

  /*
  Tạo note mới (có thể gắn với collection).
  Input:
  - payload — dữ liệu tạo note.
  Output:
  - Note.
  */
  createNote: async (payload: CreateNotePayload): Promise<Note> => {
    const { data } = await apiClient.post<Note>("/notebook", payload);
    return data;
  },

  /*
  Cập nhật note hiện có (title/content/collectionId).
  Input:
  - id — noteId.
  - payload — fields cần cập nhật.
  Output:
  - Note.
  */
  updateNote: async (id: string, payload: UpdateNotePayload): Promise<Note> => {
    const { data } = await apiClient.patch<Note>(`/notebook/${id}`, payload);
    return data;
  },

  /*
  Xoá vĩnh viễn một note.
  Input:
  - id — noteId.
  Output:
  - DeleteNoteResponse.
  */
  deleteNote: async (id: string): Promise<DeleteNoteResponse> => {
    const { data } = await apiClient.delete<DeleteNoteResponse>(`/notebook/${id}`);
    return data;
  },
};
