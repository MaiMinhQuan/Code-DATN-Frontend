// Cây provider gốc của app: NextAuth, React Query, Tooltip và Toaster.
"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";

/*
Component Providers.

Input:
- children — toàn bộ cây component con của ứng dụng.

Output:
- Trả về cây provider bọc app để dùng auth, query cache, tooltip và toast.
*/
export function Providers({ children }: { children: React.ReactNode }) {
  // Khởi tạo QueryClient một lần cho mỗi vòng đời component
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,       // Giữ dữ liệu "fresh" trong 60 giây
            retry: 1,                    // Retry tối đa 1 lần khi query lỗi
            refetchOnWindowFocus: false, // Không tự refetch khi quay lại tab
          },
        },
      })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={200}>
          {children}
          {/* Toaster toàn cục hiển thị thông báo góc phải trên */}
          <Toaster richColors position="top-right" />
        </TooltipProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
