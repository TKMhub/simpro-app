import { getMyThreads } from "@/app/_actions/contact";
import ContactClient from "@/components/contact/ContactClient";
import { getCurrentProfile } from "@/app/_actions/user";

export default async function ContactPage() {
  const profile = await getCurrentProfile();
  
  let threads: any[] = [];
  if (profile) {
    try {
      threads = await getMyThreads();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Support</h1>
      <div className="min-h-[600px]">
        <ContactClient initialThreads={threads as any} userId={profile?.id ?? null} />
      </div>
    </div>
  );
}

