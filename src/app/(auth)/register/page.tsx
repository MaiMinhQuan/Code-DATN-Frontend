"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, GraduationCap } from "lucide-react";
import { authService } from "@/services/auth.service";
import { UI_TEXT } from "@/constants/ui-text";


const schema = z
  .object({
    fullName: z.string().min(2, UI_TEXT.VALIDATION.FULL_NAME_MIN).max(30, UI_TEXT.VALIDATION.FULL_NAME_MAX),
    email: z.string().email(UI_TEXT.VALIDATION.EMAIL_INVALID),
    password: z.string().min(6, UI_TEXT.VALIDATION.PASSWORD_MIN).max(50),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: UI_TEXT.VALIDATION.PASSWORD_MISMATCH,
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await authService.register({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });

      // Tự động đăng nhập sau khi đăng ký thành công
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.success(UI_TEXT.REGISTER.TOAST_SUCCESS_REDIRECT);
        router.push("/login");
      } else {
        toast.success(UI_TEXT.REGISTER.TOAST_SUCCESS_AUTO_LOGIN);
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : UI_TEXT.REGISTER.TOAST_ERROR_FALLBACK);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{UI_TEXT.REGISTER.HEADING}</h1>
          <p className="text-sm text-slate-500">{UI_TEXT.REGISTER.SUBHEADING}</p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {[
              { name: "fullName", label: UI_TEXT.REGISTER.LABEL_FULL_NAME, type: "text", placeholder: UI_TEXT.REGISTER.PLACEHOLDER_FULL_NAME },
              { name: "email", label: UI_TEXT.REGISTER.LABEL_EMAIL, type: "email", placeholder: UI_TEXT.COMMON.PLACEHOLDER_EMAIL },
              { name: "password", label: UI_TEXT.REGISTER.LABEL_PASSWORD, type: "password", placeholder: UI_TEXT.COMMON.PLACEHOLDER_PASSWORD },
              { name: "confirmPassword", label: UI_TEXT.REGISTER.LABEL_CONFIRM_PASSWORD, type: "password", placeholder: UI_TEXT.COMMON.PLACEHOLDER_PASSWORD },
            ].map((field) => (
              <div key={field.name}>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {field.label}
                </label>
                <input
                  {...register(field.name as keyof FormData)}
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
                {errors[field.name as keyof FormData] && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors[field.name as keyof FormData]?.message}
                  </p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {UI_TEXT.REGISTER.BTN_SUBMIT}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            {UI_TEXT.REGISTER.HINT_HAS_ACCOUNT}{" "}
            <Link href="/login" className="font-medium text-indigo-600 hover:underline">
              {UI_TEXT.REGISTER.LINK_LOGIN}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
