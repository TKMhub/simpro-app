import { KozaSidebar } from "./(components)/koza-sidebar";

export default function KozaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-stone-50 font-sans text-stone-900">
      <KozaSidebar />
      <main className="flex-1 ml-64 overflow-y-auto">
        <div className="container mx-auto p-8 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}

