import { Bell, Search, ChevronDown, Menu, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/stores/appStore";

interface TopbarProps {
  sidebarCollapsed: boolean;
  onMenuClick: () => void;
}

const notifications = [
  { id: 1, title: "New lead assigned", message: "Rajesh Kumar has been assigned to you", time: "5 min ago", unread: true },
  { id: 2, title: "Payment received", message: "₹45L received from Arjun Nair", time: "1 hour ago", unread: true },
  { id: 3, title: "Site visit scheduled", message: "Tomorrow at 10:00 AM - Green Valley", time: "2 hours ago", unread: false },
];

export const Topbar = ({ sidebarCollapsed, onMenuClick }: TopbarProps) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAppStore();
  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const userInitials = currentUser?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

  return (
    <motion.header
      initial={false}
      animate={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="fixed top-0 right-0 left-0 h-16 bg-card border-b border-border z-40 flex items-center justify-between px-6"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-muted-foreground" />
        </button>
        
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search leads, projects, units..."
            className="w-80 pl-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="hidden md:flex">
              Quick Actions
              <ChevronDown className="ml-2 w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => navigate("/admin/leads")}>
              Add New Lead
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/admin/units")}>
              Add New Unit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/admin/projects")}>
              Create Project
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/admin/reports")}>
              Generate Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              <Badge variant="secondary" className="text-xs">
                {unreadCount} new
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start gap-1 py-3 cursor-pointer"
              >
                <div className="flex items-center gap-2 w-full">
                  <span className="font-medium text-sm">{notification.title}</span>
                  {notification.unread && (
                    <span className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {notification.message}
                </span>
                <span className="text-xs text-muted-foreground/60">
                  {notification.time}
                </span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-primary">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary">{userInitials}</span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{currentUser?.name || "Guest"}</p>
                <p className="text-xs text-muted-foreground">{currentUser?.role || "Unknown"}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Help & Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
};
