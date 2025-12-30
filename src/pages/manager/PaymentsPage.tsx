import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  IndianRupee, 
  Search, 
  Filter, 
  AlertCircle, 
  Bell, 
  Send, 
  Clock, 
  CheckCircle2, 
  MessageSquare,
  Mail,
  Phone,
  Play,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { KPICard } from "@/components/cards/KPICard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { mockApi } from "@/lib/mockApi";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/unitHelpers";

interface Payment {
  id: string;
  customerId: string;
  customerName?: string;
  unitId: string;
  amount: number;
  type: string;
  date: string;
  dueDate?: string;
  status: string;
  reminders?: Reminder[];
  nextReminderAt?: string;
}

interface Reminder {
  id: string;
  type: 'email' | 'sms' | 'whatsapp';
  message: string;
  scheduledAt: string;
  status: 'SENT' | 'SCHEDULED';
  sentAt?: string;
  createdAt: string;
}

export const ManagerPaymentsPage = () => {
  const { sidebarCollapsed } = useOutletContext<{ sidebarCollapsed: boolean }>();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [reminderType, setReminderType] = useState<'email' | 'sms' | 'whatsapp'>('email');
  const [reminderMessage, setReminderMessage] = useState("");
  const [sendNow, setSendNow] = useState(true);
  const [scheduledDate, setScheduledDate] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [expandedPayments, setExpandedPayments] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [paymentsData, unitsData] = await Promise.all([
        mockApi.get<Payment[]>("/payments"),
        mockApi.get<any[]>("/units"),
      ]);
      setPayments(paymentsData);
      setUnits(unitsData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUnitInfo = (unitId: string) => {
    const unit = units.find(u => u.id === unitId);
    return unit ? unit.unitNo : unitId;
  };

  const filteredPayments = payments.filter(p => {
    const unitNo = getUnitInfo(p.unitId);
    const matchesSearch = 
      (p.customerId || '').toLowerCase().includes(search.toLowerCase()) || 
      (p.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
      unitNo.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalReceived = payments.filter(p => p.status === 'Received').reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'Pending').reduce((s, p) => s + p.amount, 0);
  const totalOverdue = payments.filter(p => p.status === 'Overdue').reduce((s, p) => s + p.amount, 0);

  const handleSendReminder = (payment: Payment) => {
    setSelectedPayment(payment);
    setReminderMessage(`Dear Customer,\n\nThis is a reminder for your pending payment of ${formatPrice(payment.amount)} for unit ${getUnitInfo(payment.unitId)}.\n\nPlease complete the payment at your earliest convenience.\n\nThank you.`);
    setReminderDialogOpen(true);
  };

  const submitReminder = async () => {
    if (!selectedPayment) return;
    
    setIsSending(true);
    try {
      await mockApi.createPaymentReminder(selectedPayment.id, {
        type: reminderType,
        message: reminderMessage,
        sendNow: sendNow,
        scheduledAt: sendNow ? undefined : scheduledDate,
      });
      
      toast({
        title: sendNow ? "Reminder Sent" : "Reminder Scheduled",
        description: sendNow 
          ? `${reminderType.toUpperCase()} reminder sent successfully.`
          : `Reminder scheduled for ${new Date(scheduledDate).toLocaleString()}.`,
      });
      
      await loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reminder. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
      setReminderDialogOpen(false);
      setSelectedPayment(null);
    }
  };

  const handleRunScheduledReminders = async () => {
    try {
      const count = await mockApi.runScheduledReminders();
      toast({
        title: "Scheduled Reminders Processed",
        description: `${count} scheduled reminder(s) have been marked as sent.`,
      });
      await loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process reminders.",
        variant: "destructive",
      });
    }
  };

  const toggleExpanded = (paymentId: string) => {
    const newExpanded = new Set(expandedPayments);
    if (newExpanded.has(paymentId)) {
      newExpanded.delete(paymentId);
    } else {
      newExpanded.add(paymentId);
    }
    setExpandedPayments(newExpanded);
  };

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-3 h-3" />;
      case 'sms': return <Phone className="w-3 h-3" />;
      case 'whatsapp': return <MessageSquare className="w-3 h-3" />;
      default: return <Bell className="w-3 h-3" />;
    }
  };

  return (
    <PageWrapper 
      title="Payments" 
      description="Track and manage payment collections." 
      sidebarCollapsed={sidebarCollapsed}
      actions={
        <Button variant="outline" size="sm" onClick={handleRunScheduledReminders}>
          <Play className="w-4 h-4 mr-2" />
          Run Scheduled Reminders
        </Button>
      }
    >
      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <KPICard title="Total Received" value={formatPrice(totalReceived)} icon={IndianRupee} iconColor="text-success" delay={0} />
            <KPICard title="Pending" value={formatPrice(totalPending)} icon={IndianRupee} iconColor="text-warning" delay={0.1} />
            <KPICard title="Overdue" value={formatPrice(totalOverdue)} icon={AlertCircle} iconColor="text-destructive" delay={0.2} />
            <KPICard title="This Month" value="₹1.7Cr" icon={IndianRupee} change={12} changeLabel="vs last month" delay={0.3} />
          </div>

          {totalOverdue > 0 && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <div className="flex-1">
                <p className="text-sm font-medium">Overdue Payments Alert</p>
                <p className="text-xs text-muted-foreground">{formatPrice(totalOverdue)} in overdue collections need immediate attention</p>
              </div>
              <Button variant="outline" size="sm">View Overdue</Button>
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search payments..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Received">Received</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline"><Filter className="w-4 h-4 mr-2" />More Filters</Button>
          </div>

          <div className="table-container">
            <Table>
              <TableHeader>
                <TableRow className="bg-table-header hover:bg-table-header">
                  <TableHead className="w-8"></TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <Collapsible key={payment.id} asChild>
                    <>
                      <TableRow className="hover:bg-table-row-hover">
                        <TableCell>
                          {payment.reminders && payment.reminders.length > 0 && (
                            <CollapsibleTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6"
                                onClick={() => toggleExpanded(payment.id)}
                              >
                                {expandedPayments.has(payment.id) ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {payment.customerName || payment.customerId}
                        </TableCell>
                        <TableCell>{getUnitInfo(payment.unitId)}</TableCell>
                        <TableCell className="font-semibold">{formatPrice(payment.amount)}</TableCell>
                        <TableCell><Badge variant="outline">{payment.type}</Badge></TableCell>
                        <TableCell className="text-muted-foreground">{payment.date}</TableCell>
                        <TableCell>
                          <span className={cn("status-badge", 
                            payment.status === "Received" ? "status-available" : 
                            payment.status === "Pending" ? "status-booked" : "status-lost")}>
                            {payment.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {payment.status !== "Received" && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSendReminder(payment)}
                              className="gap-1"
                            >
                              <Bell className="w-3.5 h-3.5" />
                              Send Reminder
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                      {payment.reminders && payment.reminders.length > 0 && expandedPayments.has(payment.id) && (
                        <TableRow>
                          <TableCell colSpan={8} className="bg-muted/30 p-0">
                            <div className="p-4">
                              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Reminder History ({payment.reminders.length})
                              </h4>
                              <div className="space-y-2">
                                {payment.reminders.map((reminder) => (
                                  <div 
                                    key={reminder.id} 
                                    className="flex items-center gap-3 p-2 bg-background rounded-lg border text-sm"
                                  >
                                    <div className={cn(
                                      "p-1.5 rounded-full",
                                      reminder.status === 'SENT' ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                                    )}>
                                      {getReminderIcon(reminder.type)}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium capitalize">{reminder.type}</span>
                                        <Badge variant={reminder.status === 'SENT' ? 'default' : 'secondary'} className="text-xs">
                                          {reminder.status}
                                        </Badge>
                                      </div>
                                      <p className="text-xs text-muted-foreground line-clamp-1">
                                        {reminder.message}
                                      </p>
                                    </div>
                                    <div className="text-xs text-muted-foreground text-right">
                                      {reminder.status === 'SENT' ? (
                                        <>Sent: {new Date(reminder.sentAt!).toLocaleString()}</>
                                      ) : (
                                        <>Scheduled: {new Date(reminder.scheduledAt).toLocaleString()}</>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  </Collapsible>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {/* Send Reminder Dialog */}
      <Dialog open={reminderDialogOpen} onOpenChange={setReminderDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Send Payment Reminder
            </DialogTitle>
            <DialogDescription>
              Send a reminder to {selectedPayment?.customerName || selectedPayment?.customerId} for {formatPrice(selectedPayment?.amount || 0)}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Reminder Type</Label>
              <RadioGroup 
                value={reminderType} 
                onValueChange={(v) => setReminderType(v as 'email' | 'sms' | 'whatsapp')}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="email" />
                  <Label htmlFor="email" className="flex items-center gap-1 cursor-pointer">
                    <Mail className="w-4 h-4" /> Email
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sms" id="sms" />
                  <Label htmlFor="sms" className="flex items-center gap-1 cursor-pointer">
                    <Phone className="w-4 h-4" /> SMS
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="whatsapp" id="whatsapp" />
                  <Label htmlFor="whatsapp" className="flex items-center gap-1 cursor-pointer">
                    <MessageSquare className="w-4 h-4" /> WhatsApp
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea 
                value={reminderMessage}
                onChange={(e) => setReminderMessage(e.target.value)}
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label>Delivery</Label>
              <RadioGroup 
                value={sendNow ? 'now' : 'schedule'} 
                onValueChange={(v) => setSendNow(v === 'now')}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="now" id="now" />
                  <Label htmlFor="now" className="flex items-center gap-1 cursor-pointer">
                    <Send className="w-4 h-4" /> Send Now
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="schedule" id="schedule" />
                  <Label htmlFor="schedule" className="flex items-center gap-1 cursor-pointer">
                    <Clock className="w-4 h-4" /> Schedule
                  </Label>
                </div>
              </RadioGroup>
              {!sendNow && (
                <Input 
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="mt-2"
                />
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setReminderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitReminder} disabled={isSending}>
              {isSending ? "Sending..." : sendNow ? "Send Now" : "Schedule Reminder"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
};
