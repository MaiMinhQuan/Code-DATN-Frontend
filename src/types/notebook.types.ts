// ─── Core entity ──────────────────────────────────────────────────────────────

export interface Note {
  _id: string;
  userId: string;
  title?: string;
  userDraftNote: string;   // nội dung ghi chú (plain text hoặc markdown)
  createdAt: string;
  updatedAt: string;
}

// ─── Request payloads ─────────────────────────────────────────────────────────

export interface CreateNotePayload {
  userDraftNote: string;
  title?: string;
}

export interface UpdateNotePayload {
  userDraftNote?: string;
  title?: string;
}

// ─── Response shapes ──────────────────────────────────────────────────────────

export interface DeleteNoteResponse {
  message: string;
}
