import { useOutletContext } from "react-router-dom";
import { Settings, User, Bell, Building2, Users } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export const AdminSettingsPage = () => {
  const { sidebarCollapsed } = useOutletContext<{ sidebarCollapsed: boolean }>();
  const handleSave = () => toast.success("Settings saved successfully");

  return (
    <PageWrapper title="Settings" description="Manage your organization settings." sidebarCollapsed={sidebarCollapsed}>
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile"><User className="w-4 h-4 mr-2" />Profile</TabsTrigger>
          <TabsTrigger value="company"><Building2 className="w-4 h-4 mr-2" />Company</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="w-4 h-4 mr-2" />Notifications</TabsTrigger>
          <TabsTrigger value="team"><Users className="w-4 h-4 mr-2" />Team</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center"><span className="text-2xl font-bold text-primary">AD</span></div>
              <div><Button variant="outline" size="sm">Change Photo</Button></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Full Name</Label><Input defaultValue="Admin - Soundarya Group" /></div>
              <div className="space-y-2"><Label>Email</Label><Input defaultValue="admin@soundarya.test" /></div>
              <div className="space-y-2"><Label>Phone</Label><Input defaultValue="+91 98765 43210" /></div>
              <div className="space-y-2"><Label>Designation</Label><Input defaultValue="Managing Director" /></div>
            </div>
            <Button onClick={handleSave}>Save Changes</Button>
          </Card>
        </TabsContent>

        <TabsContent value="company">
          <Card className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Company Name</Label><Input defaultValue="Soundarya Group" /></div>
              <div className="space-y-2"><Label>RERA Number</Label><Input defaultValue="PRM/KA/RERA/1234" /></div>
              <div className="space-y-2"><Label>GST Number</Label><Input defaultValue="29AABCS1234A1Z5" /></div>
              <div className="space-y-2"><Label>Website</Label><Input defaultValue="https://soundaryagroup.com" /></div>
            </div>
            <div className="space-y-2"><Label>Address</Label><Input defaultValue="123 MG Road, Bangalore, Karnataka 560001" /></div>
            <Button onClick={handleSave}>Save Changes</Button>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between"><div><Label>New Lead Alerts</Label><p className="text-sm text-muted-foreground">Get notified when new leads come in</p></div><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><div><Label>Payment Reminders</Label><p className="text-sm text-muted-foreground">Alerts for pending payments</p></div><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><div><Label>Daily Summary</Label><p className="text-sm text-muted-foreground">Receive daily business summary</p></div><Switch /></div>
            <Button onClick={handleSave}>Save Changes</Button>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between"><div><Label>Allow Manager Invites</Label><p className="text-sm text-muted-foreground">Managers can invite new agents</p></div><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><div><Label>Agent Lead Assignment</Label><p className="text-sm text-muted-foreground">Auto-assign leads to agents</p></div><Switch /></div>
            <Button onClick={handleSave}>Save Changes</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
};
