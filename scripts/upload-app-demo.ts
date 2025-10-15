import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = 'https://0ec90b57d6e95fcbda19832f.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw';

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
