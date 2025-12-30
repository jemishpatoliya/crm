import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Users,
  TrendingUp,
  Target,
  IndianRupee,
  Upload,
  Download,
  RefreshCw,
  Clock,
  Building2,
} from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { LeadFunnelChart } from "@/components/charts/LeadFunnelChart";
import { ProjectPerformanceChart } from "@/components/charts/ProjectPerformanceChart";
import { TopAgentsCard } from "@/components/cards/TopAgentsCard";
import { ActivityCard } from "@/components/cards/ActivityCard";
import { GoalsForm } from "@/components/forms/GoalsForm";
import { CsvImporter } from "@/components/csv/CsvImporter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardTabs, DashboardTab } from "@/components/dashboard/DashboardTabs";
import { LiveMetricsCard } from "@/components/dashboard/LiveMetricsCard";
import { SummaryKPICard } from "@/components/dashboard/SummaryKPICard";
import { useToast } from "@/hooks/use-toast";
import { mockApi } from "@/lib/mockApi";
import { useAppStore } from "@/stores/appStore";

const leadFields = ["name", "email", "phone", "status", "project", "budget"];
const leadFieldLabels: Record<string, string> = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  status: "Status",
  project: "Project",
  budget: "Budget",
};

export const ManagerDashboard = () => {
  const { sidebarCollapsed } = useOutletContext<{ sidebarCollapsed: boolean }>();
  const { toast } = useToast();
  const { addLeads, goals } = useAppStore();
  const [isTargetOpen, setIsTargetOpen] = useState(false);
  const [isCsvOpen, setIsCsvOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>('executive-summary');
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Load metrics
  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setIsLoading(true);
    try {
      const data = await mockApi.getDashboardMetrics();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to load metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadMetrics();
    setIsRefreshing(false);
    toast({
      title: "Metrics refreshed",
      description: "Dashboard data has been updated.",
    });
  };

  const handleDownloadSampleCSV = () => {
    mockApi.downloadSampleCSV('leads');
    toast({
      title: "Sample CSV Downloaded",
      description: "Check your downloads folder for the sample format file.",
    });
  };

  const handleImportLeads = (data: any[]) => {
    addLeads(data);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <PageWrapper
      title="Manager Dashboard"
      description="Track your team's performance and manage operations."
      sidebarCollapsed={sidebarCollapsed}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleDownloadSampleCSV}>
            <Download className="w-4 h-4 mr-2" />
            Download Sample CSV Format
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsCsvOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Import Leads
          </Button>
          <Button size="sm" onClick={() => setIsTargetOpen(true)}>
            <Target className="w-4 h-4 mr-2" />
            Set Targets
          </Button>
        </div>
      }
    >
      {/* Live Metrics Section */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Live Metrics</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatTime(currentTime)}
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-8 w-8"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <LiveMetricsCard
              title="Team Leads"
              value={metrics?.totalLeads || 0}
              subtitle="Assigned to your team"
              icon={Users}
              iconColor="text-primary"
              delay={0}
            />
            <LiveMetricsCard
              title="New Today"
              value={metrics?.newToday || 0}
              subtitle="Fresh prospects"
              icon={TrendingUp}
              iconColor="text-success"
              delay={0.1}
            />
            <LiveMetricsCard
              title="Active Leads"
              value={metrics?.activeLeads || 0}
              subtitle="Leads with recent activity"
              icon={Users}
              iconColor="text-info"
              delay={0.2}
            />
            <LiveMetricsCard
              title="Conversion Rate"
              value={`${metrics?.conversionRate || 0}%`}
              subtitle={`${metrics?.closedDeals || 0} closed deals`}
              icon={TrendingUp}
              iconColor="text-success"
              delay={0.3}
            />
            <LiveMetricsCard
              title="Target Progress"
              value={`${Math.round((metrics?.closedDeals || 0) / goals.conversionsTarget * 100)}%`}
              subtitle={`${metrics?.closedDeals || 0}/${goals.conversionsTarget} conversions`}
              icon={Target}
              iconColor="text-warning"
              delay={0.4}
            />
            <LiveMetricsCard
              title="Pending Tasks"
              value={metrics?.pendingTasks || 0}
              subtitle="0 completed today"
              badge={`${metrics?.overdueTasks || 0} overdue`}
              badgeType="warning"
              icon={Target}
              iconColor="text-destructive"
              delay={0.5}
            />
          </div>
        )}
      </div>

      {/* Dashboard Tabs */}
      <DashboardTabs activeTab={activeTab} onChange={setActiveTab} />

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))
        ) : (
          <>
            <SummaryKPICard
              title="Leads This Month"
              value={metrics?.leadsThisMonth || 0}
              subtitle="0.0% vs last month"
              icon={Users}
              bgColor="bg-blue-50 dark:bg-blue-950/30"
              delay={0}
            />
            <SummaryKPICard
              title="Conversion Rate"
              value={`${metrics?.conversionRate || 0}%`}
              subtitle="Industry avg: 2-5%"
              icon={Target}
              bgColor="bg-amber-50 dark:bg-amber-950/30"
              delay={0.1}
            />
            <SummaryKPICard
              title="Revenue This Month"
              value={formatCurrency(metrics?.revenueThisMonth || 0)}
              subtitle="0% vs last month"
              icon={IndianRupee}
              bgColor="bg-rose-50 dark:bg-rose-950/30"
              delay={0.2}
            />
            <SummaryKPICard
              title="Active Properties"
              value={metrics?.activeProperties || 0}
              subtitle="Ready to sell"
              icon={Building2}
              bgColor="bg-emerald-50 dark:bg-emerald-950/30"
              delay={0.3}
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <LeadFunnelChart />
        <ProjectPerformanceChart />
      </div>

      {/* Activity & Agents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopAgentsCard />
        <ActivityCard />
      </div>

      {/* Set Targets Modal */}
      <GoalsForm open={isTargetOpen} onOpenChange={setIsTargetOpen} />

      {/* CSV Importer */}
      <CsvImporter
        open={isCsvOpen}
        onOpenChange={setIsCsvOpen}
        onImport={handleImportLeads}
        requiredFields={leadFields}
        fieldLabels={leadFieldLabels}
      />
    </PageWrapper>
  );
};
