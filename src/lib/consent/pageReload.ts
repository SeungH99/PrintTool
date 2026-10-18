/** A full document reload stops Google runtime code that removing a script cannot stop. */
export function hardReload(): void {
  window.location.reload();
}
