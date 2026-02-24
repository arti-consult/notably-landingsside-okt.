import { useEffect, useRef, useState, type ReactNode } from 'react';

type DeferredRenderProps = {
  children: ReactNode;
  rootMargin?: string;
  threshold?: number;
};

export default function DeferredRender({
  children,
  rootMargin = '1200px 0px',
  threshold = 0,
}: DeferredRenderProps) {
  const placeholderRef = useRef<HTMLDivElement | null>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (shouldRender) {
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
  }, [rootMargin, shouldRender, threshold]);

  if (shouldRender) {
    return <>{children}</>;
  }

  return <div ref={placeholderRef} aria-hidden className="h-px w-full" />;
}
