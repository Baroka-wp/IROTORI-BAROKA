import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none max-w-none min-h-[300px] p-4 border border-white/10 rounded-sm bg-white/5 text-white',
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 p-2 border-b border-white/10 bg-white/5">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 text-xs border border-white/10 rounded-sm ${editor.isActive('bold') ? 'bg-[#6B1A2A] text-white' : 'bg-white/5 text-white'}`}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 text-xs border border-white/10 rounded-sm ${editor.isActive('italic') ? 'bg-[#6B1A2A] text-white' : 'bg-white/5 text-white'}`}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 text-xs border border-white/10 rounded-sm ${editor.isActive('heading', { level: 2 }) ? 'bg-[#6B1A2A] text-white' : 'bg-white/5 text-white'}`}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 text-xs border border-white/10 rounded-sm ${editor.isActive('bulletList') ? 'bg-[#6B1A2A] text-white' : 'bg-white/5 text-white'}`}
        >
          List
        </button>
        <button
          onClick={() => {
            const url = window.prompt('URL');
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
          className="px-2 py-1 text-xs border border-white/10 rounded-sm bg-white/5 text-white"
        >
          Image
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default Editor;
