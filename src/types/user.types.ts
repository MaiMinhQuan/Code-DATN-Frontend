// Type cho User và response auth từ backend.
import { UserRole } from "./enums";

export interface User {
  _id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  avatarUrl?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Shape response của POST /auth/login (backend trả camelCase).
export interface LoginResponse {
  accessToken: string;
  user: Pick<User, "_id" | "email" | "fullName" | "role">;
}
