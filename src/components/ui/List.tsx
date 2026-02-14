"use client";

import React from "react";

/**
 * Kindle-style List Components
 * Clean list styling that matches the E-ink aesthetic
 * Features color inversion on active/tap state like real Kindle
 */

interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  children: React.ReactNode;
}

export const List: React.FC<ListProps> = ({ className = "", children, ...props }) => {
  return (
    <ul
      className={`${className}`}
      style={{ borderColor: 'var(--eink-divider)' }}
      {...props}
    >
      {children}
    </ul>
  );
};

interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
}

export const ListItem: React.FC<ListItemProps> = ({
  className = "",
  children,
  style,
  ...props
}) => {
  return (
    <li
      className={`
        flex items-center justify-between
        py-3 px-2
        transition-colors duration-75
        cursor-pointer
        select-none
        border-b last:border-b-0
        bg-transparent text-(--eink-ink)
        active:bg-(--eink-ink) active:text-(--eink-paper)
        ${className}
      `}
      style={{
        borderColor: 'var(--eink-divider)',
        ...style
      }}
      {...props}
    >
      {children}
    </li>
  );
};

interface ListItemTextProps {
  primary: string;
  secondary?: string;
  allowWrap?: boolean;
  className?: string;
}

export const ListItemText: React.FC<ListItemTextProps> = ({
  primary,
  secondary,
  allowWrap = false,
  className = "",
}) => {
  return (
    <div className={`flex-1 min-w-0 ${className}`}>
      <p
        className={`
          text-base font-sans font-medium
          ${allowWrap ? "" : "truncate"}
        `}
        style={{ color: 'inherit' }}
      >
        {primary}
      </p>
      {secondary && (
        <p 
          className="text-sm mt-0.5 opacity-60"
          style={{ color: 'inherit' }}
        >
          {secondary}
        </p>
      )}
    </div>
  );
};

interface ListItemIconProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ListItemIcon: React.FC<ListItemIconProps> = ({
  className = "",
  children,
  onClick,
  ...props
}) => {
  return (
    <div
      className={`
        flex-shrink-0 ml-3
        p-1.5
        opacity-60
        transition-colors duration-75
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      style={{ color: 'inherit' }}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

