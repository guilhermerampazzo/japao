"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import MediaUploader, { type UploadedAsset } from "@/components/admin/MediaUploader";
import { EmptyState } from "@/components/admin/ui";

export default function MidiaGallery() {
  const [assets, setAssets] = useState<UploadedAsset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loading flag para o fetch inicial
    setLoading(true);
    fetch("/api/admin/media")
      .then((r) => r.json())
      .then((d) => setAssets(d.assets ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-lg">
      <MediaUploader onUploaded={(asset) => setAssets((prev) => [asset, ...prev])} />
      {loading ? (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-sm">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-surface-container animate-pulse" />
          ))}
        </div>
      ) : assets.length === 0 ? (
        <EmptyState icon="photo_library" title="Nenhuma imagem enviada ainda" description="Envie sua primeira imagem acima." />
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {assets.map((a) => (
            <div key={a.id} className="flex flex-col gap-1">
              <div className="relative aspect-square rounded-lg overflow-hidden border border-outline-variant bg-white">
                <Image src={a.url} alt={a.filename} fill sizes="150px" className="object-cover" />
              </div>
              <span className="text-[10px] text-on-surface-variant truncate">{a.filename}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
