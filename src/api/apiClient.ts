const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

const TOKEN_KEY = 'relatos_admin_token';

export function getToken(): string | null {
	try {
		return localStorage.getItem(TOKEN_KEY);
	} catch {
		return null;
	}
}

export function setToken(token: string | null) {
	try {
		if (token) localStorage.setItem(TOKEN_KEY, token);
		else localStorage.removeItem(TOKEN_KEY);
	} catch {
		// ignore storage errors (private mode, etc.)
	}
}

export class ApiError extends Error {
	status: number;
	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}

/** Fires when any API call gets a 401 — AuthContext listens for this to log the user out. */
export const UNAUTHORIZED_EVENT = 'relatos-admin-unauthorized';

interface RequestOptions extends Omit<RequestInit, 'body'> {
	body?: unknown;
	isFormData?: boolean;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
	const token = getToken();
	const headers: Record<string, string> = { ...(options.headers as Record<string, string>) };

	if (!options.isFormData) {
		headers['Content-Type'] = 'application/json';
	}
	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	const response = await fetch(`${API_BASE_URL}${path}`, {
		...options,
		headers,
		body: options.body === undefined ? undefined : options.isFormData ? (options.body as BodyInit) : JSON.stringify(options.body),
	});

	if (response.status === 401) {
		window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
	}

	if (!response.ok) {
		let message = response.statusText;
		try {
			const body = await response.json();
			message = body.message ?? message;
		} catch {
			// response wasn't JSON — keep statusText
		}
		throw new ApiError(response.status, message);
	}

	if (response.status === 204) {
		return undefined as T;
	}

	return response.json() as Promise<T>;
}
