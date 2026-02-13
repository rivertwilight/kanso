"use client";

import React from "react";

const TableBlock = (props: React.TableHTMLAttributes<HTMLTableElement>) => {
	return (
		<div className="w-full overflow-x-auto mb-4">
			<table
				className="min-w-full border-collapse border border-(--eink-border)"
				{...props}
			>
				{props.children}
			</table>
		</div>
	);
};

export default TableBlock;
