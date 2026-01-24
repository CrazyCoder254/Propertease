import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  DollarSign,
  Wrench,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const allNavItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ['admin', 'landlord', 'tenant'] },
  { name: 'Properties', href: '/properties', icon: Building2, roles: ['admin', 'landlord'] },
  { name: 'Tenants', href: '/tenants', icon: Users, roles: ['admin', 'landlord'] },
  { name: 'Rent', href: '/rent', icon: DollarSign, roles: ['admin', 'landlord', 'tenant'] },
  { name: 'Maintenance', href: '/maintenance', icon: Wrench, roles: ['admin', 'landlord', 'tenant'] },
  { name: 'Reports', href: '/reports', icon: FileText, roles: ['admin', 'landlord'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['admin', 'landlord', 'tenant'] },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { role, signOut, user } = useAuth();

  // Filter nav items based on user role
  const navItems = allNavItems.filter(item => 
    role ? item.roles.includes(role) : false
  );

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  const getRoleBadgeColor = (userRole: string | null) => {
    switch (userRole) {
      case 'admin':
        return 'bg-destructive/20 text-destructive';
      case 'landlord':
        return 'bg-primary/20 text-primary';
      case 'tenant':
        return 'bg-green-500/20 text-green-600';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out',
        'bg-sidebar border-r border-sidebar-border',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-glow">
              <Home className="h-5 w-5 text-white" />
            </div>
            {!collapsed && (
              <span className="text-xl font-bold text-sidebar-foreground">
                Propertease
              </span>
            )}
          </div>
        </div>

        {/* User Role Badge */}
        {!collapsed && role && (
          <div className="px-4 py-3 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <span className={cn(
                'px-2 py-1 rounded-full text-xs font-medium capitalize',
                getRoleBadgeColor(role)
              )}>
                {role}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {user?.email}
              </span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  'sidebar-link',
                  isActive && 'active'
                )}
              >
                <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-sidebar-primary-foreground')} />
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Collapse Toggle & Logout */}
        <div className="border-t border-sidebar-border p-3 space-y-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="sidebar-link w-full justify-center"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span>Collapse</span>
              </>
            )}
          </button>
          <button 
            onClick={handleLogout}
            className="sidebar-link w-full text-destructive/80 hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
