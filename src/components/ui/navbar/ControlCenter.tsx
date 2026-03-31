"use client";

import React, { useState, useEffect, useContext } from "react";
import { createPortal } from "react-dom";
import { BatteryIcon } from "../Icons";
import { Minus, Plus } from "lucide-react";
import { useAtom, useSetAtom } from "jotai";
import {
  wirelessSettingsAtom,
  setAirplaneModeAtom,
  setWifiEnabledAtom,
  setBluetoothEnabledAtom,
  brightnessAtom,
} from "@/system/atoms/deviceSettings";
import { colorSchemeAtom } from "@/system/atoms/colorScheme";
import {
  AirplaneModeIcon,
  BluetoothIcon,
  SyncIcon,
  SettingsIcon,
  DarkModeIcon,
  ChevronDownIcon,
} from "./StatusBarIcons";
import { DialogPortalContext } from "@/system/contexts/dialogPortal";

/**
 * Control Center (Kindle-style)
 * A panel that slides down from the top with device controls
 */

interface ControlButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const ControlButton: React.FC<ControlButtonProps> = ({
  icon,
  label,
  active = false,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center"
    style={{
      color: active ? "var(--eink-paper)" : "var(--eink-ink)",
      backgroundColor: active ? "var(--eink-ink)" : "transparent",
      border: active ? "none" : "1.5px solid var(--eink-ink)",
      borderRadius: "50%",
      width: "52px",
      height: "52px",
    }}
  >
    {icon}
  </button>
);

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  deviceName: string;
  battery: number;
}

export const ControlCenter: React.FC<ControlCenterProps> = ({
  isOpen,
  onClose,
  deviceName,
  battery,
}) => {
  const [wireless] = useAtom(wirelessSettingsAtom);
  const setAirplaneMode = useSetAtom(setAirplaneModeAtom);
  const setWifiEnabled = useSetAtom(setWifiEnabledAtom);
  const setBluetoothEnabled = useSetAtom(setBluetoothEnabledAtom);
  const [brightness, setBrightness] = useAtom(brightnessAtom);
  const [colorScheme, setColorScheme] = useAtom(colorSchemeAtom);
  const [syncing, setSyncing] = useState(false);
  const [dateTime, setDateTime] = useState("");
  const portalContext = useContext(DialogPortalContext);

  const isDark = colorScheme === "dark";

  const handleSync = () => {
    if (syncing) return;
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  };

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      const date = now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      setDateTime(`${time} · ${date}`);
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const content = (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 z-50"
        style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
        onClick={onClose}
      />
      {/* Control Center panel */}
      <div
        className="fixed inset-x-0 top-0 z-50"
        style={{
          height: "auto",
          maxHeight: "50vh",
          backgroundColor: "var(--eink-paper)",
          borderBottom: "2px solid var(--eink-border)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}
      >
        {/* Header with device name and date */}
        <div
          className="px-4 pt-3 pb-2 border-b"
          style={{ borderColor: "var(--eink-divider)" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div
                className="text-base font-sans font-medium"
                style={{ color: "var(--eink-ink)" }}
              >
                {deviceName}
              </div>
              <div
                className="text-sm font-sans mt-0.5"
                style={{ color: "var(--eink-ink-secondary)" }}
              >
                {dateTime}
              </div>
            </div>
            <div
              className="flex items-center gap-1.5"
              style={{ color: "var(--eink-ink-secondary)" }}
            >
              <span className="text-sm font-sans">{battery}%</span>
              <BatteryIcon size={20} level={battery} />
            </div>
          </div>
        </div>

        {/* Control buttons grid */}
        <div className="p-4">
          <div className="flex justify-evenly">
            {/* Airplane Mode */}
            <div className="flex flex-col items-center gap-1">
              <ControlButton
                icon={
                  <AirplaneModeIcon size={22} filled={wireless.airplaneMode} />
                }
                label="Airplane"
                active={wireless.airplaneMode}
                onClick={() => setAirplaneMode(!wireless.airplaneMode)}
              />
              <span
                className="text-[10px] font-sans"
                style={{ color: "var(--eink-ink-secondary)" }}
              >
                {wireless.airplaneMode ? "On" : "Off"}
              </span>
            </div>

            {/* Bluetooth */}
            <div className="flex flex-col items-center gap-1">
              <ControlButton
                icon={
                  <BluetoothIcon size={22} filled={wireless.bluetoothEnabled} />
                }
                label="Bluetooth"
                active={wireless.bluetoothEnabled}
                onClick={() => setBluetoothEnabled(!wireless.bluetoothEnabled)}
              />
              <span
                className="text-[10px] font-sans"
                style={{ color: "var(--eink-ink-secondary)" }}
              >
                {wireless.bluetoothEnabled ? "On" : "Off"}
              </span>
            </div>

            {/* Dark Mode */}
            <div className="flex flex-col items-center gap-1">
              <ControlButton
                icon={<DarkModeIcon size={22} filled={isDark} />}
                label="Dark Mode"
                active={isDark}
                onClick={() => setColorScheme(isDark ? "light" : "dark")}
              />
              <span
                className="text-[10px] font-sans"
                style={{ color: "var(--eink-ink-secondary)" }}
              >
                {isDark ? "On" : "Off"}
              </span>
            </div>
          </div>

          <div className="flex justify-evenly mt-3">
            {/* Sync */}
            <div className="flex flex-col items-center gap-1">
              <ControlButton
                icon={
                  <span className={syncing ? "animate-spin" : ""} style={{ display: "inline-flex" }}>
                    <SyncIcon size={22} filled={syncing} />
                  </span>
                }
                label="Sync"
                active={syncing}
                onClick={handleSync}
              />
              <span
                className="text-[10px] font-sans"
                style={{ color: "var(--eink-ink-secondary)" }}
              >
                {syncing ? "Syncing..." : "Sync"}
              </span>
            </div>

            {/* All Settings */}
            <div className="flex flex-col items-center gap-1">
              <ControlButton
                icon={<SettingsIcon size={22} filled={false} />}
                label="All Settings"
                active={false}
              />
              <span
                className="text-[10px] font-sans"
                style={{ color: "var(--eink-ink-secondary)" }}
              >
                All Settings
              </span>
            </div>
          </div>
        </div>

        {/* Brightness slider */}
        <div className="px-4 pb-3">
          <div
            className="text-sm font-sans mb-2 cursor-pointer select-none"
            style={{ color: "var(--eink-ink)" }}
            onClick={() => setBrightness(10)}
          >
            Brightness
          </div>
          <div className="flex items-center gap-3">
            <Minus size={16} style={{ color: "var(--eink-ink-muted)" }} className="shrink-0" />
            <div className="flex-1 relative h-1.5 rounded-full" style={{ backgroundColor: "var(--eink-border)" }}>
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${(brightness / 24) * 100}%`,
                  backgroundColor: "var(--eink-ink)",
                }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                style={{
                  left: `${(brightness / 24) * 100}%`,
                  width: "14px",
                  height: "14px",
                  marginLeft: "-7px",
                  backgroundColor: "var(--eink-paper)",
                  border: "2px solid var(--eink-ink)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }}
              />
              <input
                type="range"
                min="0"
                max="24"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <Plus size={16} style={{ color: "var(--eink-ink-muted)" }} className="shrink-0" />
          </div>
        </div>

        {/* Close handle */}
        <div
          className="flex justify-center py-2 cursor-pointer"
          onClick={onClose}
        >
          <ChevronDownIcon
            size={20}
            className="rotate-180"
            style={{ color: "var(--eink-ink-muted)" }}
          />
        </div>
      </div>
    </>
  );

  // Use portal to render outside Navbar's stacking context
  if (portalContext?.portalRef?.current) {
    return createPortal(content, portalContext.portalRef.current);
  }

  // Fallback for when portal is not available
  return content;
};

