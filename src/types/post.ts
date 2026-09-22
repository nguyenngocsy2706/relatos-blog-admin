export type PostStatus = 'DRAFT' | 'PUBLISHED';

export interface UserSummary {
	id: number;
	email: string;
	displayName: string;
	role: 'ADMIN' | 'EDITOR';
}

export interface SeriesSummary {
	id: number;
	name: string;
	slug: string;
	description: string | null;
}

export interface CategorySummary {
	id: number;
	name: string;
	slug: string;
	description: string | null;
}

export interface TagSummary {
	id: number;
	name: string;
	slug: string;
}

export interface PostSummary {
	id: number;
	title: string;
	slug: string;
	hook: string | null;
	excerpt: string;
	coverImageUrl: string | null;
	coverImageAlt: string | null;
	status: PostStatus;
	publishedAt: string | null;
	createdAt: string;
	series: SeriesSummary | null;
	category: CategorySummary | null;
	author: UserSummary;
}

export interface Post extends PostSummary {
	contentHtml: string;
	updatedAt: string;
	tags: TagSummary[];
}

export interface Page<T> {
	content: T[];
	totalElements: number;
	totalPages: number;
	number: number;
	size: number;
}

export interface PostUpsertInput {
	title: string;
	slug?: string;
	hook?: string;
	excerpt?: string;
	contentHtml: string;
	coverImageUrl?: string;
	coverImageAlt?: string;
	seriesId?: number;
	categoryId?: number;
	tagNames?: string[];
	status?: PostStatus;
}
