import { ComponentUsageChart } from "@/components/pages/dashboard/component-usage-chart";
import { DashboardCards } from "@/components/pages/dashboard/dashboard-cards";
import { RecentIssues } from "@/components/pages/dashboard/recent-issues";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <DashboardCards />
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <ComponentUsageChart />
          <RecentIssues />
        </div>
      </main>
    </div>
  );
}
