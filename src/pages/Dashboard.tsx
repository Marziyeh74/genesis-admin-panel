import { Users, Database, Server, FileText } from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to your admin panel dashboard overview.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Users"
          value="2,854"
          description="↗︎ 12% from last month"
          icon={Users}
          trend="up"
        />
        <MetricCard
          title="Active Services"
          value="124"
          description="↘︎ 3% from last month"
          icon={Server}
          trend="down"
        />
        <MetricCard
          title="Database Connections"
          value="7"
          description="No change from last month"
          icon={Database}
          trend="neutral"
        />
        <MetricCard
          title="Files Managed"
          value="1,295"
          description="↗︎ 24% from last month"
          icon={FileText}
          trend="up"
        />
      </div>
      
      <div className="grid gap-4">
        <div>
          <div className="rounded-lg border p-6">
            <h3 className="text-lg font-medium">Recent Activity</h3>
            <div className="mt-3">
              <p className="text-muted-foreground">No recent activity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
