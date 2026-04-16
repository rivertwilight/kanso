"use client";

import { useAtom, useSetAtom, useAtomValue } from "jotai";
import {
  highlightPopupAtom,
  articleHighlightsAtom,
  noteDialogAtom,
} from "../atoms";

export default function HighlightPopup() {
  const [popup, setPopup] = useAtom(highlightPopupAtom);
  const [highlights, setHighlights] = useAtom(articleHighlightsAtom);
  const setNoteDialog = useSetAtom(noteDialogAtom);

  if (!popup.visible) return null;

  const highlight = highlights.find((h) => h.id === popup.highlightId);
  if (!highlight) return null;

  const handleNote = () => {
    setPopup({ ...popup, visible: false });
    setNoteDialog({
      open: true,
      highlightId: highlight.id,
      initialNote: highlight.note ?? "",
    });
  };

  const handleRemove = () => {
    setHighlights(highlights.filter((h) => h.id !== highlight.id));
    setPopup({ ...popup, visible: false });
  };

  return (
    <div
      data-highlight-popup
      className="absolute z-[100] flex items-center"
      style={{
        left: `${popup.x}px`,
        top: `${popup.y}px`,
        transform: "translateX(-50%)",
        backgroundColor: "var(--eink-paper)",
        border: "2px solid var(--eink-ink)",
      }}
    >
      <button
        className="px-5 py-2.5 text-base font-sans select-none active:bg-[var(--eink-ink)] active:text-[var(--eink-paper)]"
        style={{ color: "var(--eink-ink)" }}
        onClick={handleNote}
      >
        {highlight.note ? "Edit Note" : "Add Note"}
      </button>
      <div
        className="w-px self-stretch"
        style={{ backgroundColor: "var(--eink-divider)" }}
      />
      <button
        className="px-5 py-2.5 text-base font-sans select-none active:bg-[var(--eink-ink)] active:text-[var(--eink-paper)]"
        style={{ color: "var(--eink-ink)" }}
        onClick={handleRemove}
      >
        Remove
      </button>
    </div>
  );
}
