import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPost, getAdminPost, updatePost, uploadImage } from '../api/posts';
import { listCategories } from '../api/categories';
import type { CategorySummary } from '../types/post';
import { RichTextEditor } from '../components/RichTextEditor';
import { ApiError } from '../api/apiClient';
import { IconAlert, IconUpload, IconX } from '../components/icons';

/** Strips HTML tags to check whether the rich-text body actually has content. */
function hasText(html: string): boolean {
	return html.replace(/<[^>]*>/g, '').trim().length > 0;
}

export function PostEditorPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const isEditing = Boolean(id);

	const [title, setTitle] = useState('');
	const [slug, setSlug] = useState('');
	const [coverImageUrl, setCoverImageUrl] = useState('');
	const [categoryId, setCategoryId] = useState<string>('');
	const [tagsText, setTagsText] = useState('');
	const [contentHtml, setContentHtml] = useState('<p></p>');

	const [categories, setCategories] = useState<CategorySummary[]>([]);
	const [loading, setLoading] = useState(isEditing);
	const [saving, setSaving] = useState(false);
	const [uploadingCover, setUploadingCover] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		listCategories().then(setCategories).catch(() => setCategories([]));
	}, []);

	useEffect(() => {
		if (!id) return;
		setLoading(true);
		getAdminPost(Number(id))
			.then((post) => {
				setTitle(post.title);
				setSlug(post.slug);
				setCoverImageUrl(post.coverImageUrl ?? '');
				setCategoryId(post.category ? String(post.category.id) : '');
				setTagsText(post.tags.map((t) => t.name).join(', '));
				setContentHtml(post.contentHtml);
			})
			.catch((err) => setError(err instanceof ApiError ? err.message : 'Không tải được bài viết'))
			.finally(() => setLoading(false));
	}, [id]);

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();

		if (!title.trim() || !coverImageUrl.trim() || !hasText(contentHtml)) {
			setError('Tiêu đề, hình ảnh và nội dung là bắt buộc.');
			return;
		}

		setSaving(true);
		setError(null);
		try {
			const input = {
				title,
				slug: slug || undefined,
				contentHtml,
				coverImageUrl,
				categoryId: categoryId ? Number(categoryId) : undefined,
				tagNames: tagsText
					.split(',')
					.map((t) => t.trim())
					.filter(Boolean),
			};
			if (isEditing) {
				await updatePost(Number(id), input);
			} else {
				await createPost(input);
			}
			navigate('/posts');
		} catch (err) {
			setError(err instanceof ApiError ? err.message : 'Không lưu được bài viết');
		} finally {
			setSaving(false);
		}
	}

	async function handleCoverFileChange(e: ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		e.target.value = '';
		if (!file) return;
		setUploadingCover(true);
		setError(null);
		try {
			const { url } = await uploadImage(file);
			setCoverImageUrl(url);
		} catch (err) {
			setError(err instanceof ApiError ? err.message : 'Không tải được ảnh lên');
		} finally {
			setUploadingCover(false);
		}
	}

	if (loading) {
		return (
			<div className="page">
				<div className="empty-state">
					<span className="spinner" />
				</div>
			</div>
		);
	}

	return (
		<div className="page">
			<div className="page-header">
				<div>
					<h1>{isEditing ? 'Sửa bài viết' : 'Tạo bài viết'}</h1>
					<p>Tiêu đề, hình ảnh và nội dung là bắt buộc — các mục còn lại tuỳ chọn.</p>
				</div>
			</div>

			{error && (
				<div className="error-banner" style={{ marginBottom: '1rem' }}>
					<IconAlert />
					<span>{error}</span>
				</div>
			)}

			<form onSubmit={handleSubmit}>
				<div className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
					<div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', display: 'grid', gap: '1.25rem' }}>
						<div className="form-field">
							<label>
								Ảnh đại diện <span className="required-mark">*</span>
							</label>
							{coverImageUrl ? (
								<div className="image-preview-card">
									<img src={coverImageUrl} alt="" />
									<button type="button" className="remove-btn" title="Xoá ảnh" onClick={() => setCoverImageUrl('')}>
										<IconX />
									</button>
								</div>
							) : (
								<div className="image-dropzone">
									<input
										type="text"
										placeholder="Dán URL ảnh vào đây"
										value={coverImageUrl}
										onChange={(e) => setCoverImageUrl(e.target.value)}
									/>
									<div className="dropzone-divider">HOẶC</div>
									<label className="btn btn-secondary">
										<IconUpload />
										{uploadingCover ? 'Đang tải lên…' : 'Chọn ảnh từ máy'}
										<input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCoverFileChange} disabled={uploadingCover} />
									</label>
								</div>
							)}
						</div>

						<div className="form-field">
							<label htmlFor="title">
								Tiêu đề <span className="required-mark">*</span>
							</label>
							<input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

							<div style={{ marginTop: '1rem' }}>
								<label htmlFor="slug">Đường dẫn (slug)</label>
								<input id="slug" type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="tự tạo từ tiêu đề nếu để trống" />
							</div>
						</div>

						<div className="form-field">
							<label htmlFor="category">Danh mục</label>
							<select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
								<option value="">Không có danh mục</option>
								{categories.map((c) => (
									<option key={c.id} value={c.id}>
										{c.name}
									</option>
								))}
							</select>
						</div>

						<div className="form-field">
							<label htmlFor="tags">Thẻ (tags)</label>
							<input id="tags" type="text" value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="gia đình, bi kịch, bí mật" />
							<p className="hint">Cách nhau bằng dấu phẩy — thẻ mới sẽ tự động được tạo.</p>
						</div>
					</div>
				</div>

				<div className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
					<div className="form-field" style={{ marginBottom: 0 }}>
						<label>
							Nội dung <span className="required-mark">*</span>
						</label>
						<RichTextEditor value={contentHtml} onChange={setContentHtml} />
					</div>
				</div>

				<div style={{ display: 'flex', gap: '0.6rem' }}>
					<button className="btn" type="submit" disabled={saving}>
						{saving && <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />}
						{saving ? 'Đang lưu…' : 'Lưu'}
					</button>
					<button className="btn btn-secondary" type="button" onClick={() => navigate('/posts')}>
						Huỷ
					</button>
				</div>
			</form>
		</div>
	);
}
