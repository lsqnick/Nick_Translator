import { useEffect } from 'react';

declare global {
  var frameworkReady: (() => void) | undefined;
}

export function useFrameworkReady() {
  useEffect(() => {
    globalThis.frameworkReady?.();
  }, []);
}
