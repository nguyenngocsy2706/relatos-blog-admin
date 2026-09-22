import { NavLink } from 'react-router-dom';
import { IconBarChart, IconFileText, IconFolder, IconGrid, IconLayers, IconTag } from './icons';

const NAV_ITEMS = [
	{ to: '/', label: 'Tổng quan', icon: IconGrid, enabled: true },
	{ to: '/posts', label: 'Bài viết', icon: IconFileText, enabled: true },
	{ to: '/categories', label: 'Danh mục', icon: IconFolder, enabled: false },
	{ to: '/series', label: 'Chuỗi truyện', icon: IconLayers, enabled: false },
	{ to: '/tags', label: 'Thẻ', icon: IconTag, enabled: false },
	{ to: '/reports', label: 'Báo cáo', icon: IconBarChart, enabled: false },
];

export function Sidebar() {
	return (
		<aside className="sidebar">
			<div className="brand">
				<span className="brand-mark">RR</span>
				<span className="brand-text">
					Relatos Reales
					<small>Quản trị nội dung</small>
				</span>
			</div>
			<nav>
				{NAV_ITEMS.map((item) =>
					item.enabled ? (
						<NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
							<item.icon />
							{item.label}
						</NavLink>
					) : (
						<span key={item.to} className="disabled" title="Sắp ra mắt">
							<item.icon />
							{item.label}
							<span className="soon">Sắp có</span>
						</span>
					)
				)}
			</nav>
		</aside>
	);
}
