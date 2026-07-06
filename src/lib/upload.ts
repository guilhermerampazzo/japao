import { randomUUID } from "crypto";
import path from "path";
import { mkdir, writeFile } from "fs/promises";
import sharp from "sharp";
import { prisma } from "@/lib/prisma";

// Fora de `public/`: arquivos gravados após o build não são servidos de forma
// confiável pelo servidor estático do Next.js (manifest calculado no build).
// Por isso os uploads são servidos por uma rota própria (`/media/[...path]`).
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export class UploadError extends Error {}

/** Salva um arquivo enviado (File do FormData) na pasta de uploads e registra um MediaAsset. */
export async function saveUpload(file: File) {
  if (!ALLOWED_MIME.has(file.type)) {
    throw new UploadError("Formato não suportado. Use JPG, PNG, WEBP ou AVIF.");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new UploadError("Arquivo muito grande (máximo 8MB).");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = EXT_BY_MIME[file.type];
  const filename = `${randomUUID()}.${ext}`;

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  let width: number | undefined;
  let height: number | undefined;
  try {
    const meta = await sharp(buffer).metadata();
    width = meta.width;
    height = meta.height;
  } catch {
    // metadados são best-effort; upload segue mesmo se falhar
  }

  return prisma.mediaAsset.create({
    data: {
      filename,
      url: `/media/${filename}`,
      mimeType: file.type,
      sizeBytes: file.size,
      width,
      height,
    },
  });
}
