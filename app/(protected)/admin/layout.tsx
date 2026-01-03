import { getCurrentProfile } from "@/app/_actions/user";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  if (!profile || (profile.role !== "SUPER_ADMIN" && profile.role !== "ADMIN")) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:block">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Admin</h2>
        </div>
        <nav className="px-4 space-y-2">
          <Link
            href="/admin"
            className="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/contacts"
            className="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Contacts
          </Link>
          <Link
            href="/admin/requests"
            className="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Requests
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}

