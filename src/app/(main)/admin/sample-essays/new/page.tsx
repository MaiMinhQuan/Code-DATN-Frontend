"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SampleEssayForm } from "@/components/features/admin/sample-essays/SampleEssayForm";
import { UI_TEXT } from "@/constants/ui-text";

const P = UI_TEXT.ADMIN.PAGE_HEADERS;
const C = UI_TEXT.ADMIN.COMMON;

export default function NewSampleEssayPage() {
  return (
    <div>
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <Link
            href="/admin/sample-essays"
            className="mb-3 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {P.BTN_BACK_LIST}
          </Link>
          <h1 className="text-xl font-semibold text-slate-900">{P.ESSAY_NEW_TITLE}</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {P.ESSAY_NEW_SUBTITLE}
          </p>
        </div>
        <SampleEssayForm />
      </div>
    </div>
  );
}
