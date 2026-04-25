"use client"

import { useState } from "react"
import { useSampleEssays } from "@/hooks/useSampleEssays"
import { EssayFilter } from "@/components/features/sample-essays/EssayFilter"
import { EssayList } from "@/components/features/sample-essays/EssayList"
import { UI_TEXT } from "@/constants/ui-text"
import type { GetSampleEssaysParams } from "@/types/sample-essay.types"

const T = UI_TEXT.SAMPLE_ESSAYS

export default function SampleEssaysPage() {
  const [params, setParams] = useState<GetSampleEssaysParams>({})

  const { data, isLoading } = useSampleEssays(params)

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{T.PAGE_TITLE}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{T.PAGE_SUBTITLE}</p>
      </div>

      {/* Filter */}
      <EssayFilter params={params} onChange={setParams} />

      {/* List */}
      <EssayList essays={data ?? []} isLoading={isLoading} />

    </div>
  )
}