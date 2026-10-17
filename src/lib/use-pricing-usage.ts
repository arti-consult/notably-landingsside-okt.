import { useEffect, useRef } from 'react';
import { observePricingView, type UsagePage } from './usage-events.ts';

export function usePricingUsage(page: UsagePage) {
  const section = useRef<HTMLElement>(null);
  const state = useRef({ recorded: false });
  useEffect(() => {
    // A short heading works even when the whole pricing section is much taller
    // than a mobile viewport.
    const heading = section.current?.querySelector('h2');
    if (heading) return observePricingView(heading, page, state.current);
  }, [page]);
  return section;
}
