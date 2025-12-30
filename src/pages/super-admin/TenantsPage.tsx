import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Search, Plus, MoreHorizontal } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/stores/appStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const TenantsPage = () => {
  const { sidebarCollapsed } = useOutletContext<{ sidebarCollapsed: boolean }>();
  const { tenants, addTenant, updateTenant, isLoading } = useAppStore();
  const [search, setSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTenant, setNewTenant] = useState({ name: "", email: "", domain: "", subscription: "Business" });

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddTenant = async () => {
    if (!newTenant.name || !newTenant.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    await addTenant({ name: newTenant.name, email: newTenant.email, projects: 0, users: 1, subscription: newTenant.subscription, status: "Active", revenue: "₹0" });
    toast.success(`Success — Tenant "${newTenant.name}" created`);
    setIsAddDialogOpen(false);
    setNewTenant({ name: "", email: "", domain: "", subscription: "Business" });
  };

  const handleSuspend = (id: number | string) => {
    updateTenant(id, { status: "Suspended" });
    toast.success("Tenant suspended");
  };

  return (
    <PageWrapper title="Tenants" description="Manage all builder companies on the platform." sidebarCollapsed={sidebarCollapsed}
      actions={<Button size="sm" onClick={() => setIsAddDialogOpen(true)}><Plus className="w-4 h-4 mr-2" />Add Tenant</Button>}>
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search tenants..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="table-container">
        <Table>
          <TableHeader>
            <TableRow className="bg-table-header hover:bg-table-header">
              <TableHead>Tenant</TableHead>
              <TableHead>Projects</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTenants.map((tenant) => (
              <TableRow key={tenant.id} className="hover:bg-table-row-hover">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{tenant.name}</p>
                      <p className="text-xs text-muted-foreground">{tenant.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{tenant.projects}</TableCell>
                <TableCell>{tenant.users}</TableCell>
                <TableCell><Badge variant="outline">{tenant.subscription}</Badge></TableCell>
                <TableCell className="font-medium">{tenant.revenue}</TableCell>
                <TableCell>
                  <span className={cn("status-badge", tenant.status === "Active" ? "status-available" : "status-lost")}>{tenant.status}</span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleSuspend(tenant.id)}>Suspend</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredTenants.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">No tenants yet. Create your first tenant to get started.</div>
        )}
      </motion.div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Tenant</DialogTitle>
            <DialogDescription>Create a new builder company tenant.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Company Name *</Label><Input placeholder="e.g., Prestige Group" value={newTenant.name} onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Admin Email *</Label><Input type="email" placeholder="admin@company.com" value={newTenant.email} onChange={(e) => setNewTenant({ ...newTenant, email: e.target.value })} /></div>
            <div className="space-y-2"><Label>Domain (optional)</Label><Input placeholder="company.com" value={newTenant.domain} onChange={(e) => setNewTenant({ ...newTenant, domain: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Subscription Plan</Label>
              <Select value={newTenant.subscription} onValueChange={(v) => setNewTenant({ ...newTenant, subscription: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Starter">Starter</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddTenant} disabled={isLoading}>{isLoading ? "Creating..." : "Create Tenant"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
};
