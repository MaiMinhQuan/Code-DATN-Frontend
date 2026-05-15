// Module augmentation cho NextAuth: mở rộng Session/User/JWT với field của app.
import { UserRole } from "./enums";

declare module "next-auth" {
  // Session mở rộng — thêm JWT từ backend + role/id của user.
  interface Session {
    accessToken: string;
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
    };
  }

  // User mở rộng — thêm accessToken và role trả về từ `authorize`.
  interface User {
    accessToken: string;
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  // JWT mở rộng — lưu token/role/id giữa các request.
  interface JWT {
    accessToken: string;
    role: UserRole;
    id: string;
  }
}
