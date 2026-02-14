import { SectionCards } from "@/components/dashboard_component/SectionCards" 
import { ChartComponent } from "@/components/dashboard_component/ChartComponent"

export default function DashboardHome() {
  return (
    <div className="bg-muted/40 min-h-[100vh] flex-1 rounded-xl md:min-h-min py-6">
      <SectionCards />
      <div className="mt-6 px-4 sm:px-6 lg:px-8">
        <ChartComponent />
      </div>
    </div>
  );
}