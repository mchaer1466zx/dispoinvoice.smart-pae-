export function CompanyLogo({
  logoUrl,
  initials,
  className,
}: {
  logoUrl: string | null;
  initials: string;
  className?: string;
}) {
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- rendered inside html2canvas-captured preview, next/image is not compatible there
      <img
        src={logoUrl}
        alt="Logo perusahaan"
        className={"size-14 shrink-0 rounded-lg object-cover " + (className ?? "")}
      />
    );
  }

  return (
    <div
      className={
        "flex size-14 shrink-0 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-100 text-lg font-semibold text-gray-500 " +
        (className ?? "")
      }
      aria-label="Logo perusahaan belum diunggah"
      title="Logo perusahaan belum diunggah"
    >
      {initials}
    </div>
  );
}
