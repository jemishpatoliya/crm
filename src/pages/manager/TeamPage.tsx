import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Users, Search, Plus, MoreHorizontal, TrendingUp } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { KPICard } from "@/components/cards/KPICard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { agents, projects } from "@/data/mockData";
import { toast } from "sonner";

export const ManagerTeamPage = () => {
  const { sidebarCollapsed } = useOutletContext<{ sidebarCollapsed: boolean }>();
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", phone: "", role: "Agent", project: "" });

  const filteredAgents = agents.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase()));

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) { toast.error("Please fill required fields"); return; }
    toast.success(`${newUser.name} added as ${newUser.role}`);
    setIsAddOpen(false);
    setNewUser({ name: "", email: "", phone: "", role: "Agent", project: "" });
  };

  return (
    <PageWrapper title="Team Management" description="Manage your sales team and agents." sidebarCollapsed={sidebarCollapsed}
      actions={<Button size="sm" onClick={() => setIsAddOpen(true)}><Plus className="w-4 h-4 mr-2" />Add User</Button>}>
      
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <KPICard title="Total Team" value={agents.length} icon={Users} delay={0} />
        <KPICard title="Active Agents" value={agents.filter(a => a.status === 'Active').length} icon={Users} iconColor="text-success" delay={0.1} />
        <KPICard title="Total Conversions" value={agents.reduce((s, a) => s + a.conversions, 0)} icon={TrendingUp} iconColor="text-info" delay={0.2} />
        <KPICard title="Team Revenue" value="₹17.8Cr" icon={TrendingUp} delay={0.3} />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search team members..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAgents.map((agent) => (
          <Card key={agent.id} className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-primary">{agent.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <h4 className="font-semibold">{agent.name}</h4>
                  <p className="text-sm text-muted-foreground">{agent.role}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Assign Leads</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Leads</span>
                <span className="font-medium">{agent.totalLeads}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Conversions</span>
                <span className="font-medium">{agent.conversions}</span>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Conversion Rate</span>
                  <span className="font-medium">{((agent.conversions / agent.totalLeads) * 100).toFixed(0)}%</span>
                </div>
                <Progress value={(agent.conversions / agent.totalLeads) * 100} className="h-2" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Revenue</span>
                <span className="font-medium text-primary">{agent.revenue}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm">Status</span>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked={agent.status === 'Active'} />
                  <Badge variant={agent.status === 'Active' ? 'default' : 'secondary'}>{agent.status}</Badge>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Team Member</DialogTitle><DialogDescription>Add a new user to your team.</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Full Name *</Label><Input placeholder="John Doe" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} /></div>
            <div className="space-y-2"><Label>Email *</Label><Input type="email" placeholder="john@company.com" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} /></div>
            <div className="space-y-2"><Label>Phone</Label><Input placeholder="+91 98765 43210" value={newUser.phone} onChange={(e) => setNewUser({...newUser, phone: e.target.value})} /></div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={newUser.role} onValueChange={(v) => setNewUser({...newUser, role: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Agent">Agent</SelectItem>
                  <SelectItem value="Senior Agent">Senior Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Assign to Project</Label>
              <Select value={newUser.project} onValueChange={(v) => setNewUser({...newUser, project: v})}>
                <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                <SelectContent>{projects.filter(p => p.status === 'Active').map(p => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
};
