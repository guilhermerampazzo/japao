import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { saveUpload, UploadError } from "@/lib/upload";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo ausente" }, { status: 400 });
  }

  try {
    const asset = await saveUpload(file);
    return NextResponse.json({ asset });
  } catch (e) {
    if (e instanceof UploadError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    console.error("Erro no upload:", e);
    return NextResponse.json({ error: "Falha ao processar upload" }, { status: 500 });
  }
}
