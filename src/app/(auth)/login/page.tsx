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

function nameFromEmail(email: string) {
  const [localPart] = email.split("@");
  return localPart
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

export default function LoginPage() {
  const idPrefix = useId();
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof LoginForm>(field: K, value: LoginForm[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    const email = form.email.trim();
    login({
      id: `user-${Date.now()}`,
      name: nameFromEmail(email) || email,
      email,
    });
    toast.success("Berhasil masuk", { description: `Selamat datang kembali, ${email}.` });
    router.push("/");
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
