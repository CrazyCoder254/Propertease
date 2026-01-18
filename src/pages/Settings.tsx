import { useState } from 'react';
import { User, Bell, Shield, Palette } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const settingsSections = [
  {
    id: 'profile',
    title: 'Profile Settings',
    description: 'Manage your account information',
    icon: User,
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Configure alert preferences',
    icon: Bell,
  },
  {
    id: 'security',
    title: 'Security',
    description: 'Password and authentication',
    icon: Shield,
  },
  {
    id: 'appearance',
    title: 'Appearance',
    description: 'Customize the interface',
    icon: Palette,
  },
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState('profile');
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: 'Settings Saved',
      description: 'Your preferences have been updated successfully.',
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and application preferences
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Navigation */}
          <div className="lg:col-span-1">
            <div className="stat-card p-2">
              <nav className="space-y-1">
                {settingsSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors',
                      activeSection === section.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <section.icon className="h-5 w-5" />
                    <div>
                      <p className="font-medium">{section.title}</p>
                      <p className={cn('text-xs', activeSection === section.id ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                        {section.description}
                      </p>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Section */}
            {activeSection === 'profile' && (
              <div className="stat-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Profile Settings</h2>
                    <p className="text-sm text-muted-foreground">Update your personal information</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="Admin" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="User" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="admin@propertease.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input id="company" defaultValue="Propertease Management" />
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === 'notifications' && (
              <div className="stat-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Bell className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Notification Preferences</h2>
                    <p className="text-sm text-muted-foreground">Choose what notifications you receive</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Rent Payment Reminders', description: 'Get notified about upcoming and overdue payments' },
                    { label: 'Maintenance Updates', description: 'Receive updates on maintenance request status' },
                    { label: 'Lease Expiration Alerts', description: 'Be reminded about expiring leases' },
                    { label: 'Email Notifications', description: 'Receive notifications via email' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <div className="stat-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Security Settings</h2>
                    <p className="text-sm text-muted-foreground">Manage your password and authentication</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" placeholder="Enter current password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" placeholder="Enter new password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Section */}
            {activeSection === 'appearance' && (
              <div className="stat-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Palette className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Appearance Settings</h2>
                    <p className="text-sm text-muted-foreground">Customize how the interface looks</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">Compact View</p>
                      <p className="text-sm text-muted-foreground">Use smaller spacing and font sizes</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">Show Animations</p>
                      <p className="text-sm text-muted-foreground">Enable smooth transitions and effects</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
              <Button className="gradient-primary shadow-glow" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
