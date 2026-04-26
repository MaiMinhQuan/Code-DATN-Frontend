import { FileText } from "lucide-react"
import { UI_TEXT } from "@/constants/ui-text"
import { EssayCard } from "./EssayCard"
import type { SampleEssay } from "@/types/sample-essay.types"

const T = UI_TEXT.SAMPLE_ESSAYS

function SkeletonCard() {
  return (
    <div className="flex animate-pulse flex-col rounded-xl border border-border bg-card p-4">
      <div className="flex gap-2">
        <div className="h-5 w-16 rounded-full bg-muted" />
        <div className="h-5 w-14 rounded-full bg-muted" />
        <div className="h-5 w-20 rounded-full bg-muted" />
      </div>
      <div className="mt-3 h-4 w-3/4 rounded bg-muted" />
      <div className="mt-1 h-4 w-1/2 rounded bg-muted" />
      <div className="mt-2 space-y-1.5">
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-2/3 rounded bg-muted" />
      </div>
      <div className="mt-3 border-t border-border pt-3">
        <div className="h-3 w-16 rounded bg-muted" />
      </div>
    </div>
  )
}

interface EssayListProps {
  essays: SampleEssay[]
  isLoading: boolean
}

export function EssayList({ essays, isLoading }: EssayListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (essays.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
        <FileText className="mb-3 h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">{T.EMPTY_STATE}</p>
        <p className="mt-1 text-xs text-muted-foreground">{T.EMPTY_STATE_HINT}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {essays.map((essay) => (
        <EssayCard key={essay._id} essay={essay} />
      ))}
    </div>
  )
}
