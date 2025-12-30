import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  Download,
  MoreHorizontal,
} from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { KPICard } from "@/components/cards/KPICard";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { payments } from "@/data/mockData";
import { cn } from "@/lib/utils";

const getStatusStyle = (status: string) => {
  const styles: Record<string, string> = {
    Received: "status-available",
    Pending: "status-booked",
    Overdue: "status-lost",
  };
  return styles[status] || "";
};

export const FinancePage = () => {
  const { sidebarCollapsed } = useOutletContext<{ sidebarCollapsed: boolean }>();

  return (
    <PageWrapper
      title="Finance Management"
      description="Track payments, revenue, and financial analytics."
      sidebarCollapsed={sidebarCollapsed}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">Record Payment</Button>
        </div>
      }
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Total Revenue"
          value="₹485 Cr"
          change={18.5}
          changeLabel="vs last year"
          icon={IndianRupee}
          iconColor="text-success"
          delay={0}
        />
        <KPICard
          title="This Month"
          value="₹42.5 Cr"
          change={12.3}
          changeLabel="vs last month"
          icon={TrendingUp}
          iconColor="text-primary"
          delay={0.1}
        />
        <KPICard
          title="Pending"
          value="₹12.5 Cr"
          icon={Clock}
          iconColor="text-warning"
          delay={0.2}
        />
        <KPICard
          title="Overdue"
          value="₹3.2 Cr"
          change={-5}
          changeLabel="recovery"
          icon={AlertTriangle}
          iconColor="text-destructive"
          delay={0.3}
        />
      </div>

      {/* Revenue Chart */}
      <div className="mb-6">
        <RevenueChart />
      </div>

      {/* P&L Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="card-elevated p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Profit & Loss Summary
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Gross Revenue</span>
              <span className="font-semibold text-foreground">₹485 Cr</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Operating Costs</span>
              <span className="font-semibold text-foreground">₹125 Cr</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Marketing</span>
              <span className="font-semibold text-foreground">₹18 Cr</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Commissions</span>
              <span className="font-semibold text-foreground">₹24 Cr</span>
            </div>
            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">Net Profit</span>
                <span className="text-xl font-bold text-success">₹318 Cr</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="card-elevated p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Receivables Aging
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">0-30 Days</span>
                <span className="font-medium text-foreground">₹5.2 Cr</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-success w-3/4 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">31-60 Days</span>
                <span className="font-medium text-foreground">₹4.1 Cr</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-warning w-1/2 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">60+ Days</span>
                <span className="font-medium text-foreground">₹3.2 Cr</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-destructive w-1/4 rounded-full" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="card-elevated p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Project-wise Revenue
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Green Valley</span>
              <span className="font-semibold text-foreground">₹145 Cr</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Sky Heights</span>
              <span className="font-semibold text-foreground">₹128 Cr</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Palm Residency</span>
              <span className="font-semibold text-foreground">₹160 Cr</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Ocean View</span>
              <span className="font-semibold text-foreground">₹52 Cr</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Payments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
        className="table-container"
      >
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Recent Payments</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-table-header hover:bg-table-header">
              <TableHead className="font-semibold">Customer</TableHead>
              <TableHead className="font-semibold">Unit</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Amount</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment, index) => (
              <motion.tr
                key={payment.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="hover:bg-table-row-hover transition-colors"
              >
                <TableCell className="font-medium">{payment.customerName}</TableCell>
                <TableCell className="text-muted-foreground">{payment.unitNo}</TableCell>
                <TableCell className="text-muted-foreground">{payment.type}</TableCell>
                <TableCell className="font-medium">₹{payment.amount.toLocaleString()}</TableCell>
                <TableCell className="text-muted-foreground">{payment.date}</TableCell>
                <TableCell>
                  <span className={cn("status-badge", getStatusStyle(payment.status))}>
                    {payment.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                      <DropdownMenuItem>Download Receipt</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </PageWrapper>
  );
};
