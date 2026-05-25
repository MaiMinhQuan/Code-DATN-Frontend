// Trang danh sách bài mẫu với bộ lọc chủ đề (client-side).
"use client"

import { useState, useMemo } from "react"
import { useSampleEssays } from "@/hooks/useSampleEssays"
import { EssayFilter } from "@/components/features/sample-essays/EssayFilter"
import { EssayList } from "@/components/features/sample-essays/EssayList"
import { UI_TEXT } from "@/constants/ui-text"
import type { GetSampleEssaysParams } from "@/types/sample-essay.types"

const T = UI_TEXT.SAMPLE_ESSAYS

export default function SampleEssaysPage() {
  const [params, setParams] = useState<GetSampleEssaysParams>({})

  // Một lần fetch duy nhất — filter thực hiện client-side
  const { data: allEssays = [], isLoading } = useSampleEssays()

  // Danh sách topic unique từ dữ liệu thực, chỉ hiện topic có bài mẫu
  const topics = useMemo(() => {
    const seen = new Set<string>()
    return allEssays
      .map((e) => e.topicId)
      .filter((t) => {
        if (seen.has(t._id)) return false
        seen.add(t._id)
        return true
      })
  }, [allEssays])

  // Client-side filter — tránh vấn đề serialization ObjectId giữa FE/BE
  const filtered = useMemo(() => {
    if (!params.topicId) return allEssays
    return allEssays.filter((e) => e.topicId._id === params.topicId)
  }, [allEssays, params.topicId])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{T.PAGE_TITLE}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{T.PAGE_SUBTITLE}</p>
      </div>

      {topics.length > 0 && (
        <EssayFilter params={params} topics={topics} onChange={setParams} />
      )}

      <EssayList essays={filtered} isLoading={isLoading} />
    </div>
  )
}
