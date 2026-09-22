import { apiFetch } from './apiClient';
import type { Page, Post, PostStatus, PostSummary, PostUpsertInput } from '../types/post';

export function listAdminPosts(params: { search?: string; status?: PostStatus; page?: number; size?: number }): Promise<Page<PostSummary>> {
	const query = new URLSearchParams();
	if (params.search) query.set('search', params.search);
	if (params.status) query.set('status', params.status);
	query.set('page', String(params.page ?? 0));
	query.set('size', String(params.size ?? 20));
	return apiFetch<Page<PostSummary>>(`/admin/posts?${query.toString()}`);
}

export function getAdminPost(id: number): Promise<Post> {
	return apiFetch<Post>(`/admin/posts/${id}`);
}

export function createPost(input: PostUpsertInput): Promise<Post> {
	return apiFetch<Post>('/admin/posts', { method: 'POST', body: input });
}

export function updatePost(id: number, input: PostUpsertInput): Promise<Post> {
	return apiFetch<Post>(`/admin/posts/${id}`, { method: 'PUT', body: input });
}

export function updatePostStatus(id: number, status: PostStatus): Promise<Post> {
	return apiFetch<Post>(`/admin/posts/${id}/status`, { method: 'PATCH', body: { status } });
}

export function deletePost(id: number): Promise<void> {
	return apiFetch<void>(`/admin/posts/${id}`, { method: 'DELETE' });
}

export function uploadCoverImage(id: number, file: File): Promise<Post> {
	const formData = new FormData();
	formData.append('file', file);
	return apiFetch<Post>(`/admin/posts/${id}/cover-image`, {
		method: 'POST',
		body: formData,
		isFormData: true,
	});
}

/** Post-independent upload (works before a post has been saved/has an id) — used for the cover image picker and for inline images inserted into the rich-text body. */
export function uploadImage(file: File): Promise<{ url: string }> {
	const formData = new FormData();
	formData.append('file', file);
	return apiFetch<{ url: string }>('/admin/uploads/image', {
		method: 'POST',
		body: formData,
		isFormData: true,
	});
}
