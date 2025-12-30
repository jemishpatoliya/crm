import { motion } from "framer-motion";
import { MoreHorizontal, Eye, Edit, Trash2, Phone, Mail } from "lucide-react";
import { leads } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const getStatusStyle = (status: string) => {
  const styles: Record<string, string> = {
    New: "status-new",
    Contacted: "status-contacted",
    Qualified: "status-qualified",
    Negotiation: "status-booked",
    Won: "status-available",
    Lost: "status-lost",
  };
  return styles[status] || "";
};

interface LeadsTableProps {
  limit?: number;
  showActions?: boolean;
}

export const LeadsTable = ({ limit, showActions = true }: LeadsTableProps) => {
  const displayLeads = limit ? leads.slice(0, limit) : leads;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="table-container"
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-table-header hover:bg-table-header">
            <TableHead className="font-semibold">Lead</TableHead>
            <TableHead className="font-semibold">Project</TableHead>
            <TableHead className="font-semibold">Budget</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Assigned To</TableHead>
            <TableHead className="font-semibold">Source</TableHead>
            {showActions && <TableHead className="font-semibold text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayLeads.map((lead, index) => (
            <motion.tr
              key={lead.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="hover:bg-table-row-hover transition-colors"
            >
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">{lead.name}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{lead.phone}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{lead.project}</TableCell>
              <TableCell className="text-muted-foreground">{lead.budget}</TableCell>
              <TableCell>
                <span className={cn("status-badge", getStatusStyle(lead.status))}>
                  {lead.status}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">{lead.assignedTo}</TableCell>
              <TableCell>
                <Badge variant="outline" className="font-normal">
                  {lead.source}
                </Badge>
              </TableCell>
              {showActions && (
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Lead
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
};
