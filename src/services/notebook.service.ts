import { apiClient } from "./api.client";
import type {
  Note,
  CreateNotePayload,
  UpdateNotePayload,
  DeleteNoteResponse,
} from "@/types/notebook.types";

export const notebookService = {

  // GET /api/notebook — lấy tất cả ghi chú của user hiện tại
  getNotes: async (): Promise<Note[]> => {
    const { data } = await apiClient.get<Note[]>("/notebook");
    return data;
  },

  // GET /api/notebook/:id
  getNoteById: async (id: string): Promise<Note> => {
    const { data } = await apiClient.get<Note>(`/notebook/${id}`);
    return data;
  },

  // POST /api/notebook
  createNote: async (payload: CreateNotePayload): Promise<Note> => {
    const { data } = await apiClient.post<Note>("/notebook", payload);
    return data;
  },

  // PATCH /api/notebook/:id
  updateNote: async (id: string, payload: UpdateNotePayload): Promise<Note> => {
    const { data } = await apiClient.patch<Note>(`/notebook/${id}`, payload);
    return data;
  },

  // DELETE /api/notebook/:id — trả về { message }
  deleteNote: async (id: string): Promise<DeleteNoteResponse> => {
    const { data } = await apiClient.delete<DeleteNoteResponse>(`/notebook/${id}`);
    return data;
  },

};
