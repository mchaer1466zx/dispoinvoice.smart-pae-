"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/auth-store";
import { loginAction } from "@/app/actions/auth";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type LoginForm = {
  email: string;
  password: string;
};

type FormErrors = Partial<Record<keyof LoginForm, string>>;

function validate(form: LoginForm): FormErrors {
  const errors: FormErrors = {};

  if (!form.email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = "Format email tidak valid.";
  }

  if (!form.password) {
    errors.password = "Kata sandi wajib diisi.";
  }

  return errors;
}

export default function LoginPage() {
  const idPrefix = useId();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof LoginForm>(field: K, value: LoginForm[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const email = form.email.trim();
      const result = await loginAction({ email, password: form.password });
      if (!result.success) {
        setErrors({ password: result.error });
        toast.error("Gagal masuk", { description: result.error });
        setIsSubmitting(false);
        return;
      }

      login(result.user);
      toast.success("Berhasil masuk", {
        description: `Selamat datang kembali, ${result.user.name}.`,
      });
      const next = searchParams.get("next");
      router.push(next && next.startsWith("/") ? next : "/");
      router.refresh();
    } catch {
      toast.error("Terjadi kesalahan", {
        description: "Tidak bisa masuk. Coba lagi sebentar.",
      });
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Masuk ke DispoInvoice</CardTitle>
        <CardDescription>
          Masuk untuk membuat dan mengelola invoice, PO, dan memo perusahaan.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor={`${idPrefix}-email`}>Email *</Label>
            <Input
              id={`${idPrefix}-email`}
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              aria-invalid={errors.email ? true : undefined}
            />
            {errors.email ? (
              <p className="text-sm text-destructive">{errors.email}</p>
            ) : null}
          </div>

          <div className="grid gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor={`${idPrefix}-password`}>Kata Sandi *</Label>
              <Link
                href="/reset-password"
                className="text-xs text-muted-foreground underline underline-offset-4"
              >
                Lupa kata sandi?
              </Link>
            </div>
            <Input
              id={`${idPrefix}-password`}
              type="password"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              aria-invalid={errors.password ? true : undefined}
            />
            {errors.password ? (
              <p className="text-sm text-destructive">{errors.password}</p>
            ) : null}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            Masuk
          </Button>
          <p className="text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link href="/daftar" className="font-medium text-foreground underline underline-offset-4">
              Daftar
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
