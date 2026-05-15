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

// Shape response của POST /auth/login và POST /auth/register.
export interface AuthResponse {
  access_token: string;
  user: User;
}
