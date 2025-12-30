import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Search, Shield, Briefcase, UserCheck } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockUsers } from "@/data/mockAuth";

const roleIcons = { SUPER_ADMIN: Shield, ADMIN: Briefcase, MANAGER: UserCheck, AGENT: Users, CUSTOMER: Users };

export const GlobalUsersPage = () => {
  const { sidebarCollapsed } = useOutletContext<{ sidebarCollapsed: boolean }>();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredUsers = mockUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <PageWrapper title="Global Users" description="All users across all tenants." sidebarCollapsed={sidebarCollapsed}>
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search users..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Filter by role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="MANAGER">Manager</SelectItem>
            <SelectItem value="AGENT">Agent</SelectItem>
            <SelectItem value="CUSTOMER">Customer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="table-container">
        <Table>
          <TableHeader>
            <TableRow className="bg-table-header hover:bg-table-header">
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => {
              const Icon = roleIcons[user.role] || Users;
              return (
                <TableRow key={user.id} className="hover:bg-table-row-hover">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">{user.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1"><Icon className="w-3 h-3" />{user.role.replace('_', ' ')}</Badge>
                  </TableCell>
                  <TableCell>{user.tenantName || "Platform"}</TableCell>
                  <TableCell><span className="status-badge status-available">Active</span></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </motion.div>
    </PageWrapper>
  );
};
