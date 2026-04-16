"use client";

import { useAtom, useSetAtom } from "jotai";
import {
  selectionPopupAtom,
  articleHighlightsAtom,
  noteDialogAtom,
} from "../atoms";
import type { Highlight } from "../types";

export default function SelectionPopup() {
  const [popup, setPopup] = useAtom(selectionPopupAtom);
  const [highlights, setHighlights] = useAtom(articleHighlightsAtom);
  const setNoteDialog = useSetAtom(noteDialogAtom);

  if (!popup.visible) return null;

  const createHighlight = (): Highlight => ({
    id: crypto.randomUUID(),
    startOffset: popup.startOffset,
    endOffset: popup.endOffset,
    text: popup.text,
    createdAt: Date.now(),
  });

  const mergeOverlapping = (newHl: Highlight): Highlight[] => {
    const overlapping = highlights.filter(
      (h) => h.startOffset < newHl.endOffset && h.endOffset > newHl.startOffset
    );
    if (overlapping.length === 0) return [...highlights, newHl];

    // Merge: expand range to cover all overlapping + new
    const allToMerge = [...overlapping, newHl];
    const mergedStart = Math.min(...allToMerge.map((h) => h.startOffset));
    const mergedEnd = Math.max(...allToMerge.map((h) => h.endOffset));

    // Build merged text from the section's textContent
    const section = document.querySelector('[itemprop="articleBody"]');
    const mergedText = section
      ? (section.textContent ?? "").slice(mergedStart, mergedEnd)
      : newHl.text;

    // Concatenate notes from overlapping highlights
    const notes = overlapping
      .map((h) => h.note)
      .filter(Boolean)
      .join("\n\n");

    const merged: Highlight = {
      id: newHl.id,
      startOffset: mergedStart,
      endOffset: mergedEnd,
      text: mergedText,
      note: notes || undefined,
      createdAt: Math.min(...allToMerge.map((h) => h.createdAt)),
    };

    const remaining = highlights.filter(
      (h) =>
        !(
          h.startOffset < newHl.endOffset && h.endOffset > newHl.startOffset
        )
    );
    return [...remaining, merged];
  };

  const handleHighlight = () => {
    const hl = createHighlight();
    setHighlights(mergeOverlapping(hl));
    setPopup({ ...popup, visible: false });
    window.getSelection()?.removeAllRanges();
  };

  const handleNote = () => {
    const hl = createHighlight();
    const newHighlights = mergeOverlapping(hl);
    setHighlights(newHighlights);
    setPopup({ ...popup, visible: false });
    window.getSelection()?.removeAllRanges();

    // Find the highlight we just created (it may have been merged)
    const created = newHighlights.find((h) => h.id === hl.id) ?? hl;
    setNoteDialog({
      open: true,
      highlightId: created.id,
      initialNote: created.note ?? "",
    });
  };

  return (
    <div
      data-selection-popup
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
        onClick={handleHighlight}
      >
        Highlight
      </button>
      <div
        className="w-px self-stretch"
        style={{ backgroundColor: "var(--eink-divider)" }}
      />
      <button
        className="px-5 py-2.5 text-base font-sans select-none active:bg-[var(--eink-ink)] active:text-[var(--eink-paper)]"
        style={{ color: "var(--eink-ink)" }}
        onClick={handleNote}
      >
        Note
      </button>
    </div>
  );
}
