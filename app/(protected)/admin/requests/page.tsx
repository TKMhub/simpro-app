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

export default async function AdminRequestsPage() {
  const requests = await prisma.developmentRequest.findMany({
    include: {
      user: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Development Requests</h1>
      <div className="border rounded-lg bg-white dark:bg-gray-900">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req.id}>
                <TableCell>{req.user.displayName || req.user.email}</TableCell>
                <TableCell>{req.type}</TableCell>
                <TableCell>{req.budget}</TableCell>
                <TableCell>{req.deadline}</TableCell>
                <TableCell>
                  <Badge variant={req.status === "PENDING" ? "destructive" : "outline"}>
                    {req.status}
                  </Badge>
                </TableCell>
                <TableCell>{req.createdAt.toLocaleDateString()}</TableCell>
                <TableCell>
                  <Link href={`/admin/requests/${req.id}`} className="text-blue-600 hover:underline">
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

