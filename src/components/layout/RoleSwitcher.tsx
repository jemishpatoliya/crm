import { useNavigate } from "react-router-dom";
import { UserCog, Shield, Building2, Users, UserCheck, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/stores/appStore";
import { User as UserType } from "@/data/mockAuth";
import { toast } from "sonner";

const roleConfig: Record<UserType["role"], { label: string; icon: any; path: string; color: string }> = {
  SUPER_ADMIN: { label: "Super Admin", icon: Shield, path: "/super-admin", color: "text-red-500" },
  ADMIN: { label: "Admin", icon: Building2, path: "/admin", color: "text-blue-500" },
  MANAGER: { label: "Manager", icon: Users, path: "/manager", color: "text-purple-500" },
  AGENT: { label: "Agent", icon: UserCheck, path: "/agent", color: "text-green-500" },
  CUSTOMER: { label: "Customer", icon: User, path: "/customer", color: "text-orange-500" },
};

export const RoleSwitcher = () => {
  const navigate = useNavigate();
  const { currentUser, switchRole } = useAppStore();

  const handleSwitch = (role: UserType["role"]) => {
    switchRole(role);
    navigate(roleConfig[role].path);
    toast.success(`Switched to ${roleConfig[role].label} view`);
  };

  if (!currentUser) return null;

  const CurrentIcon = roleConfig[currentUser.role].icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <UserCog className="w-4 h-4" />
          <span className="hidden sm:inline">Demo Mode</span>
          <Badge variant="secondary" className="text-xs">
            {roleConfig[currentUser.role].label}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Switch Role (Demo)</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.keys(roleConfig) as UserType["role"][]).map((role) => {
          const config = roleConfig[role];
          const Icon = config.icon;
          const isActive = currentUser.role === role;
          return (
            <DropdownMenuItem
              key={role}
              onClick={() => handleSwitch(role)}
              className={isActive ? "bg-muted" : ""}
            >
              <Icon className={`w-4 h-4 mr-2 ${config.color}`} />
              <span>{config.label}</span>
              {isActive && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  Active
                </Badge>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
