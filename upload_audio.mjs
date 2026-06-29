import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function uploadAudio() {
  try {
    const filePath = path.join(process.cwd(), 'assets', 'The_Beginning.mp3.mp3');
    const fileBuffer = fs.readFileSync(filePath);

    console.log("Uploading file to Supabase...");
    const { data, error } = await supabase
      .storage
      .from('meditation-audio')
      .upload('The_Beginning.mp3', fileBuffer, {
        contentType: 'audio/mpeg',
        upsert: true
      });

    if (error) {
      console.error("Upload failed:", error.message);
      return;
    }

    console.log("Upload successful:", data);

    const { data: urlData } = supabase
      .storage
      .from('meditation-audio')
      .getPublicUrl('The_Beginning.mp3');

    console.log("Public URL:", urlData.publicUrl);
  } catch (err) {
    console.error("Error:", err);
  }
}

uploadAudio();
