import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  MapPin,
  Building2,
  IndianRupee,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { mockApi } from "@/lib/mockApi";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  name: string;
  location: string;
  status: string;
  totalUnits: number;
  soldUnits: number;
  bookedUnits: number;
  availableUnits: number;
  priceRange: string;
  isClosed?: boolean;
}

const getStatusColor = (status: string, isClosed?: boolean) => {
  if (isClosed) return "bg-muted text-muted-foreground";
  const colors: Record<string, string> = {
    Active: "bg-success/10 text-success",
    Launching: "bg-info/10 text-info",
    Completed: "bg-muted text-muted-foreground",
    CLOSED: "bg-destructive/10 text-destructive",
  };
  return colors[status] || "";
};

export const ProjectsPage = () => {
  const { sidebarCollapsed } = useOutletContext<{ sidebarCollapsed: boolean }>();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const data = await mockApi.get<Project[]>("/projects");
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseProject = (project: Project) => {
    setSelectedProject(project);
    setCloseDialogOpen(true);
  };

  const confirmCloseProject = async () => {
    if (!selectedProject) return;
    
    setIsClosing(true);
    try {
      await mockApi.closeProject(selectedProject.id);
      toast({
        title: "Project Closed",
        description: `${selectedProject.name} has been closed. All units are now unavailable.`,
      });
      await loadProjects();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to close project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsClosing(false);
      setCloseDialogOpen(false);
      setSelectedProject(null);
    }
  };

  return (
    <PageWrapper
      title="Project Management"
      description="Manage all your real estate projects and developments."
      sidebarCollapsed={sidebarCollapsed}
      actions={
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      }
    >
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => {
            const soldPercentage = Math.round(
              (project.soldUnits / project.totalUnits) * 100
            );
            const bookedPercentage = Math.round(
              (project.bookedUnits / project.totalUnits) * 100
            );
            const isClosed = project.isClosed || project.status === 'CLOSED';

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className={cn(
                  "overflow-hidden hover:shadow-lg transition-shadow",
                  isClosed && "opacity-60"
                )}>
                  {/* Project Image Placeholder */}
                  <div className="h-40 bg-muted relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-muted-foreground/30" />
                    </div>
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Badge className={cn("font-medium", getStatusColor(project.status, isClosed))}>
                        {isClosed ? 'CLOSED' : project.status}
                      </Badge>
                    </div>
                    <div className="absolute top-3 left-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="bg-popover z-50">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled={isClosed}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Project
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {!isClosed && (
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleCloseProject(project)}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Close Project
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                      <MapPin className="w-3.5 h-3.5" />
                      {project.location}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center p-2 bg-muted/50 rounded-lg">
                        <p className="text-lg font-semibold text-foreground">
                          {project.totalUnits}
                        </p>
                        <p className="text-xs text-muted-foreground">Total</p>
                      </div>
                      <div className="text-center p-2 bg-success/5 rounded-lg">
                        <p className="text-lg font-semibold text-success">
                          {isClosed ? 0 : project.availableUnits}
                        </p>
                        <p className="text-xs text-muted-foreground">Available</p>
                      </div>
                      <div className="text-center p-2 bg-primary/5 rounded-lg">
                        <p className="text-lg font-semibold text-primary">
                          {project.soldUnits}
                        </p>
                        <p className="text-xs text-muted-foreground">Sold</p>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Sales Progress</span>
                        <span className="font-medium">
                          {soldPercentage + bookedPercentage}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${soldPercentage + bookedPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Price Range & Close Button */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <IndianRupee className="w-3.5 h-3.5" />
                        {project.priceRange}
                      </div>
                      {!isClosed && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCloseProject(project)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" />
                          Close
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Close Project Confirmation Dialog */}
      <Dialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Close Project
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to close <strong>{selectedProject?.name}</strong>? 
              This will mark all units as unavailable and prevent new bookings.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 my-4">
            <p className="text-sm text-warning-foreground">
              <strong>Warning:</strong> This action cannot be easily undone. 
              All {selectedProject?.availableUnits || 0} available units will be marked as closed.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCloseDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmCloseProject}
              disabled={isClosing}
            >
              {isClosing ? "Closing..." : "Confirm Close Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
};
