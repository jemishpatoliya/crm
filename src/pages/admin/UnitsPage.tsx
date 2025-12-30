import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Filter, Search, Home, CheckCircle, Clock, Ban, LayoutGrid, List } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { KPICard } from "@/components/cards/KPICard";
import { UnitsTable } from "@/components/tables/UnitsTable";
import { UnitForm } from "@/components/forms/UnitForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { units } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { getUnitDisplayType, getUnitArea, getUnitLocation, formatPrice, getStatusStyle, getStatusLabel } from "@/lib/unitHelpers";

export const UnitsPage = () => {
  const { sidebarCollapsed } = useOutletContext<{ sidebarCollapsed: boolean }>();
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [showUnitForm, setShowUnitForm] = useState(false);

  const unitStats = {
    total: units.length,
    available: units.filter((u) => u.status === "AVAILABLE").length,
    booked: units.filter((u) => u.status === "BOOKED").length,
    sold: units.filter((u) => u.status === "SOLD").length,
  };

  return (
    <PageWrapper
      title="Unit Management"
      description="Manage all property units across your projects."
      sidebarCollapsed={sidebarCollapsed}
      actions={
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg p-1">
            <Button variant={viewMode === "table" ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode("table")}>
              <List className="w-4 h-4" />
            </Button>
            <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </div>
          <Button size="sm" onClick={() => setShowUnitForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Unit
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard title="Total Units" value={unitStats.total} icon={Home} delay={0} />
        <KPICard title="Available" value={unitStats.available} icon={CheckCircle} iconColor="text-success" delay={0.1} />
        <KPICard title="Booked" value={unitStats.booked} icon={Clock} iconColor="text-warning" delay={0.2} />
        <KPICard title="Sold" value={unitStats.sold} icon={Ban} iconColor="text-muted-foreground" delay={0.3} />
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }} className="card-elevated p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by unit number..." className="pl-9" />
          </div>
          <Select>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Project" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="green-valley">Green Valley</SelectItem>
              <SelectItem value="sky-heights">Sky Heights</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="AVAILABLE">Available</SelectItem>
              <SelectItem value="BOOKED">Booked</SelectItem>
              <SelectItem value="SOLD">Sold</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button>
        </div>
      </motion.div>

      {viewMode === "table" ? (
        <UnitsTable />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {units.map((unit, index) => (
            <motion.div key={unit.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2, delay: index * 0.05 }}>
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">{unit.unitNo}</h4>
                    <p className="text-xs text-muted-foreground">{unit.project}</p>
                  </div>
                  <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getStatusStyle(unit.status))}>{getStatusLabel(unit.status)}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium">{getUnitDisplayType(unit)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Area</span><span className="font-medium">{getUnitArea(unit)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Location</span><span className="font-medium">{getUnitLocation(unit)}</span></div>
                </div>
                <div className="mt-4 pt-3 border-t border-border">
                  <p className="text-lg font-semibold text-primary">{formatPrice(unit.price)}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <UnitForm open={showUnitForm} onOpenChange={setShowUnitForm} />
    </PageWrapper>
  );
};
