import { EditorContent, useEditor } from '@tiptap/react';
import { FloatingMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useRef, useState } from 'react';
import { IconBold, IconImage, IconItalic, IconList, IconPlus, IconQuote } from './icons';
import { uploadImage } from '../api/posts';
import { looksLikeMarkdown, markdownTextToHtml } from '../lib/markdownPaste';

/**
 * Serializes to sanitized-on-the-server HTML (see PostServiceImpl / the OWASP
 * sanitizer on the API side) — this is the single source of truth for a
 * post's body, rendered as-is on the public Astro site via `set:html`.
 */
export function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploadingImage, setUploadingImage] = useState(false);

	const editor = useEditor({
		extensions: [
			StarterKit,
			ImageExtension,
			Placeholder.configure({ placeholder: 'Viết nội dung câu chuyện ở đây…' }),
		],
		content: value,
		onUpdate: ({ editor }) => onChange(editor.getHTML()),
		editorProps: {
			handlePaste: (_view, event) => {
				// Only intercept plain-text-only pastes (chat/AI output, .txt, Notepad…) —
				// a real text/html payload (Word, Google Docs) means TipTap already
				// knows how to paste it properly, so we stay out of the way.
				if (event.clipboardData?.getData('text/html')) return false;
				const text = event.clipboardData?.getData('text/plain');
				if (!text || !looksLikeMarkdown(text)) return false;

				event.preventDefault();
				editor?.chain().focus().insertContent(markdownTextToHtml(text)).run();
				return true;
			},
		},
	});

	// Keep the editor in sync when a different post is loaded into the same instance.
	useEffect(() => {
		if (editor && value !== editor.getHTML()) {
			editor.commands.setContent(value, { emitUpdate: false });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editor]);

	async function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		e.target.value = ''; // allow picking the same file again later
		if (!file || !editor) return;
		setUploadingImage(true);
		try {
			const { url } = await uploadImage(file);
			editor.chain().focus().setImage({ src: url }).run();
		} catch {
			alert('Không tải được ảnh lên. Thử lại sau.');
		} finally {
			setUploadingImage(false);
		}
	}

	if (!editor) return null;

	return (
		<div className="editor-shell">
			<div className="editor-toolbar">
				<button type="button" className={editor.isActive('bold') ? 'is-active' : ''} onClick={() => editor.chain().focus().toggleBold().run()}>
					<IconBold /> Đậm
				</button>
				<button type="button" className={editor.isActive('italic') ? 'is-active' : ''} onClick={() => editor.chain().focus().toggleItalic().run()}>
					<IconItalic /> Nghiêng
				</button>
				<button type="button" className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
					Tiêu đề
				</button>
				<button type="button" className={editor.isActive('bulletList') ? 'is-active' : ''} onClick={() => editor.chain().focus().toggleBulletList().run()}>
					<IconList /> Danh sách
				</button>
				<button type="button" className={editor.isActive('blockquote') ? 'is-active' : ''} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
					<IconQuote /> Trích dẫn
				</button>
				<button type="button" disabled={uploadingImage} onClick={() => fileInputRef.current?.click()}>
					<IconImage /> {uploadingImage ? 'Đang tải…' : 'Ảnh'}
				</button>
				<input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageFile} />
			</div>
			<EditorContent editor={editor} />
			{/* Notion-style "+" that appears right at the cursor on a blank line (after
			    pressing Enter) — lets you drop an image between chapters/paragraphs
			    without scrolling back up to the toolbar every time. */}
			<FloatingMenu
				editor={editor}
				className="floating-image-menu"
				// The default shouldShow only shows on the document's very first empty
				// node — useless for a multi-chapter story where you want the "+" on
				// ANY blank line you create between paragraphs. This shows it on every
				// empty paragraph instead.
				shouldShow={({ state }) => {
					const { $anchor, empty } = state.selection;
					return empty && $anchor.parent.type.name === 'paragraph' && $anchor.parent.content.size === 0;
				}}
				// .ProseMirror scrolls internally (fixed max-height, see index.css) instead
				// of the whole page — without this, floating-ui only listens to window
				// scroll and the "+" drifts away from the cursor as soon as you scroll
				// inside a long story.
				options={{ scrollTarget: editor.view.dom, strategy: 'fixed', placement: 'left-start' }}
			>
				<button type="button" className="floating-image-btn" title="Chèn ảnh tại đây" disabled={uploadingImage} onClick={() => fileInputRef.current?.click()}>
					<IconPlus />
				</button>
			</FloatingMenu>
		</div>
	);
}
