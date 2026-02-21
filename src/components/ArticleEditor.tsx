import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Megaphone,
} from 'lucide-react';
import { DEFAULT_NOTABLY_CTA, NotablyCta, type NotablyCtaAttributes } from './NotablyCtaExtension';

interface ArticleEditorProps {
  content: string;
  onChange: (content: string) => void;
  onImageClick: () => void;
}

export default function ArticleEditor({ content, onChange, onImageClick }: ArticleEditorProps) {
  const [showCtaDialog, setShowCtaDialog] = useState(false);
  const [ctaData, setCtaData] = useState<NotablyCtaAttributes>({ ...DEFAULT_NOTABLY_CTA });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Begynn å skrive artikkelen din her...',
      }),
      NotablyCta,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[500px] p-4',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('Lim inn URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const openCtaDialog = () => {
    setCtaData({ ...DEFAULT_NOTABLY_CTA });
    setShowCtaDialog(true);
  };

  const updateCtaField = (field: keyof NotablyCtaAttributes, value: string) => {
    setCtaData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInsertCta = () => {
    if (!ctaData.title.trim() || !ctaData.primaryText.trim()) {
      alert('CTA må ha minst tittel og primær knappetekst');
      return;
    }

    editor.chain().focus().insertNotablyCta(ctaData).run();
    setShowCtaDialog(false);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <div className="border-b border-gray-300 bg-gray-50 p-2 flex flex-wrap gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-300' : ''}`}
          title="Fet"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-300' : ''}`}
          title="Kursiv"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-gray-300' : ''}`}
          title="Understreking"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''}`}
          title="Overskrift 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''}`}
          title="Overskrift 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-300' : ''}`}
          title="Punktliste"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-300' : ''}`}
          title="Nummerert liste"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-300' : ''}`}
          title="Sitat"
        >
          <Quote className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('codeBlock') ? 'bg-gray-300' : ''}`}
          title="Kodeblokk"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''}`}
          title="Venstrejuster"
        >
          <AlignLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''}`}
          title="Sentrer"
        >
          <AlignCenter className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''}`}
          title="Høyrejuster"
        >
          <AlignRight className="w-4 h-4" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        <button
          onClick={addLink}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-300' : ''}`}
          title="Sett inn lenke"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <button
          onClick={onImageClick}
          className="p-2 rounded hover:bg-gray-200"
          title="Sett inn bilde"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <button
          onClick={insertTable}
          className="p-2 rounded hover:bg-gray-200"
          title="Sett inn tabell"
        >
          <TableIcon className="w-4 h-4" />
        </button>

        <button
          onClick={openCtaDialog}
          className="p-2 rounded hover:bg-gray-200"
          title="Sett inn CTA-modul"
        >
          <Megaphone className="w-4 h-4" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Angre"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Gjør om"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      <EditorContent editor={editor} />

      {showCtaDialog && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Sett inn CTA-modul</h3>
              <p className="text-sm text-gray-600 mt-1">
                Blokken legges inn der markøren står i artikkelteksten.
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tittel</label>
                <input
                  type="text"
                  value={ctaData.title}
                  onChange={(e) => updateCtaField('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Beskrivelse</label>
                <textarea
                  value={ctaData.description}
                  onChange={(e) => updateCtaField('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sekundær lenketekst</label>
                  <input
                    type="text"
                    value={ctaData.secondaryText}
                    onChange={(e) => updateCtaField('secondaryText', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sekundær lenke</label>
                  <input
                    type="text"
                    value={ctaData.secondaryUrl}
                    onChange={(e) => updateCtaField('secondaryUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="/demo eller https://notably.no/"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primær knappetekst</label>
                  <input
                    type="text"
                    value={ctaData.primaryText}
                    onChange={(e) => updateCtaField('primaryText', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primær knappelenke</label>
                  <input
                    type="text"
                    value={ctaData.primaryUrl}
                    onChange={(e) => updateCtaField('primaryUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="/priser eller https://notably.no/"
                  />
                </div>
              </div>

              <p className="text-xs text-gray-500">
                Tips: For å endre en eksisterende CTA senere, slett blokken og sett inn en ny.
              </p>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowCtaDialog(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Avbryt
              </button>
              <button
                onClick={handleInsertCta}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Sett inn CTA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
