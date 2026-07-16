"use client";

import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "dispoinvoice:auth-user";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (user: AuthUser) => void;
  register: (user: AuthUser) => void;
  logout: () => void;
  updateProfile: (patch: Partial<Pick<AuthUser, "name" | "email">>) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

/**
 * Menyediakan sesi akun tiruan (localStorage) ke seluruh app selagi backend
 * autentikasi (Better Auth) belum dipasang. Halaman login/daftar/profil
 * memakai login/register/updateProfile; tombol keluar di header memakai logout.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.resolve(readStoredUser()).then((stored) => {
      if (cancelled) return;
      setUser(stored);
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  function persist(nextUser: AuthUser | null) {
    setUser(nextUser);
    if (nextUser) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }

  function login(nextUser: AuthUser) {
    persist(nextUser);
  }

  function register(nextUser: AuthUser) {
    persist(nextUser);
  }

  function logout() {
    persist(null);
  }

  function updateProfile(patch: Partial<Pick<AuthUser, "name" | "email">>) {
    setUser((current) => {
      if (!current) return current;
      const next = { ...current, ...patch };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus dipakai di dalam AuthProvider");
  }
  return context;
}
