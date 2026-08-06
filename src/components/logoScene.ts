import {
  ACESFilmicToneMapping,
  DirectionalLight,
  Group,
  Mesh,
  PMREMGenerator,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/**
 * Scenen ligger i sin egen modul med navngitte importer, ikke som
 * `import * as THREE` inne i komponenten. Et namespace-objekt i en dynamisk
 * import hindrer Rollup i å tree-shake three, og chunken ble 180 KB gzip i
 * stedet for ~137 KB. Statiske navngitte importer her, og så én dynamisk
 * import av denne modulen, gir begge deler: lazy-lasting og tree-shaking.
 */
/** Radianer per sekund. 0,42 gir ca. 15 sekunder per omdreining. */
const SPIN_RATE = 0.42;

export type LogoScene = {
  dispose: () => void;
};

export async function mountLogoScene(
  host: HTMLElement,
  { reducedMotion }: { reducedMotion: boolean }
): Promise<LogoScene> {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;

  const canvas = renderer.domElement;
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  host.appendChild(canvas);

  const scene = new Scene();
  const camera = new PerspectiveCamera(34, 1, 0.1, 100);
  // Modellen er 3,85 enheter høy. På 8,2 ga det bare 0,58 enheters klaring
  // opp og ned, som er i knappeste laget når rotasjonen svinger den rundt.
  // 9,6 dobler margen til ~1,0 uten at logoen blir merkbart mindre.
  camera.position.set(0, 0, 9.6);

  // Glansen i materialet kommer herfra – modellen har ingen teksturer.
  const pmrem = new PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;

  const key = new DirectionalLight(0xffffff, 3.2);
  key.position.set(-4, 6, 7);
  scene.add(key);
  const rim = new DirectionalLight(0xa9c4ff, 2.1);
  rim.position.set(5, 1, -3);
  scene.add(rim);

  const resize = () => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);

  const gltf = await new GLTFLoader().loadAsync('/notably-logo-glossy.glb');
  const model: Group = gltf.scene;
  scene.add(model);

  let frame = 0;
  let running = false;
  const started = performance.now();

  const draw = (now: number) => {
    // Hvor langt elementet har kommet gjennom viewporten, 0 → 1.
    const rect = host.getBoundingClientRect();
    const progress = Math.min(
      1,
      Math.max(0, 1 - (rect.top + rect.height / 2) / (window.innerHeight || 1))
    );

    // Aksen vippes bevisst. Med en nesten rett akse kollapser silhuetten til en
    // ren strek i det logoen står på kant. Vippet gjør at du fortsatt ser
    // oversiden av ekstruderingen der, og den leses som et objekt hele veien.
    const targetX = 0.22 + Math.sin(progress * Math.PI) * 0.12;

    if (reducedMotion) {
      // Parkert i en vinkel der ekstruderingen synes, uten bevegelse.
      model.rotation.set(targetX, 0.4, 0);
    } else {
      // Kontinuerlig rotasjon, ca. 15 sekunder per omdreining.
      const spin = ((now - started) / 1000) * SPIN_RATE;

      // Farten moduleres i stedet for å begrense vinkelen: logoen bremser når
      // den vender flatsiden mot deg og haster gjennom profilen, der den bare
      // er en hvit strek. Amplituden må holdes under 0.5, ellers blir den
      // deriverte null og rotasjonen ser ut til å hakke. 0,42 gir ~4 % kant-tid
      // mot 28 % uten modulering.
      const eased = spin - Math.sin(spin * 2) * 0.42;

      // Scrollen forskyver fasen, så den fortsatt reagerer på brukeren.
      model.rotation.y = eased + progress * 0.5;
      model.rotation.x += (targetX - model.rotation.x) * 0.08;
    }

    renderer.render(scene, camera);
    if (running && !reducedMotion) frame = requestAnimationFrame(draw);
  };

  const setRunning = (next: boolean) => {
    if (next === running) return;
    running = next;
    if (running) frame = requestAnimationFrame(draw);
    else cancelAnimationFrame(frame);
  };

  // Løkka kjører bare mens logoen er synlig. Uten dette ville den tegnet hver
  // frame gjennom hele siden og tappet batteri uten at noen ser det.
  const visibility = new IntersectionObserver(
    ([entry]) => setRunning(entry.isIntersecting),
    { rootMargin: '120px 0px' }
  );
  visibility.observe(host);

  // Tegn ett bilde med en gang, så plassen ikke står tom før observeren melder.
  draw(performance.now());

  return {
    dispose: () => {
      running = false;
      cancelAnimationFrame(frame);
      visibility.disconnect();
      resizeObserver.disconnect();
      scene.traverse((object) => {
        const mesh = object as Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry?.dispose();
        const material = mesh.material;
        if (Array.isArray(material)) material.forEach((m) => m.dispose());
        else material?.dispose();
      });
      envRT.texture.dispose();
      pmrem.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}
