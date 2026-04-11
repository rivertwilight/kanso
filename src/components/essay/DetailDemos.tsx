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
	borderRadius: 8,
	color: c.text,
};

/* ─── 1. Button Loading ─── */

function Spinner({ size = 16 }: { size?: number }) {
	return (
		<span
			style={{
				display: "inline-block",
				width: size,
				height: size,
				border: `2px solid ${c.borderLight}`,
				borderTopColor: c.text,
				borderRadius: "50%",
				animation: "detail-spin 0.8s linear infinite",
			}}
		/>
	);
}

export function ButtonLoadingA() {
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (loading) {
			const t = setTimeout(() => setLoading(false), 2000);
			return () => clearTimeout(t);
		}
	}, [loading]);

	return (
		<div style={{ ...center, ...demoBox }}>
			<button
				onClick={() => setLoading(true)}
				style={{
					...font,
					padding: "10px 32px",
					border: `2px solid ${c.text}`,
					background: "transparent",
					fontSize: 14,
					cursor: "pointer",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					minWidth: 140,
					minHeight: 42,
					color: c.text,
					borderRadius: 6,
				}}
			>
				{loading ? <Spinner /> : "Submit"}
			</button>
		</div>
	);
}

export function ButtonLoadingB() {
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (loading) {
			const t = setTimeout(() => setLoading(false), 2000);
			return () => clearTimeout(t);
		}
	}, [loading]);

	return (
		<div style={{ ...center, ...demoBox }}>
			<button
				onClick={() => setLoading(true)}
				style={{
					...font,
					padding: "10px 32px",
					border: `2px solid ${c.text}`,
					background: "transparent",
					fontSize: 14,
					cursor: "pointer",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					gap: 8,
					minWidth: 140,
					minHeight: 42,
					color: c.text,
					borderRadius: 6,
				}}
			>
				{loading && <Spinner size={14} />}
				<span>{loading ? "Submitting..." : "Submit"}</span>
			</button>
		</div>
	);
}

/* ─── 2. Input Label ─── */

export function InputLabelA() {
	const [value, setValue] = useState("");

	return (
		<div style={{ padding: 20, ...demoBox }}>
			<input
				type="text"
				placeholder="Email address"
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

export function InputLabelB() {
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
				placeholder="jane@example.com"
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

/* ─── 3. Icon Alignment ─── */

function MenuIcon({ nudge = 0 }: { nudge?: number }) {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			style={{ marginTop: nudge, flexShrink: 0 }}
		>
			<path
				d="M2 3h12M2 8h12M2 13h8"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	);
}

export function IconAlignA() {
	return (
		<div style={{ ...center, ...demoBox }}>
			<div
				style={{
					...font,
					padding: "10px 20px",
					border: `1.5px solid ${c.text}`,
					fontSize: 14,
					display: "flex",
					alignItems: "center",
					gap: 8,
					color: c.text,
					borderRadius: 6,
				}}
			>
				<MenuIcon nudge={2} />
				<span>Settings</span>
			</div>
		</div>
	);
}

export function IconAlignB() {
	return (
		<div style={{ ...center, ...demoBox }}>
			<div
				style={{
					...font,
					padding: "10px 20px",
					border: `1.5px solid ${c.text}`,
					fontSize: 14,
					display: "flex",
					alignItems: "center",
					gap: 8,
					color: c.text,
					borderRadius: 6,
				}}
			>
				<MenuIcon nudge={-1} />
				<span>Settings</span>
			</div>
		</div>
	);
}

/* ─── 4. Text Truncation ─── */

export function TruncationA() {
	return (
		<div style={{ padding: 20, ...demoBox }}>
			<div
				style={{
					...font,
					border: `1px solid ${c.borderLight}`,
					padding: 16,
					maxWidth: 200,
					color: c.text,
					borderRadius: 8,
				}}
			>
				<div style={{ fontSize: 14, fontWeight: 600 }}>
					<span>Internatio</span>
					<span style={{ color: c.textMuted }}>...</span>
				</div>
				<div
					style={{
						fontSize: 12,
						color: c.textMuted,
						marginTop: 4,
					}}
				>
					3 min read
				</div>
			</div>
		</div>
	);
}

export function TruncationB() {
	return (
		<div style={{ padding: 20, ...demoBox }}>
			<div
				style={{
					...font,
					border: `1px solid ${c.borderLight}`,
					padding: 16,
					maxWidth: 200,
					color: c.text,
					borderRadius: 8,
				}}
			>
				<div
					style={{
						fontSize: 14,
						fontWeight: 600,
						overflow: "hidden",
						whiteSpace: "nowrap",
						textOverflow: "ellipsis",
						width: "100%",
					}}
				>
					International Design Systems
				</div>
				<div
					style={{
						fontSize: 12,
						color: c.textMuted,
						marginTop: 4,
					}}
				>
					3 min read
				</div>
			</div>
		</div>
	);
}

/* ─── 5. Empty State ─── */

export function EmptyStateA() {
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

export function EmptyStateB() {
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

/* ─── 6. Disabled Button ─── */

export function DisabledButtonA() {
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
						border: `2px solid ${c.text}`,
						background: "transparent",
						fontSize: 14,
						cursor: "pointer",
						color: c.text,
						borderRadius: 6,
					}}
				>
					Submit
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
					Nothing happened...?
				</div>
			</div>
		</div>
	);
}

export function DisabledButtonB() {
	return (
		<div style={{ ...center, ...demoBox }}>
			<div style={{ textAlign: "center" }}>
				<button
					disabled
					style={{
						...font,
						padding: "10px 32px",
						border: `2px solid ${c.borderLight}`,
						background: "transparent",
						fontSize: 14,
						cursor: "not-allowed",
						color: c.textMuted,
						borderRadius: 6,
					}}
				>
					Submit
				</button>
				<div
					style={{
						fontSize: 11,
						color: c.textMuted,
						marginTop: 8,
						minHeight: 16,
					}}
				>
					Fill in required fields first
				</div>
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
