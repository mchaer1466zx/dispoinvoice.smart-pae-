"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { registerAction, loginAction } from "@/app/actions/auth";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof RegisterForm, string>>;

function createEmptyForm(): RegisterForm {
  return { name: "", email: "", password: "", confirmPassword: "" };
}

function validate(form: RegisterForm): FormErrors {
  const errors: FormErrors = {};

  if (!form.name.trim()) {
    errors.name = "Nama wajib diisi.";
  }

  if (!form.email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = "Format email tidak valid.";
  }

  if (!form.password) {
    errors.password = "Kata sandi wajib diisi.";
  } else if (form.password.length < 6) {
    errors.password = "Kata sandi minimal 6 karakter.";
  }

  if (form.confirmPassword !== form.password) {
    errors.confirmPassword = "Konfirmasi kata sandi tidak cocok.";
  }

  return errors;
}

export default function DaftarPage() {
  const idPrefix = useId();
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState<RegisterForm>(createEmptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof RegisterForm>(field: K, value: RegisterForm[K]) {
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
      const name = form.name.trim();
      const email = form.email.trim();

      const result = await registerAction({ name, email, password: form.password });
      if (!result.success) {
        setErrors({ email: result.error });
        toast.error("Gagal membuat akun", { description: result.error });
        setIsSubmitting(false);
        return;
      }

      // Buat sesi (cookie httpOnly) supaya area internal langsung bisa diakses.
      const loginResult = await loginAction({ email, password: form.password });
      if (!loginResult.success) {
        toast.error("Gagal masuk otomatis", { description: loginResult.error });
        router.push("/login");
        return;
      }

      register(loginResult.user);
      toast.success("Akun berhasil dibuat", {
        description: `Selamat datang, ${loginResult.user.name}.`,
      });
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Terjadi kesalahan", {
        description: "Tidak bisa membuat akun. Coba lagi sebentar.",
      });
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buat Akun</CardTitle>
        <CardDescription>
          Daftar untuk mulai membuat invoice, purchase order, dan memo perusahaan.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor={`${idPrefix}-name`}>Nama Lengkap *</Label>
            <Input
              id={`${idPrefix}-name`}
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              aria-invalid={errors.name ? true : undefined}
            />
            {errors.name ? (
              <p className="text-sm text-destructive">{errors.name}</p>
            ) : null}
          </div>

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
            <Label htmlFor={`${idPrefix}-password`}>Kata Sandi *</Label>
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

          <div className="grid gap-1.5">
            <Label htmlFor={`${idPrefix}-confirm-password`}>Konfirmasi Kata Sandi *</Label>
            <Input
              id={`${idPrefix}-confirm-password`}
              type="password"
              value={form.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              aria-invalid={errors.confirmPassword ? true : undefined}
            />
            {errors.confirmPassword ? (
              <p className="text-sm text-destructive">{errors.confirmPassword}</p>
            ) : null}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            Daftar
          </Button>
          <p className="text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
              Masuk
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
