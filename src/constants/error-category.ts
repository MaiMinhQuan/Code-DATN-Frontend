// Mapping style hiển thị cho từng loại lỗi AI và helper tạo ID lỗi.
import { ErrorCategory } from '@/types/enums'
import type { AIError } from '@/types/ai-result.types'

// Bộ class CSS và label hiển thị của một nhóm lỗi.
export interface ErrorCategoryStyle {
  // Class Tailwind cho đoạn text được highlight trong bài viết.
  highlight: string
  // Class Tailwind cho badge của nhóm lỗi.
  badge: string
  // Nhãn tiếng Việt hiển thị trên UI.
  label: string
}

// Map từng `ErrorCategory` sang style highlight, badge và label tương ứng.
export const ERROR_CATEGORY_STYLES: Record<ErrorCategory, ErrorCategoryStyle> = {
  [ErrorCategory.GRAMMAR]: {
    highlight: 'bg-red-100 border-b-2 border-red-400 cursor-pointer hover:bg-red-200',
    badge: 'bg-red-500',
    label: 'Ngữ pháp',
  },
  [ErrorCategory.SPELLING]: {
    highlight: 'bg-orange-100 border-b-2 border-orange-400 cursor-pointer hover:bg-orange-200',
    badge: 'bg-orange-500',
    label: 'Chính tả',
  },
  [ErrorCategory.VOCABULARY]: {
    highlight: 'bg-yellow-100 border-b-2 border-yellow-400 cursor-pointer hover:bg-yellow-200',
    badge: 'bg-yellow-500',
    label: 'Từ vựng',
  },
  [ErrorCategory.COHERENCE]: {
    highlight: 'bg-purple-100 border-b-2 border-purple-400 cursor-pointer hover:bg-purple-200',
    badge: 'bg-purple-500',
    label: 'Liên kết',
  },
  [ErrorCategory.TASK_RESPONSE]: {
    highlight: 'bg-blue-100 border-b-2 border-blue-400 cursor-pointer hover:bg-blue-200',
    badge: 'bg-blue-500',
    label: 'Nội dung',
  },
  [ErrorCategory.PUNCTUATION]: {
    highlight: 'bg-gray-100 border-b-2 border-gray-400 cursor-pointer hover:bg-gray-200',
    badge: 'bg-gray-500',
    label: 'Dấu câu',
  },
}

/*
Tạo ID chuỗi ổn định cho một lỗi AI (dùng làm React key).

Input:
- error — lỗi AI cần tạo ID.

Output:
- Chuỗi theo format startIndex-endIndex-category.
*/
export const getErrorId = (error: AIError): string =>
  `${error.startIndex}-${error.endIndex}-${error.category}`
