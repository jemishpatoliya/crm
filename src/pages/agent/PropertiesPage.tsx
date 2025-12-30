import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Building2, Search, MapPin, Home, Heart } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { projects, units } from "@/data/mockData";
import { getUnitDisplayType, getUnitArea, getUnitLocation, formatPrice, getStatusStyle } from "@/lib/unitHelpers";

export const AgentPropertiesPage = () => {
  const { sidebarCollapsed } = useOutletContext<{ sidebarCollapsed: boolean }>();
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    const matchesProject = projectFilter === "all" || p.name === projectFilter;
    return matchesSearch && matchesProject;
  });

  return (
    <PageWrapper title="Properties" description="Browse available properties to share with leads." sidebarCollapsed={sidebarCollapsed}>
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search properties..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={projectFilter} onValueChange={setProjectFilter}>
          <SelectTrigger className="w-48"><SelectValue placeholder="All Projects" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map(p => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <h3 className="text-lg font-semibold mb-4">Projects</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-40 bg-muted relative flex items-center justify-center">
              <Building2 className="w-12 h-12 text-muted-foreground/30" />
              <Badge className="absolute top-3 left-3">{project.status}</Badge>
            </div>
            <div className="p-5">
              <h4 className="font-semibold text-lg mb-1">{project.name}</h4>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                <MapPin className="w-3.5 h-3.5" />{project.location}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center mb-4">
                <div className="p-2 bg-muted rounded"><p className="text-lg font-semibold text-success">{project.availableUnits}</p><p className="text-xs text-muted-foreground">Available</p></div>
                <div className="p-2 bg-muted rounded"><p className="text-lg font-semibold text-warning">{project.bookedUnits}</p><p className="text-xs text-muted-foreground">Booked</p></div>
                <div className="p-2 bg-muted rounded"><p className="text-lg font-semibold text-info">{project.soldUnits}</p><p className="text-xs text-muted-foreground">Sold</p></div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Price Range: {project.priceRange}</p>
              <Button className="w-full">View Units</Button>
            </div>
          </Card>
        ))}
      </div>

      <h3 className="text-lg font-semibold mb-4">Available Units</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {units.filter(u => u.status === 'AVAILABLE').map((unit) => (
          <Card key={unit.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <Badge className="bg-success/10 text-success border-success/20">Available</Badge>
              <Button variant="ghost" size="icon" className="h-8 w-8"><Heart className="w-4 h-4" /></Button>
            </div>
            <h4 className="font-semibold">{unit.unitNo}</h4>
            <p className="text-sm text-muted-foreground mb-2">{unit.project}</p>
            <div className="space-y-1 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-2"><Home className="w-3.5 h-3.5" />{getUnitDisplayType(unit)} • {getUnitArea(unit)}</div>
              <div className="flex items-center gap-2"><Building2 className="w-3.5 h-3.5" />{getUnitLocation(unit)}</div>
            </div>
            <p className="text-lg font-semibold text-primary">{formatPrice(unit.price)}</p>
          </Card>
        ))}
      </div>
    </PageWrapper>
  );
};