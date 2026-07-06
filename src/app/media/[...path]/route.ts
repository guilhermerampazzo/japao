import path from "path";
import { readFile, stat } from "fs/promises";
import { NextResponse } from "next/server";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

/**
 * Serve os arquivos enviados pelo admin. Necessário porque o Next.js não
 * garante servir de forma confiável arquivos gravados em `public/` após o
 * build (ver `src/lib/upload.ts`).
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;
  const filename = segments.join("/");

  // Impede path traversal (../) — só permite nomes diretamente dentro de UPLOAD_DIR
  if (filename.includes("..") || filename.includes("/")) {
    return NextResponse.json({ error: "Caminho inválido" }, { status: 400 });
  }

  const ext = path.extname(filename).toLowerCase();
  const mimeType = MIME_BY_EXT[ext];
  if (!mimeType) {
    return NextResponse.json({ error: "Tipo de arquivo não suportado" }, { status: 400 });
  }

  const filePath = path.join(UPLOAD_DIR, filename);
  try {
    await stat(filePath);
    const buffer = await readFile(filePath);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Arquivo não encontrado" }, { status: 404 });
  }
}
