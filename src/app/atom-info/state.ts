let lastSelectedAtom: string | null = null;

export function getLastSelectedAtom(): string | null {
  return lastSelectedAtom;
}

export function setLastSelectedAtom(symbol: string | null): void {
  lastSelectedAtom = symbol;
}
