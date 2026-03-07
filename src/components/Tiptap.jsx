import './Tiptap.css';

import { useEditor, EditorContent } from '@tiptap/react';

import StarterKit from '@tiptap/starter-kit';

import { useEffect } from "react";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";

const Tiptap = ({ value = "", onChange, onReady, placeholder = "Aquí comienza tu historia..." }) => {
    const uniqueExtensions = (() => {
        const base = [
            StarterKit,
            Underline,
            Placeholder.configure({
                placeholder,
                showOnlyWhenEditable: true,
            }),
        ];
        const seen = new Set();
        const out = [];
        for (const ext of base) {
            const name = ext?.name;
            if (name && seen.has(name)) continue;
            if (name) seen.add(name);
            out.push(ext);
        }
        return out;
    })();

    const editor = useEditor({
        extensions: uniqueExtensions,
        content: value || "",
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },
    });
    
    useEffect(() => {
        if (editor && !editor.isDestroyed) {
            onReady?.(editor);
        }
    }, [editor, onReady]);
      
    // Mantener sincronizado el contenido si cambia desde fuera (ej: cargar datos)
    useEffect(() => {
        if (!editor) return;
        const current = editor.getHTML();
        const next = value || "";
        if (current !== next) {
            // false = no añade al historial
            editor.commands.setContent(next, false);
        }
    }, [editor, value]);

    return (
        <div className="Tiptap">
            <main>
                <EditorContent editor={editor} />
            </main>          
        </div>
    );
};

export default Tiptap;
