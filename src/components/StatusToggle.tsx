import type { PostStatus } from '../types/post';

export function StatusToggle({
	status,
	onToggle,
	disabled,
}: {
	status: PostStatus;
	onToggle: (next: PostStatus) => void;
	disabled?: boolean;
}) {
	const isPublished = status === 'PUBLISHED';
	return (
		<button
			type="button"
			className={`status-toggle ${isPublished ? 'on' : ''}`}
			onClick={() => onToggle(isPublished ? 'DRAFT' : 'PUBLISHED')}
			disabled={disabled}
			title={isPublished ? 'Bấm để chuyển về Nháp' : 'Bấm để xuất bản'}
		>
			<span className="switch" />
			{isPublished ? 'Công khai' : 'Nháp'}
		</button>
	);
}
