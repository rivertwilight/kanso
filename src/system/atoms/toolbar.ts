import { atom } from 'jotai';
import type { ReactNode } from 'react';

export const customToolbarAtom = atom<ReactNode | null, [ReactNode | null], void>(
  null,
  (_get, set, value) => set(customToolbarAtom, value)
);
