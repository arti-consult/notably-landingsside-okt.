import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const integrations = [
  {
    name: 'Microsoft Teams',
    src: 'https://qelklrrxciwomrwunzjo.supabase.co/storage/v1/object/public/admin-images/1762605154714.svg',
  },
  {
    name: 'Outlook Calendar',
    src: 'https://qelklrrxciwomrwunzjo.supabase.co/storage/v1/object/public/admin-images/1762605170864.svg',
  },
  {
    name: 'Google Meet',
    src: 'https://qelklrrxciwomrwunzjo.supabase.co/storage/v1/object/public/admin-images/1762605184963.svg',
  },
  {
    name: 'Google Calendar',
    src: 'https://qelklrrxciwomrwunzjo.supabase.co/storage/v1/object/public/admin-images/1762605201664.svg',
  },
];

/** Hvor lenge én puls bruker fra app til Notably. */
const PULSE_SECONDS = 3;

const IntegrationsFlow = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sourceRefs = useRef<Array<HTMLDivElement | null>>([]);
  const targetRef = useRef<HTMLDivElement>(null);

  const [paths, setPaths] = useState<string[]>([]);
  const [box, setBox] = useState({ w: 0, h: 0 });

  /**
   * Geometrien måles fra DOM i stedet for å hardkodes. Den forrige versjonen
   * tegnet linjer på faste x-posisjoner i en 800×160-viewBox, som bare stemte
   * når kortene lå fire på rad – på mobil pekte de i løse lufta.
   */
  const measure = useCallback(() => {
    const container = containerRef.current;
    const target = targetRef.current;
    if (!container || !target) return;

    const cb = container.getBoundingClientRect();
    if (cb.width === 0) return;

    const tb = target.getBoundingClientRect();
    const tcx = tb.left + tb.width / 2 - cb.left;
    const ty = tb.top - cb.top;

    // Kurvene lander ikke i samme punkt. Sprer vi ankomstene litt utover
    // toppkanten, slutter de å flette seg sammen den siste biten, og det leser
    // som sideelver som møtes framfor én tett knute.
    const spread = Math.min(tb.width * 0.17, 22);
    const mid = (sourceRefs.current.length - 1) / 2;

    const next = sourceRefs.current.map((node, index) => {
      if (!node) return '';
      const nb = node.getBoundingClientRect();
      const sx = nb.left + nb.width / 2 - cb.left;
      const sy = nb.bottom - cb.top;
      const tx = tcx + (index - mid) * spread;
      const dy = ty - sy;

      // Kubisk Bézier med rent vertikale kontrollpunkter: kurven forlater
      // kortet rett nedover og ankommer Notably rett nedover, så det aldri
      // oppstår et hjørne. Jo lengre fallet er, jo mykere blir svingen.
      const bend = Math.max(dy * 0.55, 28);
      return `M ${sx} ${sy} C ${sx} ${sy + bend}, ${tx} ${ty - bend}, ${tx} ${ty}`;
    });

    setPaths(next);
    setBox({ w: cb.width, h: cb.height });
  }, []);

  useLayoutEffect(() => {
    measure();

    const container = containerRef.current;
    const observer = new ResizeObserver(measure);
    if (container) observer.observe(container);
    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  // Logoene og «Notably»-etiketten flytter på seg når bilder og font er lastet.
  useEffect(() => {
    let cancelled = false;
    const remeasure = () => {
      if (!cancelled) measure();
    };
    document.fonts?.ready.then(remeasure);
    window.addEventListener('load', remeasure);
    return () => {
      cancelled = true;
      window.removeEventListener('load', remeasure);
    };
  }, [measure]);

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-4xl py-10 sm:py-14">
      {/* Koblingene ligger bak kortene */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={`0 0 ${box.w || 1} ${box.h || 1}`}
        fill="none"
        preserveAspectRatio="none"
      >
        {paths.map((d, index) =>
          d ? (
            <g key={index}>
              {/* Den permanente koblingen – alltid der, lav opasitet */}
              <path
                d={d}
                stroke="#2563eb"
                strokeOpacity="0.18"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Pulsen. pathLength=100 normaliserer lengden, så samme
                  dash-oppsett og tempo gjelder uansett hvor lang kurven er. */}
              <path
                className="notably-flow-pulse"
                style={{ animationDelay: `${(index * PULSE_SECONDS) / integrations.length}s` }}
                d={d}
                pathLength={100}
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="11 89"
              />
            </g>
          ) : null
        )}
      </svg>

      <div className="relative flex flex-col items-center">
        {/* Fire på rad i alle bredder. Da holder «mange kilder, ett sted»-bildet
            seg identisk, og kurvene vifter symmetrisk inn overalt. */}
        <div className="grid w-full grid-cols-4 gap-2 sm:gap-4 md:gap-6">
          {integrations.map(({ name, src }, index) => (
            <div
              key={name}
              ref={(node) => {
                sourceRefs.current[index] = node;
              }}
              className="integration-box"
            >
              <img
                src={src}
                alt={name}
                width={96}
                height={96}
                className="h-11 w-11 object-contain sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24"
                loading="lazy"
                decoding="async"
                onLoad={measure}
              />
            </div>
          ))}
        </div>

        <div className="h-28 sm:h-36 md:h-40" />

        <div ref={targetRef} className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-6 rounded-full bg-blue-500/20 blur-2xl"
          />
          <div className="integration-box integration-box-notably relative">
            <img
              src="/Notably logo icon.svg"
              alt="Notably"
              width={64}
              height={64}
              className="h-12 w-12 brightness-0 invert md:h-16 md:w-16"
              decoding="async"
              onLoad={measure}
            />
            <p className="mt-2 text-sm font-semibold text-white md:text-base">Notably</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsFlow;
