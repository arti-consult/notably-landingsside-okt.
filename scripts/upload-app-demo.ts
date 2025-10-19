import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.UPLOAD_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.UPLOAD_SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Set UPLOAD_SUPABASE_URL and UPLOAD_SUPABASE_KEY (or VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY).');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadAppDemo() {
  try {
    const bucketName = 'app-images';

    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);

    if (!bucketExists) {
      console.log('Creating app-images bucket...');
      const { error: bucketError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 10485760,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
      });

      if (bucketError) {
        console.error('Error creating bucket:', bucketError);
        return;
      }
      console.log('Bucket created successfully');
    }

    const imagePath = path.join(process.cwd(), 'public', 'Skjermbilde 2025-10-04 kl. 13.33.08.png');
    const imageBuffer = fs.readFileSync(imagePath);
    const fileName = 'app-demo-dashboard.png';

    console.log(`Uploading ${fileName}...`);
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, imageBuffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (error) {
      console.error('Error uploading file:', error);
      return;
    }

    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    console.log('Upload successful!');
    console.log('Public URL:', urlData.publicUrl);

  } catch (error) {
    console.error('Error:', error);
  }
}

uploadAppDemo();
