import type { AIError } from './ai-result.types'

export interface TextSegment {
  id: string
  text: string
  startIndex: number
  isHighlighted: boolean
  errors: AIError[]
}
