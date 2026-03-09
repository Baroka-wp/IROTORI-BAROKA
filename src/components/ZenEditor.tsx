'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Bold, Italic, Quote, List, Link2, Minus, Check, Clock, AlignLeft, Maximize2, Minimize2 } from 'lucide-react';

function wordCount(html: string): number {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text ? text.split(' ').filter(Boolean).length : 0;
}

const ToolBtn: React.FC<{ active?: boolean; onClick: () => void; title?: string; children: React.ReactNode }> = ({ active, onClick, title, children }) => (
  <button type="button" title={title} onClick={onClick}
    className={`flex items-center justify-center w-8 h-7 rounded text-sm transition-colors ${active ? 'bg-[#6B1A2A] text-white' : 'text-[var(--text-color)]/50 hover:text-[#6B1A2A] hover:bg-[#6B1A2A]/10'}`}
  >{children}</button>
);

const Sep = () => <div className="w-px h-4 bg-[var(--border-color)] mx-1" />;

const BubbleBtn: React.FC<{ active?: boolean; onClick: () => void; title?: string; children: React.ReactNode }> = ({ active, onClick, title, children }) => (
  <button type="button" title={title} onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    className={`flex items-center justify-center w-7 h-6 rounded text-xs transition-colors ${active ? 'bg-white/25 text-white' : 'text-white/65 hover:text-white hover:bg-white/10'}`}
  >{children}</button>
);

interface LinkModalProps { href: string; onSave: (url: string) => void; onRemove: () => void; onClose: () => void; }
const LinkModal: React.FC<LinkModalProps> = ({ href, onSave, onRemove, onClose }) => {
  const [value, setValue] = useState(href);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 50); }, []);
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/20" onClick={onClose}>
      <div className="bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl p-5 w-[340px] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <p className="text-sm font-medium text-[var(--text-color)] mb-3">{href ? 'Modifier le lien' : 'Insérer un lien'}</p>
        <input ref={inputRef} type="url" value={value} onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onSave(value); } if (e.key === 'Escape') onClose(); }}
          placeholder="https://example.com"
          className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-color)] focus:outline-none focus:border-[#6B1A2A] mb-4"
        />
        <div className="flex items-center justify-between">
          {href ? <button type="button" onClick={onRemove} className="text-xs text-red-400 hover:text-red-500 transition-colors">Supprimer</button> : <span />}
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs text-[var(--text-color)]/50 hover:text-[var(--text-color)] transition-colors">Annuler</button>
            <button type="button" onClick={() => onSave(value)} className="px-4 py-1.5 text-xs bg-[#6B1A2A] text-white rounded-lg hover:opacity-90 transition-opacity">Enregistrer</button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface BubblePos { x: number; y: number; visible: boolean; }

interface ZenEditorProps { content: string; onChange: (html: string) => void; placeholder?: string; }

const ZenEditor: React.FC<ZenEditorProps> = ({ content, onChange, placeholder = 'Commencez à écrire…' }) => {
  const [words, setWords] = useState(0);
  const [saved, setSaved] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [linkModal, setLinkModal] = useState<{ open: boolean; href: string }>({ open: false, href: '' });
  const [bubble, setBubble] = useState<BubblePos>({ x: 0, y: 0, visible: false });
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isFullscreen]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'zen-link' } }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      setWords(wordCount(html));
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => { setSaved(true); setTimeout(() => setSaved(false), 1800); }, 600);
    },
    onSelectionUpdate: ({ editor }) => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => {
        const { from, to } = editor.state.selection;
        if (from === to) { setBubble((p) => ({ ...p, visible: false })); return; }
        const view = editor.view;
        const start = view.coordsAtPos(from);
        const end = view.coordsAtPos(to);
        const midX = (start.left + end.right) / 2;
        const topY = Math.min(start.top, end.top);
        setBubble({ x: midX, y: isFullscreen ? topY - 52 : topY + window.scrollY - 52, visible: true });
      });
    },
    onBlur: () => setBubble((p) => ({ ...p, visible: false })),
    editorProps: {
      attributes: { class: 'zen-prose focus:outline-none', spellcheck: 'true' },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
      setWords(wordCount(content || ''));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  const openLinkModal = useCallback(() => {
    if (!editor) return;
    setLinkModal({ open: true, href: editor.getAttributes('link').href ?? '' });
  }, [editor]);

  const handleLinkSave = useCallback((url: string) => {
    if (!editor) return;
    if (!url) editor.chain().focus().unsetLink().run();
    else editor.chain().focus().setLink({ href: url, target: '_blank' }).run();
    setLinkModal({ open: false, href: '' });
  }, [editor]);

  if (!editor) return null;
  const minutes = Math.max(1, Math.ceil(words / 200));

  return (
    <>
      {linkModal.open && (
        <LinkModal href={linkModal.href} onSave={handleLinkSave}
          onRemove={() => { editor.chain().focus().unsetLink().run(); setLinkModal({ open: false, href: '' }); }}
          onClose={() => setLinkModal({ open: false, href: '' })}
        />
      )}

      {bubble.visible && (
        <div style={{ position: isFullscreen ? 'fixed' : 'absolute', left: bubble.x, top: bubble.y, transform: 'translateX(-50%)', zIndex: 160 }}
          className="flex items-center gap-0.5 bg-[#111] rounded-lg px-1.5 py-1 shadow-2xl"
          onMouseDown={(e) => e.preventDefault()}
        >
          <BubbleBtn active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="Gras"><Bold size={12} /></BubbleBtn>
          <BubbleBtn active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italique"><Italic size={12} /></BubbleBtn>
          <div className="w-px h-3.5 bg-white/15 mx-0.5" />
          <BubbleBtn active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}><span className="text-[10px] font-bold">H1</span></BubbleBtn>
          <BubbleBtn active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><span className="text-[10px] font-bold">H2</span></BubbleBtn>
          <div className="w-px h-3.5 bg-white/15 mx-0.5" />
          <BubbleBtn active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Citation"><Quote size={12} /></BubbleBtn>
          <BubbleBtn active={editor.isActive('link')} onClick={openLinkModal} title="Lien"><Link2 size={12} /></BubbleBtn>
        </div>
      )}

      <div className={`zen-editor-wrap border border-[var(--border-color)] bg-[var(--bg-color)] ${isFullscreen ? 'fixed inset-0 z-[150] flex flex-col rounded-none' : 'rounded-xl overflow-hidden'}`}>
        <div className="flex items-center gap-0.5 px-3 py-2 border-b border-[var(--border-color)] bg-[var(--card-bg)] flex-wrap">
          <ToolBtn active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="H1"><span className="text-[11px] font-bold">H1</span></ToolBtn>
          <ToolBtn active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="H2"><span className="text-[11px] font-bold">H2</span></ToolBtn>
          <ToolBtn active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="H3"><span className="text-[11px] font-bold">H3</span></ToolBtn>
          <Sep />
          <ToolBtn active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="Gras (⌘B)"><Bold size={13} /></ToolBtn>
          <ToolBtn active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italique (⌘I)"><Italic size={13} /></ToolBtn>
          <Sep />
          <ToolBtn active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Citation"><Quote size={13} /></ToolBtn>
          <ToolBtn active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Liste à puces"><List size={13} /></ToolBtn>
          <ToolBtn active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Liste numérotée"><AlignLeft size={13} /></ToolBtn>
          <Sep />
          <ToolBtn active={editor.isActive('link')} onClick={openLinkModal} title="Lien"><Link2 size={13} /></ToolBtn>
          <ToolBtn active={false} onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Séparateur"><Minus size={13} /></ToolBtn>
          <ToolBtn active={false} onClick={() => { const u = window.prompt("URL de l'image"); if (u) editor.chain().focus().setImage({ src: u }).run(); }} title="Image">
            <span className="text-[10px] font-medium">IMG</span>
          </ToolBtn>
          <div className="ml-auto">
            <ToolBtn active={false} onClick={() => setIsFullscreen((v) => !v)} title={isFullscreen ? 'Quitter le plein écran (Échap)' : 'Plein écran'}>
              {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </ToolBtn>
          </div>
        </div>

        <div className={`zen-editor-body ${isFullscreen ? 'flex-1 overflow-y-auto px-8 py-10 md:py-14' : 'px-8 py-8 md:px-12 md:py-10'}`}>
          <div className={isFullscreen ? 'max-w-2xl mx-auto' : ''}>
            <EditorContent editor={editor} />
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-2.5 border-t border-[var(--border-color)] bg-[var(--card-bg)]">
          <div className="flex items-center gap-4 text-[11px] text-[var(--text-color)]/30 uppercase tracking-wider">
            <span>{words} mot{words > 1 ? 's' : ''}</span>
            <span className="flex items-center gap-1"><Clock size={10} />{minutes} min</span>
          </div>
          <span className={`flex items-center gap-1 text-[11px] text-green-500 transition-opacity duration-300 ${saved ? 'opacity-100' : 'opacity-0'}`}>
            <Check size={11} />Sauvegardé
          </span>
        </div>
      </div>
    </>
  );
};

export default ZenEditor;
