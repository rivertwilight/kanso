"use client";

import React, { useState, useEffect } from "react";

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

const btnBase: React.CSSProperties = {
	...font,
	padding: "10px 24px",
	border: `2px solid ${c.text}`,
	background: "transparent",
	fontSize: 14,
	cursor: "pointer",
	color: c.text,
	borderRadius: 6,
	width: "100%",
	textAlign: "center" as const,
};

export function ButtonLabelA() {
	return (
		<div style={{ ...center, ...demoBox }}>
			<div style={{ display: "flex", flexDirection: "column", gap: 8, width: 180 }}>
				<button style={btnBase}>Submit</button>
				<button style={btnBase}>OK</button>
				<button style={btnBase}>Click Here</button>
			</div>
		</div>
	);
}

export function ButtonLabelB() {
	return (
		<div style={{ ...center, ...demoBox }}>
			<div style={{ display: "flex", flexDirection: "column", gap: 8, width: 180 }}>
				<button style={btnBase}>Save Changes</button>
				<button style={btnBase}>Create Account</button>
				<button style={btnBase}>Download Report</button>
			</div>
		</div>
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
					<div style={{ fontSize: 12, color: c.textMuted, marginTop: 2 }}>
						Last saved just now
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
				<div style={{ marginBottom: 8 }}>
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

export function DestructiveActionA() {
	const [clicked, setClicked] = useState(false);

	return (
		<div style={{ ...center, ...demoBox }}>
			<div style={{ textAlign: "center" }}>
				<button
					onClick={() => {
						setClicked(true);
						setTimeout(() => setClicked(false), 1500);
					}}
					style={{
						...font,
						padding: "10px 32px",
						border: `2px solid ${c.errorRed}`,
						background: "transparent",
						fontSize: 14,
						cursor: "pointer",
						color: c.errorRed,
						borderRadius: 6,
					}}
				>
					Delete
				</button>
				<div
					style={{
						fontSize: 11,
						color: c.textMuted,
						marginTop: 8,
						minHeight: 16,
						transition: "opacity 0.2s",
						opacity: clicked ? 1 : 0,
					}}
				>
					Deleted.
				</div>
			</div>
		</div>
	);
}

export function DestructiveActionB() {
	const [deleted, setDeleted] = useState(false);

	useEffect(() => {
		if (deleted) {
			const t = setTimeout(() => setDeleted(false), 4000);
			return () => clearTimeout(t);
		}
	}, [deleted]);

	return (
		<div style={{ ...center, ...demoBox }}>
			<div style={{ textAlign: "center" }}>
				{!deleted ? (
					<>
						<div
							style={{
								...font,
								fontSize: 13,
								color: c.textSec,
								marginBottom: 10,
							}}
						>
							Landing Page
						</div>
						<button
							onClick={() => setDeleted(true)}
							style={{
								...font,
								padding: "10px 20px",
								border: `2px solid ${c.errorRed}`,
								background: "transparent",
								fontSize: 14,
								cursor: "pointer",
								color: c.errorRed,
								borderRadius: 6,
							}}
						>
							Permanently delete &ldquo;Landing Page&rdquo;
						</button>
						<div
							style={{
								fontSize: 11,
								color: c.textMuted,
								marginTop: 8,
								minHeight: 16,
							}}
						>
							This action cannot be undone.
						</div>
					</>
				) : (
					<div style={{ ...font, fontSize: 14, color: c.text }}>
						&ldquo;Landing Page&rdquo; was deleted.{" "}
						<span
							onClick={() => setDeleted(false)}
							style={{
								textDecoration: "underline",
								cursor: "pointer",
								color: c.text,
								fontWeight: 600,
							}}
						>
							Undo
						</span>
					</div>
				)}
			</div>
		</div>
	);
}

/* ─── 7. Email Wording ─── */

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

/* ─── CSS keyframe injection ─── */

export function DetailDemoStyles() {
	return (
		<style>{`
			@keyframes detail-spin {
				to { transform: rotate(360deg); }
			}
		`}</style>
	);
}
