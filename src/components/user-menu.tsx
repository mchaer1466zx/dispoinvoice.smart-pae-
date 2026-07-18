"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FileText, LogOut, Users, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/lib/auth-store";
import { logoutAction } from "@/app/actions/auth";
import { getCompanyInitials } from "@/lib/company-initials";

export function UserMenu() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  if (isLoading) return null;

  if (!user) {
    return (
      <Button variant="outline" size="sm" asChild>
        <Link href="/login">Masuk</Link>
      </Button>
    );
  }

  async function handleLogout() {
    await logoutAction();
    logout();
    toast.success("Berhasil keluar");
    router.push("/login");
    router.refresh();
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 px-2">
          <Avatar size="sm">
            <AvatarFallback>{getCompanyInitials(user.name)}</AvatarFallback>
          </Avatar>
          <span className="max-w-32 truncate">{user.name}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-1.5">
        <div className="px-2 py-1.5">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
        <div className="mt-1 flex flex-col border-t pt-1.5">
          <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
            <Link href="/">
              <FileText /> Buat Invoice
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
            <Link href="/pelanggan">
              <Users /> Pelanggan
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
            <Link href="/profil">
              <UserRound /> Profil
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut /> Keluar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
