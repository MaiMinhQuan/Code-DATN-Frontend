import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { UI_TEXT } from "@/constants/ui-text";

export const metadata: Metadata = {
  title: UI_TEXT.META.SITE_NAME,
  description: UI_TEXT.META.SITE_DESCRIPTION,
};

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

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
