// Utility helper dùng chung, hiện tại export hàm `cn` để gộp class Tailwind an toàn.
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/*
Gộp nhiều class value thành một chuỗi class duy nhất và xử lý conflict Tailwind.
Kết hợp `clsx` (class điều kiện) với `tailwind-merge` (loại bỏ class trùng/xung đột).
Input:
- inputs — danh sách class value (string, array hoặc object điều kiện).
Output:
- Chuỗi class đã được merge.
*/
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
