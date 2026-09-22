import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { listAdminPosts } from '../api/posts';
import { IconBarChart, IconFileText, IconPlus } from '../components/icons';

interface Stats {
	total: number;
	published: number;
	draft: number;
}

export function DashboardPage() {
	const { user } = useAuth();
	const [stats, setStats] = useState<Stats | null>(null);

	useEffect(() => {
		Promise.all([
			listAdminPosts({ size: 1 }),
			listAdminPosts({ status: 'PUBLISHED', size: 1 }),
			listAdminPosts({ status: 'DRAFT', size: 1 }),
		])
			.then(([all, published, draft]) =>
				setStats({ total: all.totalElements, published: published.totalElements, draft: draft.totalElements })
			)
			.catch(() => setStats(null));
	}, []);

	return (
		<div className="page">
			<div className="page-header">
				<div>
					<h1>Chào, {user?.displayName} 👋</h1>
					<p>Tổng quan nội dung của Relatos Reales.</p>
				</div>
				<Link className="btn" to="/posts/new">
					<IconPlus /> Viết bài mới
				</Link>
			</div>

			<div className="stat-grid">
				<div className="card stat-card">
					<span className="stat-pill tone-primary">
						<IconFileText />
					</span>
					<span className="stat-label">Tổng số bài viết</span>
					<span className="stat-value">{stats ? stats.total : '—'}</span>
				</div>
				<div className="card stat-card">
					<span className="stat-pill tone-success">
						<IconBarChart />
					</span>
					<span className="stat-label">Đã công khai</span>
					<span className="stat-value">{stats ? stats.published : '—'}</span>
				</div>
				<div className="card stat-card">
					<span className="stat-pill tone-muted">
						<IconFileText />
					</span>
					<span className="stat-label">Bản nháp</span>
					<span className="stat-value">{stats ? stats.draft : '—'}</span>
				</div>
			</div>

			<div className="card" style={{ padding: '1.5rem' }}>
				<p style={{ margin: 0 }}>
					Quản lý toàn bộ bài viết tại <Link to="/posts">Bài viết</Link> — tạo mới, sửa, hoặc chuyển trạng thái
					Công khai / Nháp.
				</p>
			</div>
		</div>
	);
}
