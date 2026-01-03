import { prisma } from "@/lib/db/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboard() {
  // Fetch stats
  const pendingContacts = await prisma.contactThread.count({
    where: { status: { not: "CLOSED" } }, // Assuming CLOSED is the final state
  });

  const pendingRequests = await prisma.developmentRequest.count({
    where: { status: "PENDING" },
  });

  const activeProjects = await prisma.developmentRequest.count({
    where: { status: "DEVELOPMENT" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Unresolved Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{pendingContacts}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{pendingRequests}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{activeProjects}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

