import { apiFetch } from './apiClient';
import type { UserSummary } from '../types/post';

export interface LoginResponse {
	token: string;
	expiresAt: number;
	user: UserSummary;
}

export function login(email: string, password: string): Promise<LoginResponse> {
	return apiFetch<LoginResponse>('/auth/login', {
		method: 'POST',
		body: { email, password },
	});
}
