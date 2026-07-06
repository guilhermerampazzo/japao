"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import MediaUploader, { type UploadedAsset } from "./MediaUploader";

/**
 * Campo de escolha de imagem: mostra a imagem atual (se houver) e um botão
 * que abre um modal com a biblioteca de mídia + upload. Emite a URL escolhida
 * num <input hidden> para submeter junto do form (server action).
 */
export default function MediaPicker({
  name,
  label,
  defaultUrl,
}: {
  name: string;
  label: string;
  defaultUrl?: string;
}) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [assets, setAssets] = useState<UploadedAsset[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loading flag para o fetch ao abrir o modal
    setLoading(true);
    fetch("/api/admin/media")
      .then((r) => r.json())
      .then((d) => setAssets(d.assets ?? []))
      .finally(() => setLoading(false));
  }, [open]);

  function select(assetUrl: string) {
    setUrl(assetUrl);
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-on-surface">{label}</span>
      <input type="hidden" name={name} value={url} />
      <div className="flex items-center gap-3">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-surface-container border border-outline-variant shrink-0">
          {url ? (
            <Image src={url} alt="" fill sizes="80px" className="object-cover" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-outline material-symbols-outlined">image</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-lg text-sm font-medium hover:brightness-95 transition-all"
        >
          {url ? "Trocar imagem" : "Escolher imagem"}
        </button>
        {url && (
          <button type="button" onClick={() => setUrl("")} className="text-sm text-error hover:underline">
            Remover
          </button>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-[90] bg-black/40 flex items-center justify-center p-lg" onClick={() => setOpen(false)}>
          <div
            className="bg-surface rounded-xl shadow-2xl w-full max-w-[48rem] max-h-[80vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-md py-3 border-b border-outline-variant">
              <h3 className="font-display text-lg font-bold">Biblioteca de Mídia</h3>
              <button onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-surface-container" aria-label="Fechar">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-md border-b border-outline-variant">
              <MediaUploader
                onUploaded={(asset) => {
                  setAssets((prev) => [asset, ...prev]);
                  select(asset.url);
                }}
              />
            </div>
            <div className="p-md overflow-y-auto grid grid-cols-4 sm:grid-cols-5 gap-2">
              {loading && Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-lg bg-surface-container animate-pulse" />
              ))}
              {!loading && assets.length === 0 && (
                <p className="col-span-full text-sm text-on-surface-variant text-center py-lg">Nenhuma imagem enviada ainda.</p>
              )}
              {assets.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => select(a.url)}
                  className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors"
                >
                  <Image src={a.url} alt={a.filename} fill sizes="120px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
