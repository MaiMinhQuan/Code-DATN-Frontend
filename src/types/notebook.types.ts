// Type cho notebook notes và note collections (kèm request/response).

// Collection nhóm các note, có màu hex để phân biệt.
export interface NoteCollection {
  _id: string;
  userId: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

// Payload POST /note-collections.
export interface CreateCollectionPayload {
  name: string;
  color?: string;
}

// Payload PATCH /note-collections/:id.
export interface UpdateCollectionPayload {
  name?: string;
  color?: string;
}

// Một note thuộc user đã đăng nhập.
export interface Note {
  _id: string;
  userId: string;
  title?: string;
  userDraftNote: string;
  collectionId?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Payload POST /notebook.
export interface CreateNotePayload {
  userDraftNote: string;
  title?: string;
  collectionId?: string | null;
}

// Payload PATCH /notebook/:id.
export interface UpdateNotePayload {
  userDraftNote?: string;
  title?: string;
  collectionId?: string | null;
}

// Shape response của DELETE /notebook/:id.
export interface DeleteNoteResponse {
  message: string;
}
