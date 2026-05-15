// Type để chia bài viết thành các segment phục vụ highlight lỗi inline.
import type { AIError } from './ai-result.types'

// Một đoạn text liên tục của bài viết, có thể gắn các lỗi AI liên quan.
export interface TextSegment {
  id: string
  text: string
  startIndex: number
  isHighlighted: boolean
  errors: AIError[]
}
