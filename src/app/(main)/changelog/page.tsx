import { readFileSync } from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import { APP_VERSION } from "@/lib/app-version";
import { UI_TEXT } from "@/constants/ui-text";

const T = UI_TEXT.VERSION;

export default function ChangelogPage() {
  const filePath = path.join(process.cwd(), "public", "CHANGELOG.md");
  const markdown = readFileSync(filePath, "utf8");

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{T.PAGE_TITLE}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {T.CURRENT_VERSION_LABEL}: <span className="font-semibold text-slate-700">v{APP_VERSION}</span>
        </p>
      </div>

      <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h2:first-child]:mt-0 [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-slate-800 [&_li]:ml-4 [&_li]:list-disc [&_li]:text-sm [&_li]:text-slate-600 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-slate-600 [&_ul]:mb-3 [&_ul]:space-y-1">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </article>
    </div>
  );
}
