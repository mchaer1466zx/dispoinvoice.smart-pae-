"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getSessionUserAction } from "@/app/actions/auth";

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
 * Menyediakan sesi akun ke seluruh app. Sumber kebenaran adalah SESI SERVER
 * (cookie httpOnly) yang diverifikasi lewat getSessionUserAction: saat app dimuat,
 * status login diselaraskan dengan sesi server sungguhan sehingga konsisten di
 * perangkat/tab mana pun. localStorage hanya cache cadangan bila jaringan gagal,
 * bukan penentu status login.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const cached = readStoredUser();

    // Selaraskan dengan sesi server (cookie). setState hanya dipanggil di dalam
    // callback promise agar sesuai aturan efek React.
    getSessionUserAction()
      .then((serverUser) => {
        if (cancelled) return;
        persist(
          serverUser
            ? { id: serverUser.id, name: serverUser.name, email: serverUser.email }
            : null
        );
      })
      .catch(() => {
        // Jaringan gagal: pertahankan cache lokal (jika ada) agar sesi tidak
        // terputus keliru; server tetap sumber kebenaran saat berhasil dimuat.
        if (!cancelled && cached) setUser(cached);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function persist(nextUser: AuthUser | null) {
    setUser(nextUser);
    if (typeof window === "undefined") return;
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
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
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
