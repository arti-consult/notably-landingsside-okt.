import { useEffect, useState } from 'react';

/**
 * Følger en media query.
 *
 * Brukes til å skru av scroll-drevet parallakse under lg. På mobil er effekten
 * knapt synlig – utslaget er lite i forhold til skjermen, og man scroller fort
 * forbi – mens den koster full pris i arbeid på hovedtråden for hver
 * scroll-frame. På iOS blir hovedtråden nedprioritert under momentum-scroll,
 * og da oppleves bevegelsen hakkete.
 *
 * Starter som false, altså mobil-først. På desktop slås effekten på etter
 * første paint, noe som er uproblematisk siden den uansett først trer i kraft
 * når brukeren scroller.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const update = () => setMatches(mediaQuery.matches);

    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, [query]);

  return matches;
}
