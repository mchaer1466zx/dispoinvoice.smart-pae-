import sharp from "sharp";

const MAX_LOGO_DIMENSION = 512;

export type OptimizedLogo = {
  buffer: Buffer;
  contentType: string;
};

/**
 * Memvalidasi bahwa berkas benar-benar berupa gambar yang bisa dibaca (bukan sekadar
 * cocok berdasarkan MIME type dari klien), lalu mengecilkan ukurannya agar hemat
 * penyimpanan. SVG dilewati apa adanya karena berbasis vektor.
 */
export async function validateAndOptimizeLogo(
  buffer: Buffer,
  contentType: string
): Promise<OptimizedLogo> {
  if (contentType === "image/svg+xml") {
    return { buffer, contentType };
  }

  const image = sharp(buffer);
  let metadata: Awaited<ReturnType<typeof image.metadata>>;
  try {
    metadata = await image.metadata();
  } catch {
    throw new Error("Berkas logo tidak valid atau rusak.");
  }

  if (!metadata.width || !metadata.height) {
    throw new Error("Berkas logo tidak valid atau rusak.");
  }

  const optimized = await image
    .resize({
      width: MAX_LOGO_DIMENSION,
      height: MAX_LOGO_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .png({ compressionLevel: 9 })
    .toBuffer();

  return { buffer: optimized, contentType: "image/png" };
}
