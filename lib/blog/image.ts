import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function resolveHeaderImageUrl(path: string) {
  const { data } = supabase.storage.from("blog").getPublicUrl(path);
  return data.publicUrl;
  // For signed URL:
  // const { data, error } = await supabase.storage.from('blog').createSignedUrl(path, 60 * 60);
  // if (error) throw error;
  // return data.signedUrl;
}

