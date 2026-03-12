"use client";

import React from "react";

/**
 * Kindle-style Navigation Components
 * Main navbar container and re-exports of all navbar components
 */

// Re-export all navbar components
export { StatuBar } from "./navbar/StatusBar";
export { ControlCenter } from "./navbar/ControlCenter";
export {
  ActionBar,
  ActionGroup,
  ActionBarSpace,
  ActionItem,
} from "./navbar/ActionBar";
export { SearchBar } from "./navbar/SearchBar";
export { ActionBarMenu } from "./navbar/ActionBarMenu";
export {
  AirplaneModeIcon,
  BluetoothIcon,
  SyncIcon,
  SettingsIcon,
  DarkModeIcon,
  ChevronDownIcon,
} from "./navbar/StatusBarIcons";

// ============================================
// Navbar Container
// ============================================

interface NavbarProps {
  children: React.ReactNode;
  fixed?: boolean;
  autoClose?: boolean;
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  children,
  fixed = false,
  autoClose = false,
  className = "",
}) => {

  const navStyle: React.CSSProperties = {
    backgroundColor: "var(--eink-paper)",
    borderColor: "var(--eink-divider)",
    ...(fixed
      ? {
          position: "sticky",
          top: 0,
          zIndex: 40,
        }
      : {}),
  };

  return (
    <nav className={`${className}`} style={navStyle}>
      {children}
    </nav>
  );
};
