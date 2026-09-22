import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deletePost, listAdminPosts, updatePostStatus } from '../api/posts';
import type { Page, PostStatus, PostSummary } from '../types/post';
import { StatusToggle } from '../components/StatusToggle';
import { Pagination } from '../components/Pagination';
import { ApiError } from '../api/apiClient';
import { IconAlert, IconCheck, IconEdit, IconEye, IconInbox, IconLink, IconPlus, IconTrash } from '../components/icons';

const dateFormatter = new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const PUBLIC_SITE_URL = import.meta.env.VITE_PUBLIC_SITE_URL ?? 'http://localhost:4321';

function postUrl(post: PostSummary): string {
	return `${PUBLIC_SITE_URL}/historias/${post.slug}/`;
}

export function PostsListPage() {
	const navigate = useNavigate();
	const [data, setData] = useState<Page<PostSummary> | null>(null);
	const [search, setSearch] = useState('');
	const [status, setStatus] = useState<PostStatus | ''>('');
	const [page, setPage] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [pendingId, setPendingId] = useState<number | null>(null);
	const [copiedId, setCopiedId] = useState<number | null>(null);

	async function load() {
		setLoading(true);
		setError(null);
		try {
			const result = await listAdminPosts({ search: search || undefined, status: status || undefined, page });
			setData(result);
		} catch (err) {
			setError(err instanceof ApiError ? err.message : 'Không tải được danh sách bài viết');
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, status]);

	function handleSearchSubmit(e: FormEvent) {
		e.preventDefault();
		setPage(0);
		load();
	}

	async function handleToggleStatus(post: PostSummary, next: PostStatus) {
		setPendingId(post.id);
		try {
			await updatePostStatus(post.id, next);
			await load();
		} catch (err) {
			setError(err instanceof ApiError ? err.message : 'Không cập nhật được trạng thái');
		} finally {
			setPendingId(null);
		}
	}

	async function handleCopyLink(post: PostSummary) {
		try {
			await navigator.clipboard.writeText(postUrl(post));
			setCopiedId(post.id);
			setTimeout(() => setCopiedId((current) => (current === post.id ? null : current)), 1500);
		} catch {
			setError('Không copy được link — trình duyệt chặn quyền truy cập clipboard.');
		}
	}

	async function handleDelete(post: PostSummary) {
		if (!confirm(`Xoá bài "${post.title}"? Không thể hoàn tác.`)) return;
		setPendingId(post.id);
		try {
			await deletePost(post.id);
			await load();
		} catch (err) {
			setError(err instanceof ApiError ? err.message : 'Không xoá được bài viết');
		} finally {
			setPendingId(null);
		}
	}

	return (
		<div className="page">
			<div className="page-header">
				<div>
					<h1>Bài viết</h1>
					<p>Tạo, sắp xếp và xuất bản các câu chuyện.</p>
				</div>
				<button className="btn" onClick={() => navigate('/posts/new')}>
					<IconPlus /> Bài viết mới
				</button>
			</div>

			<form className="card filter-bar" onSubmit={handleSearchSubmit}>
				<input type="text" placeholder="Tìm theo tiêu đề hoặc slug…" value={search} onChange={(e) => setSearch(e.target.value)} />
				<select value={status} onChange={(e) => { setStatus(e.target.value as PostStatus | ''); setPage(0); }}>
					<option value="">Tất cả trạng thái</option>
					<option value="PUBLISHED">Công khai</option>
					<option value="DRAFT">Nháp</option>
				</select>
				<button className="btn btn-secondary" type="submit">
					Lọc
				</button>
			</form>

			{error && (
				<div className="error-banner" style={{ marginBottom: '1rem' }}>
					<IconAlert />
					<span>{error}</span>
				</div>
			)}

			<div className="card">
				{loading ? (
					<div className="empty-state">
						<span className="spinner" />
					</div>
				) : !data || data.content.length === 0 ? (
					<div className="empty-state">
						<IconInbox className="empty-icon" />
						<p>Chưa có bài viết nào.</p>
					</div>
				) : (
					<table className="data-table">
						<thead>
							<tr>
								<th>Bài viết</th>
								<th>Chuỗi truyện</th>
								<th>Tác giả</th>
								<th>Trạng thái</th>
								<th>Ngày tạo</th>
								<th>Hành động</th>
							</tr>
						</thead>
						<tbody>
							{data.content.map((post) => (
								<tr key={post.id}>
									<td>
										<div className="post-title-cell">
											{post.coverImageUrl ? (
												<img className="thumb" src={post.coverImageUrl} alt="" />
											) : (
												<div className="thumb" />
											)}
											<span className="title-text">{post.title}</span>
										</div>
									</td>
									<td>{post.series?.name ?? '—'}</td>
									<td>{post.author.displayName}</td>
									<td>
										<StatusToggle status={post.status} disabled={pendingId === post.id} onToggle={(next) => handleToggleStatus(post, next)} />
									</td>
									<td>{dateFormatter.format(new Date(post.createdAt))}</td>
									<td>
										<div className="action-icons">
											{post.status === 'PUBLISHED' ? (
												<a className="icon-btn" href={postUrl(post)} target="_blank" rel="noopener noreferrer" title="Xem bài">
													<IconEye />
												</a>
											) : (
												<button className="icon-btn" disabled title="Xuất bản trước để xem trên site">
													<IconEye />
												</button>
											)}
											<button className="icon-btn" title="Copy link" onClick={() => handleCopyLink(post)}>
												{copiedId === post.id ? <IconCheck /> : <IconLink />}
											</button>
											<Link className="icon-btn" to={`/posts/${post.id}/edit`} title="Sửa">
												<IconEdit />
											</Link>
											<button className="icon-btn danger" title="Xoá" disabled={pendingId === post.id} onClick={() => handleDelete(post)}>
												<IconTrash />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
				{data && <Pagination page={data.number} totalPages={data.totalPages} onChange={setPage} />}
			</div>
		</div>
	);
}
