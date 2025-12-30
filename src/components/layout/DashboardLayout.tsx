import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface DashboardLayoutProps {
  role: "super-admin" | "admin" | "manager" | "agent" | "customer";
}

export const DashboardLayout = ({ role }: DashboardLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        role={role}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <Topbar
        sidebarCollapsed={sidebarCollapsed}
        onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <Outlet context={{ sidebarCollapsed }} />
    </div>
  );
};
