"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";

// Definido fora do componente: se recriado a cada render, o useEditor pode
// reconfigurar o editor a cada tecla digitada, causando comportamento
// instável.
const EXTENSIONS = [StarterKit.configure({ link: { openOnClick: false } })];

/**
 * Editor de texto rico (TipTap) que emite HTML para um <input hidden name={name}>,
 * pronto para ser submetido junto de uma server action de formulário.
 */
export default function RichTextEditor({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
}) {
  const [html, setHtml] = useState(defaultValue ?? "");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: EXTENSIONS,
    content: defaultValue ?? "",
    editorProps: {
      attributes: {
        class: "prose-jnm min-h-[220px] px-4 py-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  return (
    <div className="border border-outline-variant rounded-lg overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-shadow bg-white">
      <input type="hidden" name={name} value={html} />
      <div className="flex flex-wrap items-center gap-0.5 border-b border-outline-variant px-2 py-1.5 bg-surface-container-lowest">
        <ToolButton
          icon="format_bold"
          title="Negrito"
          active={!!editor?.isActive("bold")}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        />
        <ToolButton
          icon="format_italic"
          title="Itálico"
          active={!!editor?.isActive("italic")}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        />
        <Divider />
        <ToolButton
          icon="format_h2"
          title="Título"
          active={!!editor?.isActive("heading", { level: 2 })}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <ToolButton
          icon="format_h3"
          title="Subtítulo"
          active={!!editor?.isActive("heading", { level: 3 })}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
        />
        <Divider />
        <ToolButton
          icon="format_list_bulleted"
          title="Lista com marcadores"
          active={!!editor?.isActive("bulletList")}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        />
        <ToolButton
          icon="format_list_numbered"
          title="Lista numerada"
          active={!!editor?.isActive("orderedList")}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        />
        <Divider />
        <ToolButton
          icon="link"
          title="Inserir link"
          active={!!editor?.isActive("link")}
          disabled={!editor}
          onClick={() => {
            if (!editor) return;
            const url = window.prompt("URL do link:");
            if (url) editor.chain().focus().setLink({ href: url }).run();
            else editor.chain().focus().unsetLink().run();
          }}
        />
        <ToolButton
          icon="format_clear"
          title="Limpar formatação"
          active={false}
          disabled={!editor}
          onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function Divider() {
  return <span className="w-px h-5 bg-outline-variant mx-1" />;
}

function ToolButton({
  active,
  disabled,
  onClick,
  icon,
  title,
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  icon: string;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-pressed={active}
      disabled={disabled}
      // onMouseDown + preventDefault evita que o clique tire o foco/seleção do
      // editor ANTES do comando rodar — sem isso, o comando pode aplicar numa
      // seleção já perdida/colapsada, causando comportamento errático.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors disabled:opacity-30 disabled:pointer-events-none ${
        active ? "bg-primary text-white" : "text-on-surface-variant hover:bg-surface-container"
      }`}
    >
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
    </button>
  );
}
