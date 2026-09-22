import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { getToken, setToken, UNAUTHORIZED_EVENT } from '../api/apiClient';
import { login as loginRequest } from '../api/auth';
import type { UserSummary } from '../types/post';

const USER_KEY = 'relatos_admin_user';

interface AuthContextValue {
	user: UserSummary | null;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function loadStoredUser(): UserSummary | null {
	try {
		const raw = localStorage.getItem(USER_KEY);
		return raw ? (JSON.parse(raw) as UserSummary) : null;
	} catch {
		return null;
	}
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<UserSummary | null>(() => (getToken() ? loadStoredUser() : null));

	const logout = useCallback(() => {
		setToken(null);
		try {
			localStorage.removeItem(USER_KEY);
		} catch {
			// ignore
		}
		setUser(null);
	}, []);

	useEffect(() => {
		window.addEventListener(UNAUTHORIZED_EVENT, logout);
		return () => window.removeEventListener(UNAUTHORIZED_EVENT, logout);
	}, [logout]);

	const login = useCallback(async (email: string, password: string) => {
		const response = await loginRequest(email, password);
		setToken(response.token);
		try {
			localStorage.setItem(USER_KEY, JSON.stringify(response.user));
		} catch {
			// ignore
		}
		setUser(response.user);
	}, []);

	const value = useMemo<AuthContextValue>(
		() => ({ user, isAuthenticated: user !== null, login, logout }),
		[user, login, logout]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
}
