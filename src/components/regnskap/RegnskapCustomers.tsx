/**
 * Byråene som bruker Notably i dag. To logoer står sterkere alene enn i den
 * generelle rullende raden, der de ville druknet blant kunder fra andre bransjer.
 * Gode tall-logoen er hvit i originalen; filen i public er omfarget til mørk tekst.
 */
const customers = [
  { name: 'Økonomihuset', src: '/logos/kunder/oh.svg', height: 'h-8 sm:h-9' },
  { name: 'Gode tall AS', src: '/logos/kunder/gode-tall.webp', height: 'h-7 sm:h-8' },
];

export default function RegnskapCustomers() {
  return (
    <section className="page-container relative z-10 bg-white pb-6 pt-4 sm:pb-8">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-10">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 sm:text-sm">
          Brukt av regnskapsbyråer som
        </p>
        <ul className="flex items-center gap-10 sm:gap-12">
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
