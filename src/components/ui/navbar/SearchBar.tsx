"use client";

import React, { useState } from "react";
import { SearchIcon } from "../Icons";

/**
 * Search Bar (Kindle-style)
 * Search input with icon
 */

interface SearchBarProps {
	placeholder?: string;
	onSearch?: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
	placeholder = "Search Rene's Kindle",
	onSearch,
}) => {
	const [query, setQuery] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSearch?.(query);
	};

	return (
		<form onSubmit={handleSubmit} className="flex-1 mx-2">
			<div className="relative">
				<SearchIcon
					size={16}
					className="absolute left-3 top-1/2 -translate-y-1/2 hidden md:block"
				/>
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder={placeholder}
					className="
            w-full pl-10 md:pl-9 pr-4 py-2 md:py-1.5 text-base md:text-sm font-sans
            border-2 md:border
            rounded-full
            focus:outline-none
            transition-colors duration-150
            placeholder-(--eink-ink)
            bg-(--eink-paper)
            border-(--eink-ink)
            text-(--eink-ink)
          "
				/>
			</div>
		</form>
	);
};
