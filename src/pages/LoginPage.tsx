import { useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { ApiError } from '../api/apiClient';
import { IconAlert, IconEdit, IconFileText, IconTag } from '../components/icons';

export function LoginPage() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		setError(null);
		setSubmitting(true);
		try {
			await login(email, password);
			const from = (location.state as { from?: string } | null)?.from ?? '/';
			navigate(from, { replace: true });
		} catch (err) {
			setError(err instanceof ApiError ? err.message : 'Đăng nhập thất bại. Kiểm tra lại email/mật khẩu.');
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div className="login-shell">
			<div className="login-panel">
				<div className="login-panel-brand">
					<span className="brand-mark">RR</span>
					<span>Relatos Reales</span>
				</div>
				<h2>Kể những câu chuyện đáng nhớ.</h2>
				<p>Không gian quản trị dành riêng cho đội ngũ biên tập Relatos Reales.</p>
				<ul className="login-panel-features">
					<li>
						<IconFileText /> Soạn thảo bài viết trực quan, chèn ảnh dễ dàng
					</li>
					<li>
						<IconEdit /> Xuất bản / chỉnh sửa chỉ trong vài giây
					</li>
					<li>
						<IconTag /> Tổ chức theo danh mục, thẻ, chuỗi truyện
					</li>
				</ul>
			</div>
			<div className="login-form-side">
				<form className="login-card" onSubmit={handleSubmit}>
					<h1>Đăng nhập</h1>
					<p className="subtitle">Nhập thông tin tài khoản quản trị của bạn</p>
					<div className="form-grid">
						<div className="form-field">
							<label htmlFor="email">Email</label>
							<input id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
						</div>
						<div className="form-field">
							<label htmlFor="password">Mật khẩu</label>
							<input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
						</div>
						{error && (
							<div className="error-banner">
								<IconAlert />
								<span>{error}</span>
							</div>
						)}
						<button className="btn" type="submit" disabled={submitting} style={{ justifyContent: 'center' }}>
							{submitting && <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />}
							{submitting ? 'Đang đăng nhập…' : 'Đăng nhập'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
