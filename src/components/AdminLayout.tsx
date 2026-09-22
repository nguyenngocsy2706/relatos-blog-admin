import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AdminLayout() {
	return (
		<div className="app-shell">
			<Sidebar />
			<div className="main-area">
				<Topbar />
				<Outlet />
			</div>
		</div>
	);
}
