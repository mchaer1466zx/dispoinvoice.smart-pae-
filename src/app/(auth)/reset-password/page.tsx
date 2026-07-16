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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ResetPasswordPage() {
  const idPrefix = useId();
  const router = useRouter();
  const [step, setStep] = useState<"email" | "password">("email");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  function handleSendInstructions(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim()) {
      setEmailError("Email wajib diisi.");
      return;
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      setEmailError("Format email tidak valid.");
      return;
    }

    toast.success("Instruksi terkirim", {
      description: `Kode verifikasi tiruan telah "dikirim" ke ${email.trim()}.`,
    });
    setStep("password");
  }

  function handleSetNewPassword(e: React.FormEvent) {
    e.preventDefault();

    let hasError = false;
    if (!password) {
      setPasswordError("Kata sandi baru wajib diisi.");
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError("Kata sandi minimal 6 karakter.");
      hasError = true;
    } else {
      setPasswordError(null);
    }

    if (confirmPassword !== password) {
      setConfirmError("Konfirmasi kata sandi tidak cocok.");
      hasError = true;
    } else {
      setConfirmError(null);
    }

    if (hasError) return;

    toast.success("Kata sandi berhasil diatur ulang", {
      description: "Silakan masuk dengan kata sandi baru Anda.",
    });
    router.push("/login");
  }

  if (step === "email") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Atur Ulang Kata Sandi</CardTitle>
          <CardDescription>
            Masukkan email akun Anda untuk menerima instruksi reset kata sandi.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSendInstructions}>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor={`${idPrefix}-email`}>Email *</Label>
              <Input
                id={`${idPrefix}-email`}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(null);
                }}
                aria-invalid={emailError ? true : undefined}
              />
              {emailError ? (
                <p className="text-sm text-destructive">{emailError}</p>
              ) : null}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full">
              Kirim Instruksi
            </Button>
            <p className="text-sm text-muted-foreground">
              Ingat kata sandi Anda?{" "}
              <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
                Masuk
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buat Kata Sandi Baru</CardTitle>
        <CardDescription>
          Masukkan kata sandi baru untuk akun dengan email {email.trim()}.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSetNewPassword}>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor={`${idPrefix}-password`}>Kata Sandi Baru *</Label>
            <Input
              id={`${idPrefix}-password`}
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(null);
              }}
              aria-invalid={passwordError ? true : undefined}
            />
            {passwordError ? (
              <p className="text-sm text-destructive">{passwordError}</p>
            ) : null}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor={`${idPrefix}-confirm-password`}>Konfirmasi Kata Sandi *</Label>
            <Input
              id={`${idPrefix}-confirm-password`}
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setConfirmError(null);
              }}
              aria-invalid={confirmError ? true : undefined}
            />
            {confirmError ? (
              <p className="text-sm text-destructive">{confirmError}</p>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full">
            Simpan Kata Sandi Baru
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => setStep("email")}
          >
            Kembali
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
