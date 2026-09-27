import { useEffect, useRef, useState, type ReactNode } from 'react';

type DeferredRenderProps = {
  children: ReactNode;
  rootMargin?: string;
  threshold?: number;
  forceRender?: boolean;
};

export default function DeferredRender({
  children,
  rootMargin = '1200px 0px',
  threshold = 0,
  forceRender = false,
}: DeferredRenderProps) {
  const placeholderRef = useRef<HTMLDivElement | null>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (shouldRender || forceRender) {
      return;
    }

    const placeholder = placeholderRef.current;
    if (!placeholder) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(placeholder);
    return () => observer.disconnect();
  }, [forceRender, rootMargin, shouldRender, threshold]);

  if (shouldRender || forceRender) {
    return <>{children}</>;
  }

  return <div ref={placeholderRef} aria-hidden className="h-px w-full" />;
}
