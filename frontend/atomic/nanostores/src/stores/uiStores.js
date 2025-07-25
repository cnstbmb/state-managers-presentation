import { atom } from 'nanostores';

export const loadingAtom = atom(false);
export const errorAtom = atom(null);
export const notificationAtom = atom(null);
