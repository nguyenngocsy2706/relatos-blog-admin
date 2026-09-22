import { useAuth } from '../auth/AuthContext';
import { IconLogout } from './icons';

const ROLE_LABELS: Record<string, string> = { ADMIN: 'Quản trị viên', EDITOR: 'Biên tập viên' };

export function Topbar() {
	const { user, logout } = useAuth();
	const initial = user?.displayName?.trim()?.[0]?.toUpperCase() ?? '?';

	return (
		<header className="topbar">
			<div className="user">
				<span className="user-avatar">{initial}</span>
				<span className="user-meta">
					<span>{user?.displayName}</span>
					<span className="role">{user ? (ROLE_LABELS[user.role] ?? user.role) : ''}</span>
				</span>
			</div>
			<button className="btn btn-secondary" onClick={logout}>
				<IconLogout />
				Đăng xuất
			</button>
		</header>
	);
}
