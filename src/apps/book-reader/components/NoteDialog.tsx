"use client";

import { useState, useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import { noteDialogAtom, articleHighlightsAtom } from "../atoms";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogAction,
} from "@/components/ui";
import { Button } from "@/components/ui";

export default function NoteDialog() {
  const [dialog, setDialog] = useAtom(noteDialogAtom);
  const [highlights, setHighlights] = useAtom(articleHighlightsAtom);
  const [note, setNote] = useState("");

  // Sync local state when dialog opens
  useEffect(() => {
    if (dialog.open) {
      setNote(dialog.initialNote);
    }
  }, [dialog.open, dialog.initialNote]);

  if (!dialog.open) return null;

  const highlight = highlights.find((h) => h.id === dialog.highlightId);
  const titleText = highlight
    ? highlight.text.length > 40
      ? highlight.text.slice(0, 40) + "..."
      : highlight.text
    : "";

  const handleSave = () => {
    if (dialog.highlightId) {
      setHighlights(
        highlights.map((h) =>
          h.id === dialog.highlightId
            ? { ...h, note: note.trim() || undefined, updatedAt: Date.now() }
            : h
        )
      );
    }
    setDialog({ open: false, highlightId: null, initialNote: "" });
  };

  const handleClose = () => {
    setDialog({ open: false, highlightId: null, initialNote: "" });
  };

  return (
    <Dialog open={dialog.open} onClose={handleClose}>
      <DialogTitle>{titleText}</DialogTitle>
      <DialogContent>
        <textarea
          className="w-full h-28 p-2 text-sm font-serif resize-none focus:outline-none"
          style={{
            backgroundColor: "var(--eink-paper-warm)",
            border: "1px solid var(--eink-border)",
            color: "var(--eink-ink)",
          }}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write a note..."
          autoFocus
        />
      </DialogContent>
      <DialogAction>
        <Button variant="outline" size="sm" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" size="sm" onClick={handleSave}>
          Save
        </Button>
      </DialogAction>
    </Dialog>
  );
}
