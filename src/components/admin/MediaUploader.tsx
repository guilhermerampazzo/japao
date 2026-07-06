"use client";

import { useRef, useState } from "react";

export type UploadedAsset = {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
};

export default function MediaUploader({
  onUploaded,
}: {
  onUploaded: (asset: UploadedAsset) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Falha no upload");
        onUploaded(data.asset);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha no upload");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragActive(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-xl p-lg text-center cursor-pointer transition-colors ${
        dragActive ? "border-primary bg-primary/5" : "border-outline-variant hover:border-primary hover:bg-surface-container"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
        <span className="material-symbols-outlined text-[22px]">
          {uploading ? "progress_activity" : "cloud_upload"}
        </span>
      </div>
      <p className="text-sm font-medium text-on-surface">
        {uploading ? "Enviando imagem..." : "Clique ou arraste imagens aqui"}
      </p>
      <p className="text-xs text-on-surface-variant mt-0.5">JPG, PNG, WEBP ou AVIF — até 8MB</p>
      {error && <p className="text-sm text-on-error-container mt-2">{error}</p>}
    </div>
  );
}
