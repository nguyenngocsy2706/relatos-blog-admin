export function Pagination({
	page,
	totalPages,
	onChange,
}: {
	page: number;
	totalPages: number;
	onChange: (page: number) => void;
}) {
	if (totalPages <= 1) return null;
	return (
		<div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '1rem 1.25rem' }}>
			<button className="btn btn-secondary" disabled={page <= 0} onClick={() => onChange(page - 1)}>
				Trước
			</button>
			<span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
				Trang {page + 1} / {totalPages}
			</span>
			<button className="btn btn-secondary" disabled={page + 1 >= totalPages} onClick={() => onChange(page + 1)}>
				Sau
			</button>
		</div>
	);
}
