'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Bold, Italic, Underline, Link, List, ListOrdered, Palette } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync value from parent
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      // If editor contains only a line break, treat it as empty
      onChange(html === '<br>' || html === '' ? '' : html);
    }
  };

  const executeCommand = (command: string, arg: string = '') => {
    if (!mounted) return;
    document.execCommand(command, false, arg);
    handleInput();
  };

  const addLink = () => {
    const url = prompt('Enter the link URL (e.g. https://example.com):');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  if (!mounted) {
    return <div className="animate-pulse bg-slate-900 border border-slate-700 h-40 rounded-xl" />;
  }

  return (
    <div className={`border border-slate-700 rounded-lg bg-slate-900 overflow-hidden ${className}`}>
      {/* Dynamic style tag for editor placeholder styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        .rich-editor-area:empty::before {
          content: attr(data-placeholder);
          color: #64748b;
          pointer-events: none;
          display: block;
        }
      `}} />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-2 border-b border-slate-700">
        <button
          type="button"
          onClick={() => executeCommand('bold')}
          className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('italic')}
          className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('underline')}
          className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors"
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </button>
        
        <span className="w-px h-4 bg-slate-800 mx-1" />

        <button
          type="button"
          onClick={addLink}
          className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors"
          title="Insert Link"
        >
          <Link className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => executeCommand('insertUnorderedList')}
          className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('insertOrderedList')}
          className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <span className="w-px h-4 bg-slate-800 mx-1" />

        {/* Font Size Selector */}
        <select
          onChange={(e) => executeCommand('fontSize', e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded text-xs text-slate-300 px-2 py-1 focus:outline-none"
          defaultValue="3"
        >
          <option value="1">Smallest</option>
          <option value="2">Small</option>
          <option value="3">Normal</option>
          <option value="4">Large</option>
          <option value="5">Extra Large</option>
          <option value="6">Huge</option>
        </select>

        {/* Font Family Selector */}
        <select
          onChange={(e) => executeCommand('fontName', e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded text-xs text-slate-300 px-2 py-1 focus:outline-none font-sans"
          defaultValue="sans-serif"
        >
          <option value="sans-serif" className="font-sans">Sans-Serif</option>
          <option value="serif" className="font-serif">Serif</option>
          <option value="monospace" className="font-mono">Monospace</option>
          <option value="cursive">Cursive</option>
        </select>

        {/* Text Color Picker */}
        <div className="relative flex items-center">
          <Palette className="h-4 w-4 text-slate-400 absolute left-2 pointer-events-none" />
          <input
            type="color"
            onChange={(e) => executeCommand('foreColor', e.target.value)}
            className="w-10 h-7 rounded border border-slate-800 bg-slate-900 p-0 cursor-pointer pl-6 opacity-80"
            title="Text Color"
          />
        </div>
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-4 min-h-[150px] max-h-[300px] overflow-y-auto text-sm text-slate-200 focus:outline-none whitespace-normal break-words rich-editor-area"
        data-placeholder={placeholder}
      />
    </div>
  );
}
