import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const images = [
  { file: 'Microsoft teams logo.png', path: 'teams-logo.png' },
  { file: 'Outlook calendar.png', path: 'outlook-calendar.png' },
  { file: 'Google meet logo.png', path: 'google-meet-logo.png' },
  { file: 'Google calendar.png', path: 'google-calendar.png' }
];

async function uploadImages() {
  console.log('Starting upload of integration logos...\n');

  for (const image of images) {
    try {
      const filePath = resolve(process.cwd(), 'public', image.file);
      const fileBuffer = readFileSync(filePath);

      const { data, error } = await supabase.storage
        .from('integration-logos')
        .upload(image.path, fileBuffer, {
          contentType: 'image/png',
          upsert: true
        });

      if (error) {
        console.error(`Error uploading ${image.file}:`, error.message);
      } else {
        console.log(`✓ Uploaded ${image.file} as ${image.path}`);

        const { data: publicUrlData } = supabase.storage
          .from('integration-logos')
          .getPublicUrl(image.path);

        console.log(`  Public URL: ${publicUrlData.publicUrl}\n`);
      }
    } catch (err) {
      console.error(`Failed to process ${image.file}:`, err);
    }
  }

  console.log('Upload complete!');
}

uploadImages();
