import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { BarChart3, Download, Calendar } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LeadFunnelChart } from "@/components/charts/LeadFunnelChart";
import { ProjectPerformanceChart } from "@/components/charts/ProjectPerformanceChart";
import { agents } from "@/data/mockData";
import { Progress } from "@/components/ui/progress";

export const ManagerReportsPage = () => {
  const { sidebarCollapsed } = useOutletContext<{ sidebarCollapsed: boolean }>();
  const [reportType, setReportType] = useState("team");
  const [dateRange, setDateRange] = useState("30");

  return (
    <PageWrapper title="Reports" description="Team performance and sales reports." sidebarCollapsed={sidebarCollapsed}
      actions={<Button size="sm"><Download className="w-4 h-4 mr-2" />Export</Button>}>
      
      <div className="flex items-center gap-4 mb-6">
        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="team">Team Performance</SelectItem>
            <SelectItem value="leads">Lead Analysis</SelectItem>
            <SelectItem value="projects">Project Report</SelectItem>
          </SelectContent>
        </Select>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-40"><Calendar className="w-4 h-4 mr-2" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 Days</SelectItem>
            <SelectItem value="30">Last 30 Days</SelectItem>
            <SelectItem value="90">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {reportType === "team" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LeadFunnelChart />
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Agent Leaderboard</h3>
              <div className="space-y-4">
                {agents.sort((a, b) => b.conversions - a.conversions).map((agent, i) => (
                  <div key={agent.id} className="flex items-center gap-4">
                    <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{agent.name}</span>
                        <span className="text-sm text-muted-foreground">{agent.conversions} conversions</span>
                      </div>
                      <Progress value={(agent.conversions / 15) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Team Summary</h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-muted rounded-lg"><p className="text-2xl font-bold">{agents.reduce((s, a) => s + a.totalLeads, 0)}</p><p className="text-sm text-muted-foreground">Total Leads</p></div>
              <div className="p-4 bg-muted rounded-lg"><p className="text-2xl font-bold text-success">{agents.reduce((s, a) => s + a.conversions, 0)}</p><p className="text-sm text-muted-foreground">Conversions</p></div>
              <div className="p-4 bg-muted rounded-lg"><p className="text-2xl font-bold text-warning">21.5%</p><p className="text-sm text-muted-foreground">Avg. Conv. Rate</p></div>
              <div className="p-4 bg-muted rounded-lg"><p className="text-2xl font-bold text-primary">₹17.8Cr</p><p className="text-sm text-muted-foreground">Total Revenue</p></div>
            </div>
          </Card>
        </div>
      )}

      {reportType === "leads" && <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><LeadFunnelChart /><ProjectPerformanceChart /></div>}
      {reportType === "projects" && <div className="lg:col-span-2"><ProjectPerformanceChart /></div>}
    </PageWrapper>
  );
};
