"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, GraduationCap } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";


const schema = z.object({
  email: z.string().email(UI_TEXT.VALIDATION.EMAIL_INVALID),
  password: z.string().min(6, UI_TEXT.VALIDATION.PASSWORD_MIN),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      toast.error(UI_TEXT.LOGIN.TOAST_ERROR);
    } else {
      toast.success(UI_TEXT.LOGIN.TOAST_SUCCESS);
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{UI_TEXT.LOGIN.HEADING}</h1>
          <p className="text-sm text-slate-500">{UI_TEXT.LOGIN.SUBHEADING}</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {UI_TEXT.LOGIN.LABEL_EMAIL}
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder={UI_TEXT.COMMON.PLACEHOLDER_EMAIL}
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {UI_TEXT.LOGIN.LABEL_PASSWORD}
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder={UI_TEXT.COMMON.PLACEHOLDER_PASSWORD}
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {UI_TEXT.LOGIN.BTN_SUBMIT}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            {UI_TEXT.LOGIN.HINT_NO_ACCOUNT}{" "}
            <Link href="/register" className="font-medium text-indigo-600 hover:underline">
              {UI_TEXT.LOGIN.LINK_REGISTER}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
