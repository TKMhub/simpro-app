import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function AdminContactsPage() {
  const contacts = await prisma.contactThread.findMany({
    include: {
      user: true,
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Contacts</h1>
      <div className="border rounded-lg bg-white dark:bg-gray-900">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Subject/Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Message</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>{contact.user?.displayName || contact.user?.email || 'Unknown User'}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{contact.type}</span>
                    {contact.subject && <span className="text-sm text-gray-500 dark:text-gray-400">{contact.subject}</span>}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={contact.status === "OPEN" ? "default" : "secondary"}>
                    {contact.status}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {contact.messages[0]?.content}
                </TableCell>
                <TableCell>{contact.updatedAt.toLocaleDateString()}</TableCell>
                <TableCell>
                  <Link href={`/admin/contacts/${contact.id}`} className="text-blue-600 hover:underline">
                    View
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

