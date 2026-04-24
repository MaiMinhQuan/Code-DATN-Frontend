import { auth } from "@/auth";
import { UI_TEXT } from "@/constants/ui-text";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {UI_TEXT.DASHBOARD.GREETING(session?.user?.name ?? UI_TEXT.COMMON.FALLBACK_USER_NAME)}
        </h1>
        <p className="mt-1 text-slate-500">
          {UI_TEXT.DASHBOARD.SUBHEADING}
        </p>
      </div>

      {/* Placeholder stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: UI_TEXT.DASHBOARD.STAT_SUBMISSIONS, value: UI_TEXT.COMMON.EMPTY_VALUE },
          { label: UI_TEXT.DASHBOARD.STAT_AVG_BAND,    value: UI_TEXT.COMMON.EMPTY_VALUE },
          { label: UI_TEXT.DASHBOARD.STAT_STREAK,      value: UI_TEXT.COMMON.EMPTY_VALUE },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
          >
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm text-slate-400 text-center py-8">
          {UI_TEXT.DASHBOARD.PLACEHOLDER_COMING_SOON}
        </p>
      </div>
    </div>
  );
}
