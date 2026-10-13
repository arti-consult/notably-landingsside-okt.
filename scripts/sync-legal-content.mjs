import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// The app dictionary is the shared source for the Norwegian legal copy.
// Usage: node scripts/sync-legal-content.mjs /path/to/notably-app-v2 [--check]
const args = process.argv.slice(2);
const appRepo = args.find((arg) => !arg.startsWith('--'));
if (!appRepo || args.some((arg) => arg.startsWith('--') && arg !== '--check')) {
  throw new Error('Usage: node scripts/sync-legal-content.mjs /path/to/notably-app-v2 [--check]');
}

const sourcePath = resolve(appRepo, 'apps/web/src/i18n/web-parity.no.json');
const targetPath = fileURLToPath(new URL('../src/content/legal.no.json', import.meta.url));
const { legal } = JSON.parse(await readFile(sourcePath, 'utf8'));
if (!legal?.common?.lastUpdated || !legal?.privacy?.sections || !legal?.terms?.sections) {
  throw new Error(`Missing legal copy in ${sourcePath}`);
}

const expected = `${JSON.stringify({
  common: legal.common,
  privacy: legal.privacy,
  terms: legal.terms,
}, null, 2)}\n`;

if (args.includes('--check')) {
  const actual = await readFile(targetPath, 'utf8');
  if (actual !== expected) {
    throw new Error('Website legal copy differs from the app. Run this command without --check to sync.');
  }
  console.log('Norwegian privacy policy, terms and shared legal copy match the app.');
} else {
  await writeFile(targetPath, expected);
  console.log(`Updated ${targetPath}`);
}
