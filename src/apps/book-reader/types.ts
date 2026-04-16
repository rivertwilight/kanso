export interface Highlight {
  id: string;
  startOffset: number;
  endOffset: number;
  text: string;
  note?: string;
  createdAt: number;
  updatedAt?: number;
}

export interface SelectionPopupState {
  visible: boolean;
  x: number;
  y: number;
  startOffset: number;
  endOffset: number;
  text: string;
}

export interface HighlightPopupState {
  visible: boolean;
  x: number;
  y: number;
  highlightId: string;
}

export interface NoteDialogState {
  open: boolean;
  highlightId: string | null;
  initialNote: string;
}
