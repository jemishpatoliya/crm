import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, Shield, UserPlus, Edit, Trash2, LogIn } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const auditLogs = [
  { id: 1, action: "Tenant Created", user: "Platform Admin", target: "Soundarya Group", time: "2024-01-15 10:30", icon: UserPlus, type: "create" },
  { id: 2, action: "User Login", user: "admin@prestige.test", target: "Admin Portal", time: "2024-01-15 09:45", icon: LogIn, type: "auth" },
  { id: 3, action: "Settings Updated", user: "Platform Admin", target: "Platform Config", time: "2024-01-14 16:20", icon: Edit, type: "update" },
  { id: 4, action: "Tenant Suspended", user: "Platform Admin", target: "Sobha Developers", time: "2024-01-14 14:10", icon: Shield, type: "security" },
  { id: 5, action: "User Deleted", user: "admin@dlf.test", target: "Agent - Rahul", time: "2024-01-13 11:30", icon: Trash2, type: "delete" },
];

const typeColors = { create: "text-success", auth: "text-info", update: "text-warning", security: "text-destructive", delete: "text-destructive" };

export const AuditLogsPage = () => {
  const { sidebarCollapsed } = useOutletContext<{ sidebarCollapsed: boolean }>();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(search.toLowerCase()) || log.user.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || log.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <PageWrapper title="Audit Logs" description="Track all platform activities and changes." sidebarCollapsed={sidebarCollapsed}>
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search logs..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Filter by type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="create">Create</SelectItem>
            <SelectItem value="update">Update</SelectItem>
            <SelectItem value="delete">Delete</SelectItem>
            <SelectItem value="auth">Auth</SelectItem>
            <SelectItem value="security">Security</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-2" />Export</Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
        {filteredLogs.map((log) => (
          <div key={log.id} className="card-elevated p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-muted ${typeColors[log.type as keyof typeof typeColors]}`}>
              <log.icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{log.action}</p>
              <p className="text-sm text-muted-foreground">by {log.user} → {log.target}</p>
            </div>
            <Badge variant="outline">{log.type}</Badge>
            <span className="text-sm text-muted-foreground">{log.time}</span>
          </div>
        ))}
      </motion.div>
    </PageWrapper>
  );
};
