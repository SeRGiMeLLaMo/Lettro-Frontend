import './Tiptap.css';

import { useEditor, EditorContent, useEditorState } from '@tiptap/react';

import StarterKit from '@tiptap/starter-kit';

import Toolbar from './Toolbar';


const Tiptap = () => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: 'Hello World!',
    });

    const editorState = useEditorState({
        editor,
        selector:(ctx) =>{
            return {
               isBold: ctx.editor.isActive('bold'),
               isItalic: ctx.editor.isActive('italic'),
               isUnderline: ctx.editor.isActive('underline'),
               isHeading1: ctx.editor.isActive('heading1', { level: 1 }),
               isHeading2: ctx.editor.isActive('heading2', { level: 2 }),
               isHeading3: ctx.editor.isActive('heading3', { level: 3 }),
               isParagraph: ctx.editor.isActive('paragraph'),
               isOrderedList: ctx.editor.isActive('orderedList'),
               isBulletList: ctx.editor.isActive('bulletList'),
            };
        },
             
    });
      

    const functions = {
        toggleBold: () => editor.chain().focus().toggleBold().run(),
        toggleItalic: () => editor.chain().focus().toggleItalic().run(),
        toggleUnderline: () => editor.chain().focus().toggleUnderline().run(),
        toggleH1: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        toggleH2: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        toggleH3: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        toggleParagraph: () => editor.chain().focus().toggleParagraph().run(),
        toggleOrderedList: () => editor.chain().focus().toggleOrderedList().run(),
        toggleBulletList: () => editor.chain().focus().toggleBulletList().run(),
        saveContent: () => {
            console.log(editor.getHTML());
        },
    }
    
    return (
        <div className="Tiptap">
            <Toolbar functions={functions} editorState={editorState} />
            <main>
                <EditorContent editor={editor} />
            </main>          
        </div>
    );
};

export default Tiptap;