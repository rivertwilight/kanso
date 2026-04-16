import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { Highlight, SelectionPopupState, HighlightPopupState, NoteDialogState } from './types';

export const scrollPositionAtom = atom<number>(0);
export const tocVisibleAtom = atom<boolean>(false);
export const settingsOpenAtom = atom<boolean>(false);

// Current article slug — set by BookReaderApp on mount
export const currentSlugAtom = atom<string>('');

// All highlights across all articles, persisted in localStorage
export const allHighlightsAtom = atomWithStorage<Record<string, Highlight[]>>(
  'kindle-article-highlights',
  {}
);

// Derived atom scoped to the current article
export const articleHighlightsAtom = atom(
  (get) => {
    const slug = get(currentSlugAtom);
    const all = get(allHighlightsAtom);
    return all[slug] || [];
  },
  (get, set, highlights: Highlight[]) => {
    const slug = get(currentSlugAtom);
    const all = get(allHighlightsAtom);
    set(allHighlightsAtom, { ...all, [slug]: highlights });
  }
);

// UI state atoms
export const selectionPopupAtom = atom<SelectionPopupState>({
  visible: false, x: 0, y: 0, startOffset: 0, endOffset: 0, text: '',
});

export const highlightPopupAtom = atom<HighlightPopupState>({
  visible: false, x: 0, y: 0, highlightId: '',
});

export const noteDialogAtom = atom<NoteDialogState>({
  open: false, highlightId: null, initialNote: '',
});
