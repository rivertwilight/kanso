"use client";

import React, { useState, useEffect } from "react";
import { HelpCircle, Monitor, Sparkles } from "lucide-react";

/* ─── Standalone palette (no design tokens) ─── */
const c = {
	bg: "#ffffff",
	text: "#1a1a1a",
	textSec: "#555555",
	textMuted: "#999999",
	border: "#d4d4d4",
	borderLight: "#e5e5e5",
	errorRed: "#c0392b",
	errorBg: "#fef2f2",
	successGreen: "#16a34a",
	successBg: "#f0fdf4",
};

const font: React.CSSProperties = { fontFamily: "system-ui, sans-serif" };
const center: React.CSSProperties = {
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	padding: 20,
};
const demoBox: React.CSSProperties = {
	background: c.bg,
	color: c.text,
};

/* ─── 1. Button Labels ─── */

function MoreIcon() {
	return (
		<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
			<circle cx="3" cy="8" r="1.5" />
			<circle cx="8" cy="8" r="1.5" />
			<circle cx="13" cy="8" r="1.5" />
		</svg>
	);
}

const menuItem: React.CSSProperties = {
	...font,
	display: "flex",
	alignItems: "center",
	gap: 8,
	width: "100%",
	padding: "8px 14px",
	fontSize: 13,
	color: c.text,
	background: "transparent",
	border: "none",
	textAlign: "left" as const,
	cursor: "pointer",
};

type MenuItem = { icon: React.ReactNode; label: string };

function ButtonLabelMenu({
	open,
	onToggle,
	items,
}: {
	open: boolean;
	onToggle: () => void;
	items: MenuItem[];
}) {
	return (
		<div
			style={{
				...demoBox,
				padding: 20,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: 12,
			}}
		>
			<button
				onClick={onToggle}
				style={{
					...font,
					display: "flex",
					alignItems: "center",
					gap: 6,
					padding: "8px 16px",
					border: `1.5px solid ${c.border}`,
					background: "transparent",
					fontSize: 13,
					cursor: "pointer",
					color: c.text,
					borderRadius: 6,
				}}
			>
				<MoreIcon />
				<span>More</span>
			</button>
			<div
				style={{
					background: c.bg,
					border: `1px solid ${c.border}`,
					borderRadius: 8,
					boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
					minWidth: 180,
					padding: "4px 0",
					opacity: open ? 1 : 0,
					transform: open ? "translateY(0)" : "translateY(-4px)",
					transition: "opacity 0.15s, transform 0.15s",
					pointerEvents: open ? "auto" as const : "none" as const,
				}}
			>
				{items.map((item, i) => (
					<button
						key={i}
						style={menuItem}
						onMouseEnter={(e) =>
							(e.currentTarget.style.background = c.borderLight)
						}
						onMouseLeave={(e) =>
							(e.currentTarget.style.background = "transparent")
						}
					>
						{item.icon}
						{item.label}
					</button>
				))}
			</div>
		</div>
	);
}

export function ButtonLabelA() {
	const [open, setOpen] = useState(false);
	return (
		<ButtonLabelMenu
			open={open}
			onToggle={() => setOpen(!open)}
			items={[
				{ icon: <HelpCircle size={15} />, label: "Help" },
				{ icon: <Monitor size={15} />, label: "Desktop App" },
				{ icon: <Sparkles size={15} />, label: "Become a Pro" },
			]}
		/>
	);
}

export function ButtonLabelB() {
	const [open, setOpen] = useState(false);
	return (
		<ButtonLabelMenu
			open={open}
			onToggle={() => setOpen(!open)}
			items={[
				{ icon: <HelpCircle size={15} />, label: "Get Help" },
				{ icon: <Monitor size={15} />, label: "Download Desktop App" },
				{ icon: <Sparkles size={15} />, label: "Upgrade Plan" },
			]}
		/>
	);
}

/* ─── 2. Placeholder vs Label ─── */

export function PlaceholderLabelA() {
	const [value, setValue] = useState("");

	return (
		<div style={{ padding: 20, ...demoBox }}>
			<input
				type="text"
				placeholder="Enter your email address"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				style={{
					...font,
					width: "100%",
					border: `1px solid ${c.border}`,
					padding: "12px 14px",
					fontSize: 14,
					color: c.text,
					background: "transparent",
					outline: "none",
					boxSizing: "border-box",
					borderRadius: 6,
				}}
			/>
		</div>
	);
}

export function PlaceholderLabelB() {
	const [value, setValue] = useState("");
	const [focused, setFocused] = useState(false);

	return (
		<div style={{ padding: 20, ...demoBox }}>
			<label
				style={{
					...font,
					fontSize: 12,
					fontWeight: 600,
					color: focused ? c.text : c.textSec,
					marginBottom: 6,
					display: "block",
					transition: "color 0.15s",
				}}
			>
				Email address
			</label>
			<input
				type="text"
				placeholder="you@example.com"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onFocus={() => setFocused(true)}
				onBlur={() => setFocused(false)}
				style={{
					...font,
					width: "100%",
					border: focused
						? `1.5px solid ${c.text}`
						: `1px solid ${c.border}`,
					padding: "12px 14px",
					fontSize: 14,
					color: c.text,
					background: "transparent",
					outline: "none",
					boxSizing: "border-box",
					transition: "border-color 0.15s",
					borderRadius: 6,
				}}
			/>
		</div>
	);
}

/* ─── 3. Error Messages ─── */

const errorInputStyle: React.CSSProperties = {
	...font,
	width: "100%",
	border: `1.5px solid ${c.errorRed}`,
	padding: "12px 14px",
	fontSize: 14,
	color: c.text,
	background: c.errorBg,
	outline: "none",
	boxSizing: "border-box",
	borderRadius: 6,
};

export function ErrorMessageA() {
	const [value, setValue] = useState("jane@example.com");

	return (
		<div style={{ padding: 20, ...demoBox }}>
			<label
				style={{
					...font,
					fontSize: 12,
					fontWeight: 600,
					color: c.textSec,
					marginBottom: 6,
					display: "block",
				}}
			>
				Email
			</label>
			<input
				type="text"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				style={errorInputStyle}
			/>
			<div
				style={{
					...font,
					fontSize: 12,
					color: c.errorRed,
					marginTop: 6,
				}}
			>
				Invalid input.
			</div>
		</div>
	);
}

export function ErrorMessageB() {
	const [value, setValue] = useState("jane@example.com");

	return (
		<div style={{ padding: 20, ...demoBox }}>
			<label
				style={{
					...font,
					fontSize: 12,
					fontWeight: 600,
					color: c.textSec,
					marginBottom: 6,
					display: "block",
				}}
			>
				Email
			</label>
			<input
				type="text"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				style={errorInputStyle}
			/>
			<div
				style={{
					...font,
					fontSize: 12,
					color: c.errorRed,
					marginTop: 6,
				}}
			>
				This email is already registered.{" "}
				<span style={{ textDecoration: "underline", cursor: "pointer" }}>
					Try signing in instead.
				</span>
			</div>
		</div>
	);
}

/* ─── 4. Confirmation Messages ─── */

function CheckIcon() {
	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			style={{ flexShrink: 0 }}
		>
			<circle cx="10" cy="10" r="10" fill={c.successGreen} />
			<path
				d="M6 10.5l2.5 2.5L14 7.5"
				stroke="#fff"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

const toastStyle: React.CSSProperties = {
	...font,
	display: "flex",
	alignItems: "flex-start",
	gap: 10,
	padding: "12px 16px",
	borderRadius: 8,
	border: `1px solid ${c.borderLight}`,
	background: c.successBg,
};

export function ConfirmationA() {
	return (
		<div style={{ padding: 20, ...demoBox }}>
			<div style={toastStyle}>
				<CheckIcon />
				<div>
					<div style={{ fontSize: 14, fontWeight: 600, color: c.text }}>
						Success!
					</div>
				</div>
			</div>
		</div>
	);
}

export function ConfirmationB() {
	return (
		<div style={{ padding: 20, ...demoBox }}>
			<div style={toastStyle}>
				<CheckIcon />
				<div>
					<div style={{ fontSize: 14, fontWeight: 600, color: c.text }}>
						Your changes to &ldquo;Project Alpha&rdquo; have been saved.
					</div>
				</div>
			</div>
		</div>
	);
}

/* ─── 5. Empty State ─── */

export function EmptyStateWordingA() {
	const [query, setQuery] = useState("fluxcap");

	return (
		<div style={{ padding: 20, ...font, ...demoBox }}>
			<input
				type="text"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				style={{
					...font,
					width: "100%",
					border: `1px solid ${c.border}`,
					padding: "8px 12px",
					fontSize: 13,
					color: c.text,
					background: "transparent",
					outline: "none",
					boxSizing: "border-box",
					marginBottom: 16,
					borderRadius: 6,
				}}
				placeholder="Search..."
			/>
			<div
				style={{
					textAlign: "center",
					padding: "20px 0",
					fontSize: 14,
					color: c.textMuted,
				}}
			>
				No results found.
			</div>
		</div>
	);
}

export function EmptyStateWordingB() {
	const [query, setQuery] = useState("fluxcap");

	return (
		<div style={{ padding: 20, ...font, ...demoBox }}>
			<input
				type="text"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				style={{
					...font,
					width: "100%",
					border: `1px solid ${c.border}`,
					padding: "8px 12px",
					fontSize: 13,
					color: c.text,
					background: "transparent",
					outline: "none",
					boxSizing: "border-box",
					marginBottom: 16,
					borderRadius: 6,
				}}
				placeholder="Search..."
			/>
			<div style={{ textAlign: "center", padding: "12px 0" }}>
				<div style={{ marginBottom: 8, display: "flex", justifyContent: "center" }}>
					<svg
						width="32"
						height="32"
						viewBox="0 0 24 24"
						fill="none"
						stroke={c.textMuted}
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<circle cx="11" cy="11" r="8" />
						<path d="m21 21-4.3-4.3" />
					</svg>
				</div>
				<div
					style={{
						fontSize: 14,
						fontWeight: 600,
						marginBottom: 4,
						color: c.text,
					}}
				>
					No results for &ldquo;{query}&rdquo;
				</div>
				<div style={{ fontSize: 12, color: c.textMuted }}>
					Try a different keyword or check your spelling.
				</div>
			</div>
		</div>
	);
}

/* ─── 6. Destructive Action ─── */

const dangerZoneLabel: React.CSSProperties = {
	...font,
	fontSize: 12,
	fontWeight: 700,
	textTransform: "uppercase" as const,
	letterSpacing: "0.04em",
	color: c.errorRed,
	marginBottom: 12,
};

const projectRow: React.CSSProperties = {
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	padding: "10px 12px",
	border: `1px solid ${c.borderLight}`,
	borderRadius: 6,
	marginBottom: 8,
};

const projectName: React.CSSProperties = {
	...font,
	fontSize: 13,
	fontWeight: 600,
	color: c.text,
};

const projectMeta: React.CSSProperties = {
	...font,
	fontSize: 11,
	color: c.textMuted,
};

export function DestructiveActionA() {
	const [clicked, setClicked] = useState<string | null>(null);

	return (
		<div style={{ padding: 20, minHeight: 158, ...demoBox }}>
			<div style={dangerZoneLabel}>Danger zone</div>
			{["Landing Page", "Blog"].map((name) => (
				<div key={name} style={projectRow}>
					<div>
						<div style={projectName}>{name}</div>
						<div style={projectMeta}>Edited 2 days ago</div>
					</div>
					<button
						onClick={() => {
							setClicked(name);
							setTimeout(() => setClicked(null), 1500);
						}}
						style={{
							...font,
							padding: "5px 14px",
							border: `1px solid ${c.errorRed}`,
							background: "transparent",
							fontSize: 12,
							cursor: "pointer",
							color: c.errorRed,
							borderRadius: 5,
						}}
					>
						Delete
					</button>
				</div>
			))}
			<div
				style={{
					...font,
					fontSize: 11,
					color: c.textMuted,
					marginTop: 4,
					minHeight: 16,
					transition: "opacity 0.2s",
					opacity: clicked ? 1 : 0,
				}}
			>
				Deleted.
			</div>
		</div>
	);
}

export function DestructiveActionB() {
	const [deleted, setDeleted] = useState<string | null>(null);

	useEffect(() => {
		if (deleted) {
			const t = setTimeout(() => setDeleted(null), 4000);
			return () => clearTimeout(t);
		}
	}, [deleted]);

	const projects = ["Landing Page", "Blog"];

	return (
		<div style={{ padding: 20, minHeight: 158, ...demoBox }}>
			<div style={dangerZoneLabel}>Danger zone</div>
			{deleted && (
				<div
					style={{
						...font,
						fontSize: 12,
						color: c.text,
						padding: "8px 12px",
						background: c.errorBg,
						borderRadius: 6,
						marginBottom: 8,
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<span>&ldquo;{deleted}&rdquo; was deleted.</span>
					<span
						onClick={() => setDeleted(null)}
						style={{
							fontWeight: 600,
							textDecoration: "underline",
							cursor: "pointer",
						}}
					>
						Undo
					</span>
				</div>
			)}
			{projects
				.filter((name) => name !== deleted)
				.map((name) => (
					<div key={name} style={projectRow}>
						<div>
							<div style={projectName}>{name}</div>
							<div style={projectMeta}>Edited 2 days ago</div>
						</div>
						<button
							onClick={() => setDeleted(name)}
							style={{
								...font,
								padding: "5px 14px",
								border: `1px solid ${c.errorRed}`,
								background: "transparent",
								fontSize: 12,
								cursor: "pointer",
								color: c.errorRed,
								borderRadius: 5,
							}}
						>
							Permanently delete &ldquo;{name}&rdquo;
						</button>
					</div>
				))}
			{!deleted && (
				<div
					style={{
						...font,
						fontSize: 11,
						color: c.textMuted,
						marginTop: 4,
					}}
				>
					This action cannot be undone.
				</div>
			)}
		</div>
	);
}

/* ─── 7. Email Wording ─── */

const emailHeader: React.CSSProperties = {
	...font,
	fontSize: 11,
	color: c.textMuted,
	padding: "6px 0",
	borderBottom: `1px solid ${c.borderLight}`,
	display: "flex",
	gap: 6,
};

const emailHeaderLabel: React.CSSProperties = {
	flexShrink: 0,
};

const emailHeaderValue: React.CSSProperties = {
	color: c.text,
};

const emailBody: React.CSSProperties = {
	...font,
	fontSize: 12,
	lineHeight: 1.6,
	color: c.textSec,
};

const emailLink: React.CSSProperties = {
	color: c.textSec,
	textDecoration: "underline",
	cursor: "pointer",
};

export function EmailWordingA() {
	return (
		<div style={{ padding: 20, ...demoBox }}>
			<div style={emailHeader}>
				<span style={emailHeaderLabel}>To:</span>
				<span style={emailHeaderValue}>hi@vercel.com</span>
			</div>
			<div style={{ ...emailHeader, marginBottom: 12 }}>
				<span style={emailHeaderLabel}>Subject:</span>
				<span style={emailHeaderValue}>You&apos;ve been invited to join Acme Inc.</span>
			</div>
			<div style={emailBody}>
				<p style={{ margin: "0 0 12px" }}>
					This <strong style={{ color: c.text }}>invitation</strong> was
					intended for hi@vercel.com.
				</p>
				<p style={{ margin: "0 0 12px" }}>
					This <strong style={{ color: c.text }}>invite</strong> was sent on
					March 24, 2026, 12:55 AM (UTC) and will expire{" "}
					<strong style={{ color: c.text }}>in 72 hours</strong>. This{" "}
					<strong style={{ color: c.text }}>invite</strong> was sent from
					204.13.186.218 located in São Paulo, Brazil. If you were not
					expecting this invitation, you can ignore this email. If you are
					concerned about your account&apos;s safety, please visit{" "}
					<span style={emailLink}>our Help page</span> to get in touch with
					us.
				</p>
				<p style={{ margin: "0 0 12px" }}>
					<span style={emailLink}>Manage your notification settings</span>
				</p>
			</div>
		</div>
	);
}

export function EmailWordingB() {
	return (
		<div style={{ padding: 20, ...demoBox }}>
			<div style={emailHeader}>
				<span style={emailHeaderLabel}>To:</span>
				<span style={emailHeaderValue}>hi@vercel.com</span>
			</div>
			<div style={{ ...emailHeader, marginBottom: 12 }}>
				<span style={emailHeaderLabel}>Subject:</span>
				<span style={emailHeaderValue}>Invitation to join Acme Inc.</span>
			</div>
			<div style={emailBody}>
				<p style={{ margin: "0 0 12px" }}>
					This invitation was sent to hi@vercel.com on March 24, 2026 at
					12:55 AM (UTC) from 204.13.186.218 (São Paulo, Brazil). Expires{" "}
					<strong style={{ color: c.text }}>March 27, 2026</strong>.
				</p>
				<p style={{ margin: "0 0 12px" }}>
					Didn&apos;t expect this? Safe to ignore. Concerned about your
					account? Visit <span style={emailLink}>our Help page</span>.
				</p>
				<p style={{ margin: "0 0 12px" }}>
					<span style={emailLink}>Manage notification settings</span>
				</p>
			</div>
		</div>
	);
}

/* ─── 8. Changelog ─── */

const changelogItem: React.CSSProperties = {
	...font,
	fontSize: 13,
	lineHeight: 1.5,
	padding: "8px 0",
	borderBottom: `1px solid ${c.borderLight}`,
	color: c.textSec,
};

const changelogTag: React.CSSProperties = {
	...font,
	display: "inline-block",
	fontSize: 10,
	fontWeight: 700,
	textTransform: "uppercase" as const,
	letterSpacing: "0.05em",
	padding: "2px 6px",
	borderRadius: 3,
	marginRight: 8,
	verticalAlign: "middle",
};

export function ChangelogA() {
	return (
		<div style={{ padding: 20, ...demoBox }}>
			<div
				style={{
					...font,
					fontSize: 14,
					fontWeight: 700,
					color: c.text,
					marginBottom: 12,
				}}
			>
				v2.4.0
			</div>
			<div style={changelogItem}>
				<span
					style={{
						...changelogTag,
						background: "#dbeafe",
						color: "#1e40af",
					}}
				>
					New
				</span>
				Added dark mode support
			</div>
			<div style={changelogItem}>
				<span
					style={{
						...changelogTag,
						background: "#dcfce7",
						color: "#166534",
					}}
				>
					Fix
				</span>
				Fixed bug in PDF export
			</div>
			<div style={{ ...changelogItem, borderBottom: "none" }}>
				<span
					style={{
						...changelogTag,
						background: "#fef9c3",
						color: "#854d0e",
					}}
				>
					Fix
				</span>
				Fixed custom font rendering issue
			</div>
		</div>
	);
}

export function ChangelogB() {
	return (
		<div style={{ padding: 20, ...demoBox }}>
			<div
				style={{
					...font,
					fontSize: 14,
					fontWeight: 700,
					color: c.text,
					marginBottom: 12,
				}}
			>
				v2.4.0
			</div>
			<div style={changelogItem}>
				<span
					style={{
						...changelogTag,
						background: "#dbeafe",
						color: "#1e40af",
					}}
				>
					New
				</span>
				You can now switch to dark mode from Settings
			</div>
			<div style={changelogItem}>
				<span
					style={{
						...changelogTag,
						background: "#dcfce7",
						color: "#166534",
					}}
				>
					Fix
				</span>
				PDFs no longer export as blank pages on Firefox
			</div>
			<div style={{ ...changelogItem, borderBottom: "none" }}>
				<span
					style={{
						...changelogTag,
						background: "#dcfce7",
						color: "#166534",
					}}
				>
					Fix
				</span>
				Your exports now include custom fonts
			</div>
		</div>
	);
}

/* ─── 9. Loading State Copy ─── */

function Spinner({ size = 18 }: { size?: number }) {
	return (
		<span
			style={{
				display: "inline-block",
				width: size,
				height: size,
				border: `2px solid ${c.borderLight}`,
				borderTopColor: c.textSec,
				borderRadius: "50%",
				animation: "detail-spin 0.8s linear infinite",
			}}
		/>
	);
}

export function LoadingStateA() {
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (loading) {
			const t = setTimeout(() => setLoading(false), 6000);
			return () => clearTimeout(t);
		}
	}, [loading]);

	return (
		<div style={{ ...center, ...demoBox, minHeight: 120 }}>
			{!loading ? (
				<button
					onClick={() => setLoading(true)}
					style={{
						...font,
						padding: "10px 24px",
						border: `1.5px solid ${c.border}`,
						background: "transparent",
						fontSize: 13,
						cursor: "pointer",
						color: c.text,
						borderRadius: 6,
					}}
				>
					Generate Report
				</button>
			) : (
				<div style={{ textAlign: "center" }}>
					<Spinner />
					<div
						style={{
							...font,
							fontSize: 13,
							color: c.textMuted,
							marginTop: 10,
						}}
					>
						Please wait...
					</div>
				</div>
			)}
		</div>
	);
}

export function LoadingStateB() {
	const [loading, setLoading] = useState(false);
	const [elapsed, setElapsed] = useState(0);

	useEffect(() => {
		if (loading) {
			const t = setTimeout(() => setLoading(false), 6000);
			const tick = setInterval(() => setElapsed((e) => e + 1), 1000);
			return () => {
				clearTimeout(t);
				clearInterval(tick);
			};
		}
		setElapsed(0);
	}, [loading]);

	return (
		<div style={{ ...center, ...demoBox, minHeight: 120 }}>
			{!loading ? (
				<button
					onClick={() => setLoading(true)}
					style={{
						...font,
						padding: "10px 24px",
						border: `1.5px solid ${c.border}`,
						background: "transparent",
						fontSize: 13,
						cursor: "pointer",
						color: c.text,
						borderRadius: 6,
					}}
				>
					Generate Report
				</button>
			) : (
				<div style={{ textAlign: "center" }}>
					<Spinner />
					<div
						style={{
							...font,
							fontSize: 13,
							color: c.text,
							marginTop: 10,
							fontWeight: 600,
						}}
					>
						Generating your report...
					</div>
					<div
						style={{
							...font,
							fontSize: 12,
							color: c.textMuted,
							marginTop: 4,
						}}
					>
						This usually takes about 6 seconds
					</div>
					<div
						style={{
							...font,
							fontSize: 11,
							color: c.textMuted,
							marginTop: 8,
							fontVariantNumeric: "tabular-nums",
						}}
					>
						{elapsed}s elapsed
					</div>
				</div>
			)}
		</div>
	);
}

/* ─── 10. Disabled Feature Tooltips ─── */

function LockIcon() {
	return (
		<svg
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
			<path d="M7 11V7a5 5 0 0 1 10 0v4" />
		</svg>
	);
}

const settingsRow: React.CSSProperties = {
	...font,
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	padding: "10px 0",
	borderBottom: `1px solid ${c.borderLight}`,
};

const disabledBtn: React.CSSProperties = {
	...font,
	display: "flex",
	alignItems: "center",
	gap: 6,
	padding: "6px 14px",
	border: `1px solid ${c.borderLight}`,
	background: "#f5f5f5",
	fontSize: 12,
	color: c.textMuted,
	cursor: "default",
	borderRadius: 5,
	position: "relative" as const,
};

const tooltipStyle: React.CSSProperties = {
	...font,
	position: "absolute",
	bottom: "calc(100% + 8px)",
	right: 0,
	padding: "8px 12px",
	borderRadius: 6,
	fontSize: 12,
	lineHeight: 1.4,
	whiteSpace: "nowrap",
	background: c.text,
	color: "#fff",
	pointerEvents: "none",
	boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
};

export function DisabledTooltipA() {
	const [hover, setHover] = useState(false);

	return (
		<div style={{ padding: "40px 20px 20px", ...demoBox }}>
			<div style={{ ...settingsRow, borderBottom: "none" }}>
				<div>
					<div style={{ fontSize: 13, fontWeight: 600, color: c.text }}>
						Custom Domain
					</div>
					<div style={{ fontSize: 11, color: c.textMuted, marginTop: 2 }}>
						Use your own domain for published sites
					</div>
				</div>
				<div style={{ position: "relative" as const }}>
					<button
						style={disabledBtn}
						onMouseEnter={() => setHover(true)}
						onMouseLeave={() => setHover(false)}
					>
						<LockIcon />
						Configure
					</button>
					{hover && (
						<div style={tooltipStyle}>Available on Pro plan</div>
					)}
				</div>
			</div>
		</div>
	);
}

export function DisabledTooltipB() {
	const [hover, setHover] = useState(false);

	return (
		<div style={{ padding: "40px 20px 20px", ...demoBox }}>
			<div style={{ ...settingsRow, borderBottom: "none" }}>
				<div>
					<div style={{ fontSize: 13, fontWeight: 600, color: c.text }}>
						Custom Domain
					</div>
					<div style={{ fontSize: 11, color: c.textMuted, marginTop: 2 }}>
						Use your own domain for published sites
					</div>
				</div>
				<div style={{ position: "relative" as const }}>
					<button
						style={disabledBtn}
						onMouseEnter={() => setHover(true)}
						onMouseLeave={() => setHover(false)}
					>
						<LockIcon />
						Configure
					</button>
					{hover && (
						<div style={tooltipStyle}>
							Unlock custom domains → Pro
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

/* ─── 11. Answer Length ─── */

const faqRow: React.CSSProperties = {
	borderBottom: `1px solid ${c.borderLight}`,
};

const faqSummary: React.CSSProperties = {
	...font,
	fontSize: 13,
	fontWeight: 600,
	color: c.text,
	padding: "12px 0",
	cursor: "pointer",
	listStyle: "none",
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
};

const faqBody: React.CSSProperties = {
	...font,
	fontSize: 13,
	lineHeight: 1.6,
	color: c.textSec,
	paddingBottom: 12,
};

function FaqChevron() {
	return (
		<svg
			width="14"
			height="14"
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			style={{ color: c.textMuted, flexShrink: 0, transition: "transform 0.15s" }}
			className="faq-chevron"
		>
			<path d="M4 6l4 4 4-4" />
		</svg>
	);
}

export function AnswerLengthA() {
	return (
		<div style={{ padding: "8px 20px", height: 180, ...demoBox }}>
			<details style={{ ...faqRow, borderBottom: "none" }} open>
				<summary style={faqSummary}>
					<span>Can I cancel anytime?</span>
					<FaqChevron />
				</summary>
				<div style={faqBody}>
					<p style={{ margin: "0 0 8px" }}>
						Yes, you can cancel your subscription at any time from your
						account settings. Once you cancel, your current billing cycle
						will continue until the end of the period.
					</p>
					<p style={{ margin: "0 0 8px" }}>
						Please note that refunds are not provided for partial billing
						periods. If you cancel mid-cycle, you will retain access to
						all features until your current period expires.
					</p>
					<p style={{ margin: 0 }}>
						If you have any questions about cancellation, our support
						team is available 24/7 to assist you.
					</p>
				</div>
			</details>
		</div>
	);
}

export function AnswerLengthB() {
	return (
		<div style={{ padding: "8px 20px", height: 180, ...demoBox }}>
			<details style={{ ...faqRow, borderBottom: "none" }} open>
				<summary style={faqSummary}>
					<span>Can I cancel anytime?</span>
					<FaqChevron />
				</summary>
				<div style={faqBody}>
					Yes. No fees, no questions.
				</div>
			</details>
		</div>
	);
}

/* ─── 12. Onboarding Questions ─── */

const onboardingChip: React.CSSProperties = {
	...font,
	padding: "8px 14px",
	fontSize: 12,
	border: `1px solid ${c.border}`,
	background: "transparent",
	color: c.text,
	borderRadius: 20,
	cursor: "pointer",
	transition: "all 0.15s",
};

const onboardingChipSelected: React.CSSProperties = {
	...onboardingChip,
	background: c.text,
	color: "#fff",
	borderColor: c.text,
};

function OnboardingScreen({
	question,
	options,
}: {
	question: string;
	options: string[];
}) {
	const [selected, setSelected] = useState<string | null>(null);

	return (
		<div style={{ padding: 20, ...demoBox }}>
			<div
				style={{
					fontSize: 11,
					color: c.textMuted,
					marginBottom: 6,
					...font,
					textTransform: "uppercase" as const,
					letterSpacing: "0.05em",
				}}
			>
				Step 1 of 3
			</div>
			<div
				style={{
					fontSize: 14,
					fontWeight: 700,
					color: c.text,
					marginBottom: 14,
					...font,
				}}
			>
				{question}
			</div>
			<div
				style={{
					display: "flex",
					flexWrap: "wrap",
					gap: 8,
				}}
			>
				{options.map((opt) => (
					<button
						key={opt}
						style={
							selected === opt
								? onboardingChipSelected
								: onboardingChip
						}
						onClick={() => setSelected(opt)}
						onMouseEnter={(e) => {
							if (selected !== opt)
								e.currentTarget.style.borderColor = c.text;
						}}
						onMouseLeave={(e) => {
							if (selected !== opt)
								e.currentTarget.style.borderColor = c.border;
						}}
					>
						{opt}
					</button>
				))}
			</div>
		</div>
	);
}

export function OnboardingA() {
	return (
		<OnboardingScreen
			question="What's your role?"
			options={[
				"Designer",
				"Engineer",
				"Product Manager",
				"Marketing",
				"Executive",
				"Other",
			]}
		/>
	);
}

export function OnboardingB() {
	return (
		<OnboardingScreen
			question="What will you use Acme for?"
			options={[
				"Build a website",
				"Write and publish",
				"Manage a team",
				"Track projects",
				"Something else",
			]}
		/>
	);
}

/* ─── 13. Settings Labels ─── */

function Toggle({
	on,
	onToggle,
}: {
	on: boolean;
	onToggle: () => void;
}) {
	return (
		<button
			onClick={onToggle}
			style={{
				width: 36,
				height: 20,
				borderRadius: 10,
				border: "none",
				background: on ? c.text : c.borderLight,
				position: "relative" as const,
				cursor: "pointer",
				transition: "background 0.2s",
				flexShrink: 0,
			}}
		>
			<span
				style={{
					position: "absolute",
					top: 2,
					left: on ? 18 : 2,
					width: 16,
					height: 16,
					borderRadius: "50%",
					background: "#fff",
					transition: "left 0.2s",
					boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
				}}
			/>
		</button>
	);
}

type SettingsRow = {
	label: string;
	description?: string;
	defaultOn?: boolean;
};

type SettingsSection = {
	header?: string;
	rows: SettingsRow[];
};

function SettingsPanel({ sections }: { sections: SettingsSection[] }) {
	const allRows = sections.flatMap((s) => s.rows);
	const [toggles, setToggles] = useState<boolean[]>(
		allRows.map((r) => r.defaultOn ?? false)
	);

	let rowIndex = 0;

	return (
		<div style={{ padding: "16px 20px", ...demoBox }}>
			{sections.map((section, si) => (
				<div key={si}>
					{section.header && (
						<div
							style={{
								...font,
								fontSize: 10,
								fontWeight: 700,
								color: c.textMuted,
								textTransform: "uppercase" as const,
								letterSpacing: "0.06em",
								padding: si === 0 ? "0 0 8px" : "14px 0 8px",
							}}
						>
							{section.header}
						</div>
					)}
					{section.rows.map((row) => {
						const i = rowIndex++;
						return (
							<div
								key={i}
								style={{
									display: "flex",
									alignItems: "flex-start",
									justifyContent: "space-between",
									gap: 12,
									padding: "10px 0",
									borderBottom: `1px solid ${c.borderLight}`,
								}}
							>
								<div style={{ minWidth: 0 }}>
									<div
										style={{
											...font,
											fontSize: 13,
											color: c.text,
											fontWeight: 500,
										}}
									>
										{row.label}
									</div>
									{row.description && (
										<div
											style={{
												...font,
												fontSize: 11,
												color: c.textMuted,
												marginTop: 2,
												lineHeight: 1.4,
											}}
										>
											{row.description}
										</div>
									)}
								</div>
								<Toggle
									on={toggles[i]}
									onToggle={() =>
										setToggles((t) =>
											t.map((v, j) =>
												j === i ? !v : v
											)
										)
									}
								/>
							</div>
						);
					})}
				</div>
			))}
		</div>
	);
}

export function SettingsLabelsA() {
	return (
		<SettingsPanel
			sections={[
				{
					rows: [
						{ label: "Enable two-factor authentication", defaultOn: true },
						{ label: "Notifications", defaultOn: true },
						{
							label: "Dark Mode",
							description: "Enable dark mode for the application.",
						},
					],
				},
				{
					header: "Advanced",
					rows: [
						{ label: "Disable auto-renewal" },
					],
				},
			]}
		/>
	);
}

export function SettingsLabelsB() {
	return (
		<SettingsPanel
			sections={[
				{
					rows: [
						{
							label: "Require a code to sign in",
							description:
								"Adds a verification step to protect your account",
							defaultOn: true,
						},
						{
							label: "Send me email notifications",
							defaultOn: true,
						},
						{
							label: "Dark Mode",
							description:
								"Reduces eye strain in low-light environments",
						},
					],
				},
				{
					header: "Billing",
					rows: [
						{
							label: "Renew automatically",
							description:
								"Your plan renews on the 1st of each month",
						},
					],
				},
			]}
		/>
	);
}

/* ─── CSS keyframe injection ─── */

export function DetailDemoStyles() {
	return (
		<style>{`
			@keyframes detail-spin {
				to { transform: rotate(360deg); }
			}
			details > summary::-webkit-details-marker,
			details > summary::marker {
				display: none;
				content: "";
			}
			details[open] > summary .faq-chevron {
				transform: rotate(180deg);
			}
			details[open] > summary .reveal-chevron {
				transform: rotate(90deg);
			}
		`}</style>
	);
}
