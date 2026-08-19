export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-10 dark:bg-black sm:px-8">
      <main className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo/logo-sang-prabu-haki.png"
            alt="Logo Resmi Terdaftar HAKI PT Karya Sang Prabu"
            className="h-20 w-auto object-contain drop-shadow-sm"
          />
          <p className="mt-2 font-display text-lg font-semibold tracking-tight text-foreground">
            PT KARYA SANG PRABU
          </p>
          <p className="text-[12px] font-medium tracking-wide text-brand-gold">
            Better Proses, Better Quality &amp; Better Serve
          </p>
        </div>
        {children}
      </main>
    </div>
  );
}
