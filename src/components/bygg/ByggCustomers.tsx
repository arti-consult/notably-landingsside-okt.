/**
 * Byggfirmaene som bruker Notably i dag. BV Bygg er også kunde, men har ingen logo.
 * Åsane Tekniske Gruppe-logoen er hvit i originalen; filen i public er omfarget
 * til mørk tekst. Rett Bygg er beskåret, originalen har tom luft under skiltet.
 */
const customers = [
  { name: 'Helgesen Tekniske Bygg', src: '/logos/kunder/htb.webp', height: 'h-9 sm:h-11' },
  { name: 'Tor Entreprenør AS', src: '/logos/kunder/tor-entreprenor.webp', height: 'h-9 sm:h-11' },
  { name: 'Åsane Tekniske Gruppe AS', src: '/logos/kunder/asane-tekniske.webp', height: 'h-9 sm:h-11' },
  { name: 'Rett Bygg AS', src: '/logos/kunder/rett-bygg.webp', height: 'h-8 sm:h-9' },
  { name: 'Alt installasjon AS', src: '/logos/kunder/alt-installasjon.webp', height: 'h-9 sm:h-11' },
];

export default function ByggCustomers() {
  return (
    <section className="page-container relative z-10 bg-white pb-6 pt-4 sm:pb-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 sm:text-sm">
          Brukt av byggfirma som
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-12">
          {customers.map(({ name, src, height }) => (
            <li key={name}>
              <img src={src} alt={name} decoding="async" className={`${height} w-auto opacity-90`} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
