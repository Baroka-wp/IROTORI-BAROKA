import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ content, onChange }) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image,
    ],
    content: '', // Start with empty content, will be set via useEffect
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none max-w-none min-h-[300px] p-4 border border-[var(--border-color)] rounded-sm bg-[var(--card-bg)] text-[var(--text-color)]',
      },
    },
  });

  // Update editor content when content prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  if (!editor) return null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 p-2 border-b border-[var(--border-color)] bg-[var(--card-bg)]">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 text-xs border border-[var(--border-color)] rounded-sm ${editor.isActive('bold') ? 'bg-[#6B1A2A] text-white' : 'bg-[var(--bg-color)] text-[var(--text-color)]'}`}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 text-xs border border-[var(--border-color)] rounded-sm ${editor.isActive('italic') ? 'bg-[#6B1A2A] text-white' : 'bg-[var(--bg-color)] text-[var(--text-color)]'}`}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 text-xs border border-[var(--border-color)] rounded-sm ${editor.isActive('heading', { level: 2 }) ? 'bg-[#6B1A2A] text-white' : 'bg-[var(--bg-color)] text-[var(--text-color)]'}`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 text-xs border border-[var(--border-color)] rounded-sm ${editor.isActive('bulletList') ? 'bg-[#6B1A2A] text-white' : 'bg-[var(--bg-color)] text-[var(--text-color)]'}`}
        >
          List
        </button>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt('URL');
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
          className="px-2 py-1 text-xs border border-[var(--border-color)] rounded-sm bg-[var(--bg-color)] text-[var(--text-color)]"
        >
          Image
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default Editor;
