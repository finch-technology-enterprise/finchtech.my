import '@testing-library/jest-dom/vitest';

// jsdom does not implement sendBeacon. Without it, lib/analytics falls back to
// fetch(), which pollutes fetch assertions in component tests. Real browsers
// have it, so stubbing it keeps tests representative.
if (typeof navigator !== 'undefined' && !('sendBeacon' in navigator)) {
  Object.defineProperty(navigator, 'sendBeacon', {
    writable: true,
    configurable: true,
    value: () => true,
  });
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
  // Minimal stub for jsdom — satisfies motion whileInView without needing real viewport.
  const MockIntersectionObserver = class MockIntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin = '';
    readonly scrollMargin = '';
    readonly thresholds: ReadonlyArray<number> = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  } as unknown as typeof IntersectionObserver;
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });
  Object.defineProperty(globalThis, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });
}
