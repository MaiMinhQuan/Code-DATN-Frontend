// Layout gốc của ứng dụng: nạp metadata, font toàn cục và provider dùng chung.
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { UI_TEXT } from "@/constants/ui-text";

// Metadata mặc định cho toàn bộ website.
export const metadata: Metadata = {
  title: UI_TEXT.META.SITE_NAME,
  description: UI_TEXT.META.SITE_DESCRIPTION,
};

// Khởi tạo font Geist và ánh xạ vào CSS variable để dùng trong Tailwind.
const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

/*
Component RootLayout.

Input:
- children — nội dung trang con được render bên trong layout.

Output:
- Khung HTML gốc (`html`, `body`) đã gắn font và provider toàn cục.
*/
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${geist.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
