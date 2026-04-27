// ─── NoteCollection ───────────────────────────────────────────────────────────

export interface NoteCollection {
  _id: string;
  userId: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCollectionPayload {
  name: string;
  color?: string;
}

export interface UpdateCollectionPayload {
  name?: string;
  color?: string;
}

// ─── Core entity ──────────────────────────────────────────────────────────────

export interface Note {
  _id: string;
  userId: string;
  title?: string;
  userDraftNote: string;
  collectionId?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Request payloads ─────────────────────────────────────────────────────────

export interface CreateNotePayload {
  userDraftNote: string;
  title?: string;
  collectionId?: string | null;
}

export interface UpdateNotePayload {
  userDraftNote?: string;
  title?: string;
  collectionId?: string | null;
}

// ─── Response shapes ──────────────────────────────────────────────────────────

export interface DeleteNoteResponse {
  message: string;
}
