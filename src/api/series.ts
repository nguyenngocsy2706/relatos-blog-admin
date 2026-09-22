import { apiFetch } from './apiClient';
import type { SeriesSummary } from '../types/post';

export function listSeries(): Promise<SeriesSummary[]> {
	return apiFetch<SeriesSummary[]>('/series');
}
