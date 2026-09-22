import { apiFetch } from './apiClient';
import type { CategorySummary } from '../types/post';

export function listCategories(): Promise<CategorySummary[]> {
	return apiFetch<CategorySummary[]>('/categories');
}
