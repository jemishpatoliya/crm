import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin, Building2, Heart, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { projects } from "@/data/mockData";

export const CustomerProjectsPage = () => {
  const [search, setSearch] = useState("");

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/customer" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold">RealCRM Properties</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/customer/properties" className="text-sm text-muted-foreground hover:text-foreground">Properties</Link>
            <Link to="/customer/projects" className="text-sm font-medium text-primary">Projects</Link>
            <Link to="/customer/about" className="text-sm text-muted-foreground hover:text-foreground">About Us</Link>
            <Link to="/customer/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/customer/profile"><Button variant="ghost" size="icon"><Heart className="w-5 h-5" /></Button></Link>
            <Link to="/customer/auth"><Button size="sm">Sign In</Button></Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Our Projects</h1>
          <p className="text-muted-foreground">Explore premium developments from leading builders</p>
        </div>

        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search projects..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-muted relative flex items-center justify-center">
                  <Building2 className="w-16 h-16 text-muted-foreground/30" />
                  <Badge className={`absolute top-3 left-3 ${project.status === 'Active' ? 'bg-success/90' : project.status === 'Launching' ? 'bg-warning/90' : 'bg-muted'}`}>
                    {project.status}
                  </Badge>
                  <Button variant="ghost" size="icon" className="absolute top-3 right-3 bg-card/80"><Heart className="w-4 h-4" /></Button>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold mb-1">{project.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                    <MapPin className="w-3.5 h-3.5" />{project.location}
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Sold Progress</span>
                      <span className="font-medium">{Math.round((project.soldUnits / project.totalUnits) * 100)}%</span>
                    </div>
                    <Progress value={(project.soldUnits / project.totalUnits) * 100} className="h-2" />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center mb-4">
                    <div className="p-2 bg-muted rounded">
                      <p className="text-lg font-semibold text-success">{project.availableUnits}</p>
                      <p className="text-xs text-muted-foreground">Available</p>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <p className="text-lg font-semibold text-warning">{project.bookedUnits}</p>
                      <p className="text-xs text-muted-foreground">Booked</p>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <p className="text-lg font-semibold text-info">{project.soldUnits}</p>
                      <p className="text-xs text-muted-foreground">Sold</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Starting from</p>
                      <p className="text-lg font-semibold text-primary">{project.priceRange.split(' - ')[0]}</p>
                    </div>
                    <Button>View Details<ChevronRight className="w-4 h-4 ml-1" /></Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};
