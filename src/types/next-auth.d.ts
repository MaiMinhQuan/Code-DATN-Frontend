import { UserRole } from "./enums";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
    };
  }
  interface User {
    accessToken: string;
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    role: UserRole;
    id: string;
  }
}
