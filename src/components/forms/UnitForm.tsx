import { useState, useEffect } from "react";
import { Home } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { mockApi } from "@/lib/mockApi";
import { projects as defaultProjects } from "@/data/mockData";

interface UnitFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const initialUnit = {
  unitNo: "",
  project: "",
  projectType: "Residential",
  tower: "",
  floor: 0,
  type: "",
  area: "",
  price: "",
  status: "Available",
  // Residential fields
  bedrooms: 0,
  bathrooms: 0,
  // Commercial fields
  carpetArea: "",
  builtUpArea: "",
  // Industrial fields
  plotSize: "",
  covered: false,
};

export const UnitForm = ({ open, onOpenChange, onSuccess }: UnitFormProps) => {
  const [unit, setUnit] = useState(initialUnit);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const stored = mockApi.getAll("projects");
    setProjects(stored.length > 0 ? stored : defaultProjects);
  }, [open]);

  const selectedProject = projects.find((p) => p.name === unit.project);
  const projectType = selectedProject?.mainType || "Residential";

  const handleSubmit = async () => {
    if (!unit.unitNo || !unit.project) {
      toast.error("Please fill in required fields");
      return;
    }

    setIsLoading(true);
    try {
      const unitData: any = {
        unitNo: unit.unitNo,
        project: unit.project,
        tower: unit.tower,
        floor: unit.floor,
        type: unit.type,
        area: unit.area,
        price: unit.price,
        status: unit.status,
      };

      // Add type-specific fields
      if (projectType === "Residential") {
        unitData.bedrooms = unit.bedrooms;
        unitData.bathrooms = unit.bathrooms;
        unitData.type = `${unit.bedrooms} BHK`;
      } else if (projectType === "Commercial") {
        unitData.carpetArea = unit.carpetArea;
        unitData.builtUpArea = unit.builtUpArea;
      } else if (projectType === "Industrial") {
        unitData.plotSize = unit.plotSize;
        unitData.covered = unit.covered;
      }

      await mockApi.post("/units", unitData);
      toast.success(`Unit "${unit.unitNo}" created successfully`);
      setUnit(initialUnit);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to create unit");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Home className="w-5 h-5 text-primary" />
            Add New Unit
          </DialogTitle>
          <DialogDescription>
            Create a new unit within a project.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unitNo">Unit Number *</Label>
              <Input
                id="unitNo"
                placeholder="e.g., A-101"
                value={unit.unitNo}
                onChange={(e) => setUnit({ ...unit, unitNo: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Project *</Label>
              <Select
                value={unit.project}
                onValueChange={(v) => setUnit({ ...unit, project: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.name}>
                      {p.name} ({p.mainType || "Residential"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tower">Tower/Block</Label>
              <Input
                id="tower"
                placeholder="e.g., Tower A"
                value={unit.tower}
                onChange={(e) => setUnit({ ...unit, tower: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="floor">Floor</Label>
              <Input
                id="floor"
                type="number"
                placeholder="0"
                value={unit.floor || ""}
                onChange={(e) => setUnit({ ...unit, floor: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          {/* Residential Fields */}
          {projectType === "Residential" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Select
                  value={unit.bedrooms.toString()}
                  onValueChange={(v) => setUnit({ ...unit, bedrooms: parseInt(v) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <SelectItem key={n} value={n.toString()}>
                        {n} BHK
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Select
                  value={unit.bathrooms.toString()}
                  onValueChange={(v) => setUnit({ ...unit, bathrooms: parseInt(v) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4].map((n) => (
                      <SelectItem key={n} value={n.toString()}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Commercial Fields */}
          {projectType === "Commercial" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="carpetArea">Carpet Area (sq.ft)</Label>
                <Input
                  id="carpetArea"
                  placeholder="e.g., 1200"
                  value={unit.carpetArea}
                  onChange={(e) => setUnit({ ...unit, carpetArea: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="builtUpArea">Built-up Area (sq.ft)</Label>
                <Input
                  id="builtUpArea"
                  placeholder="e.g., 1500"
                  value={unit.builtUpArea}
                  onChange={(e) => setUnit({ ...unit, builtUpArea: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Industrial Fields */}
          {projectType === "Industrial" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plotSize">Plot Size (sq.ft)</Label>
                <Input
                  id="plotSize"
                  placeholder="e.g., 5000"
                  value={unit.plotSize}
                  onChange={(e) => setUnit({ ...unit, plotSize: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Covered</Label>
                <Select
                  value={unit.covered ? "yes" : "no"}
                  onValueChange={(v) => setUnit({ ...unit, covered: v === "yes" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area">Total Area</Label>
              <Input
                id="area"
                placeholder="e.g., 1250 sq.ft"
                value={unit.area}
                onChange={(e) => setUnit({ ...unit, area: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                placeholder="e.g., ₹85L"
                value={unit.price}
                onChange={(e) => setUnit({ ...unit, price: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={unit.status}
              onValueChange={(v) => setUnit({ ...unit, status: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Booked">Booked</SelectItem>
                <SelectItem value="Hold">Hold</SelectItem>
                <SelectItem value="Sold">Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Unit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
