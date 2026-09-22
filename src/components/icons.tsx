// Small hand-rolled inline SVG icon set (stroke-based, currentColor) — avoids
// pulling in an icon library dependency for a handful of glyphs.
import type { SVGProps } from 'react';

// width/height=20 is just a sane fallback for any usage that forgets to size
// it via CSS (`<svg>` has no intrinsic size otherwise, so it renders huge) —
// every place that actually cares about size still overrides it with CSS
// (`.icon-btn svg`, `.sidebar nav a svg`, etc.), which wins over these attrs.
const base = {
	viewBox: '0 0 24 24',
	width: 20,
	height: 20,
	fill: 'none',
	stroke: 'currentColor',
	strokeWidth: 1.8,
	strokeLinecap: 'round' as const,
	strokeLinejoin: 'round' as const,
};

export function IconGrid(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...base} {...props}>
			<rect x="3" y="3" width="7" height="7" rx="1.5" />
			<rect x="14" y="3" width="7" height="7" rx="1.5" />
			<rect x="3" y="14" width="7" height="7" rx="1.5" />
			<rect x="14" y="14" width="7" height="7" rx="1.5" />
		</svg>
	);
}

export function IconFileText(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...base} {...props}>
			<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
			<path d="M14 3v5h5" />
			<path d="M8.5 13h7M8.5 17h5" />
		</svg>
	);
}

export function IconFolder(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...base} {...props}>
			<path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2h8.5A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z" />
		</svg>
	);
}

export function IconLayers(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...base} {...props}>
			<path d="M12 3 3 8l9 5 9-5z" />
			<path d="M3 13l9 5 9-5" />
		</svg>
	);
}

export function IconTag(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...base} {...props}>
			<path d="M3 11.5V5a2 2 0 0 1 2-2h6.5a2 2 0 0 1 1.4.6l8 8a2 2 0 0 1 0 2.8l-6.6 6.6a2 2 0 0 1-2.8 0l-8-8A2 2 0 0 1 3 11.5z" />
			<circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none" />
		</svg>
	);
}

export function IconBarChart(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...base} {...props}>
			<path d="M4 20V10M12 20V4M20 20v-7" />
		</svg>
	);
}

export function IconLogout(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...base} {...props}>
			<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
			<path d="M16 17l5-5-5-5" />
			<path d="M21 12H9" />
		</svg>
	);
}

export function IconEdit(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...base} {...props}>
			<path d="M12 20h9" />
			<path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
		</svg>
	);
}

export function IconTrash(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...base} {...props}>
			<path d="M3 6h18" />
			<path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
			<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
			<path d="M10 11v6M14 11v6" />
		</svg>
	);
}

export function IconAlert(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...base} {...props}>
			<circle cx="12" cy="12" r="9" />
			<path d="M12 8v5" />
			<circle cx="12" cy="16" r="0.5" fill="currentColor" />
		</svg>
	);
}

export function IconInbox(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...base} {...props}>
			<path d="M3 12h4.5l1.5 3h6l1.5-3H21" />
			<path d="M5.5 5.5h13L21 12v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6z" />
		</svg>
	);
}

export function IconPlus(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...base} {...props}>
			<path d="M12 5v14M5 12h14" />
		</svg>
	);
}

export function IconBold(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...base} {...props}>
			<path d="M6 4h7a3.5 3.5 0 0 1 0 7H6zM6 11h8a3.5 3.5 0 0 1 0 7H6z" />
		</svg>
	);
}

export function IconItalic(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...base} {...props}>
			<path d="M10 4h7M6 20h7M13 4l-4 16" />
		</svg>
	);
}

export function IconList(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...base} {...props}>
			<path d="M9 6h11M9 12h11M9 18h11" />
			<circle cx="4.5" cy="6" r="1" fill="currentColor" stroke="none" />
			<circle cx="4.5" cy="12" r="1" fill="currentColor" stroke="none" />
			<circle cx="4.5" cy="18" r="1" fill="currentColor" stroke="none" />
		</svg>
	);
}

export function IconQuote(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...base} {...props}>
			<path d="M7 7h4v4a4 4 0 0 1-4 4H6" />
			<path d="M15 7h4v4a4 4 0 0 1-4 4h-1" />
		</svg>
	);
}

export function IconUpload(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...base} {...props}>
			<path d="M12 16V4M7 9l5-5 5 5" />
			<path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
		</svg>
	);
}

export function IconImage(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...base} {...props}>
			<rect x="3" y="4" width="18" height="16" rx="2" />
			<circle cx="8.5" cy="9.5" r="1.5" fill="currentColor" stroke="none" />
			<path d="M21 16l-5.5-5.5a1.5 1.5 0 0 0-2 0L3 20" />
		</svg>
	);
}

export function IconEye(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...base} {...props}>
			<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
			<circle cx="12" cy="12" r="3" />
		</svg>
	);
}

export function IconLink(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...base} {...props}>
			<path d="M9 15 15 9" />
			<path d="M10.5 6.5 12 5a3.54 3.54 0 0 1 5 5l-1.5 1.5" />
			<path d="M13.5 17.5 12 19a3.54 3.54 0 0 1-5-5l1.5-1.5" />
		</svg>
	);
}

export function IconX(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...base} {...props}>
			<path d="M18 6 6 18M6 6l12 12" />
		</svg>
	);
}

export function IconCheck(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...base} {...props}>
			<path d="M20 6 9 17l-5-5" />
		</svg>
	);
}
