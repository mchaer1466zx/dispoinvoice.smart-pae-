"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { getCompanyInitials } from "@/lib/company-initials";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 dark:bg-black sm:px-8">
      <main className="w-full max-w-xl">{children}</main>
    </div>
  );
}

export default function ProfilPage() {
  const idPrefix = useId();
  const { user, isLoading, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  function startEditing() {
    if (!user) return;
    setName(user.name);
    setEmail(user.email);
    setNameError(null);
    setEmailError(null);
    setIsEditing(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let hasError = false;
    if (!name.trim()) {
      setNameError("Nama wajib diisi.");
      hasError = true;
    } else {
      setNameError(null);
    }

    if (!email.trim()) {
      setEmailError("Email wajib diisi.");
      hasError = true;
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      setEmailError("Format email tidak valid.");
      hasError = true;
    } else {
      setEmailError(null);
    }

    if (hasError) return;

    updateProfile({ name: name.trim(), email: email.trim() });
    toast.success("Profil diperbarui");
    setIsEditing(false);
  }

  if (isLoading) {
    return (
      <PageShell>
        <p className="text-sm text-muted-foreground">Memuat...</p>
      </PageShell>
    );
  }

  if (!user) {
    return (
      <PageShell>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <UserRound className="size-8 text-muted-foreground" />
            <p className="font-medium">Anda belum masuk</p>
            <p className="text-sm text-muted-foreground">
              Masuk ke akun Anda untuk melihat dan mengubah profil.
            </p>
            <Button asChild>
              <Link href="/login">Masuk</Link>
            </Button>
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  if (isEditing) {
    return (
      <PageShell>
        <Card>
          <CardHeader>
            <CardTitle>Ubah Profil</CardTitle>
            <CardDescription>Perbarui nama dan email akun Anda.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="flex flex-col gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor={`${idPrefix}-name`}>Nama Lengkap *</Label>
                <Input
                  id={`${idPrefix}-name`}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setNameError(null);
                  }}
                  aria-invalid={nameError ? true : undefined}
                />
                {nameError ? (
                  <p className="text-sm text-destructive">{nameError}</p>
                ) : null}
              </div>

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
            <CardFooter className="gap-2">
              <Button type="submit">Simpan</Button>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Batal
              </Button>
            </CardFooter>
          </form>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Card>
        <CardHeader>
          <CardTitle>Profil Pengguna</CardTitle>
          <CardDescription>Informasi akun Anda di DispoInvoice.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar size="lg">
            <AvatarFallback>{getCompanyInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={startEditing}>
            <Pencil /> Ubah Profil
          </Button>
        </CardFooter>
      </Card>
    </PageShell>
  );
}
