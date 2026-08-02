export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-10 dark:bg-black sm:px-8">
      <main className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/logo-sang-prabu.png"
            alt="Logo PT Karya Sang Prabu"
            className="h-20 w-auto object-contain"
          />
          <p className="mt-2 font-display text-lg font-semibold tracking-tight text-foreground">
            PT KARYA SANG PRABU
          </p>
          <p className="text-[13px] tracking-[0.04em] text-gold">
            𝐓𝐡𝐞 𝐁𝐞𝐬𝐭 𝐏𝐚𝐫𝐭𝐧𝐞𝐫 𝐘𝐨𝐮𝐫 𝐁𝐮𝐬𝐢𝐧𝐞𝐬𝐬
          </p>
        </div>
        {children}
      </main>
    </div>
  );
}
