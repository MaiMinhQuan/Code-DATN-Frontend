"use client";

// WYSIWYG editor dùng TipTap với toolbar đầy đủ định dạng.
import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
// Underline đã có sẵn trong StarterKit v3, không import thêm để tránh xung đột schema
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import {
  Bold, Italic, UnderlineIcon, Strikethrough,
  Superscript as SuperscriptIcon, Subscript as SubscriptIcon,
  Highlighter, Palette, List, ListOrdered,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  // grow=true: editor content mở rộng để fill chiều cao container (dùng trong modal)
  grow?: boolean;
}

function Divider() {
  return <div className="mx-1 h-4 w-px bg-border" />;
}

function ToolbarBtn({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={cn(
        "rounded p-1.5 transition-colors",
        active
          ? "bg-primary/15 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  minHeight = "5rem",
  grow = false,
}: RichTextEditorProps) {
  const colorInputRef = useRef<HTMLInputElement>(null);
  const highlightInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Superscript,
      Subscript,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "outline-none px-3 py-2 text-sm text-foreground",
        style: `min-height: ${minHeight}`,
        "data-placeholder": placeholder ?? "",
      },
    },
  });

  // Sync khi value thay đổi từ bên ngoài
  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className={cn(
      "rounded-lg border border-border bg-card focus-within:ring-2 focus-within:ring-primary/30",
      grow && "flex flex-col flex-1 min-h-0"
    )}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-2 py-1">

        {/* Nhóm 1: định dạng chữ cơ bản */}
        <ToolbarBtn title="Đậm (Ctrl+B)" active={editor?.isActive("bold") ?? false}
          onClick={() => editor?.chain().focus().toggleBold().run()}>
          <Bold className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Nghiêng (Ctrl+I)" active={editor?.isActive("italic") ?? false}
          onClick={() => editor?.chain().focus().toggleItalic().run()}>
          <Italic className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Gạch chân (Ctrl+U)" active={editor?.isActive("underline") ?? false}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Gạch ngang" active={editor?.isActive("strike") ?? false}
          onClick={() => editor?.chain().focus().toggleStrike().run()}>
          <Strikethrough className="h-3.5 w-3.5" />
        </ToolbarBtn>

        <Divider />

        {/* Nhóm 2: chỉ số trên/dưới */}
        <ToolbarBtn title="Chỉ số trên" active={editor?.isActive("superscript") ?? false}
          onClick={() => editor?.chain().focus().toggleSuperscript().run()}>
          <SuperscriptIcon className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Chỉ số dưới" active={editor?.isActive("subscript") ?? false}
          onClick={() => editor?.chain().focus().toggleSubscript().run()}>
          <SubscriptIcon className="h-3.5 w-3.5" />
        </ToolbarBtn>

        <Divider />

        {/* Nhóm 3: màu chữ và highlight */}
        <div className="relative">
          <ToolbarBtn title="Màu chữ" active={false}
            onClick={() => colorInputRef.current?.click()}>
            <Palette className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <input
            ref={colorInputRef}
            type="color"
            className="absolute inset-0 h-0 w-0 opacity-0"
            onChange={(e) =>
              editor?.chain().focus().setColor(e.target.value).run()
            }
          />
        </div>
        <div className="relative">
          <ToolbarBtn title="Tô sáng" active={editor?.isActive("highlight") ?? false}
            onClick={() => highlightInputRef.current?.click()}>
            <Highlighter className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <input
            ref={highlightInputRef}
            type="color"
            defaultValue="#fef08a"
            className="absolute inset-0 h-0 w-0 opacity-0"
            onChange={(e) =>
              editor?.chain().focus().toggleHighlight({ color: e.target.value }).run()
            }
          />
        </div>

        <Divider />

        {/* Nhóm 4: danh sách */}
        <ToolbarBtn title="Danh sách chấm" active={editor?.isActive("bulletList") ?? false}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}>
          <List className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Danh sách số" active={editor?.isActive("orderedList") ?? false}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarBtn>
      </div>

      {/* Vùng soạn thảo */}
      <div className={cn(grow && "flex-1 overflow-y-auto min-h-0")}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
