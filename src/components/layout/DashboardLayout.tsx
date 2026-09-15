import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FilePlus, Clock, History, Bell, Star, Users,
  Building2, Truck, ShieldAlert, LogOut, Menu, X, Activity,
  Siren, ChevronRight, type LucideIcon,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { Role } from '@/types/models';

interface NavLink {
  to: string;
  label: string;
  icon: LucideIcon;
}

const linksByRole: Record<Role, NavLink[]> = {
  CITIZEN: [
    { to: '/citizen', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/citizen/report', label: 'Report Emergency', icon: FilePlus },
    { to: '/citizen/track', label: 'Track Emergency', icon: Clock },
    { to: '/citizen/history', label: 'Emergency History', icon: History },
    { to: '/citizen/notifications', label: 'Notifications', icon: Bell },
    { to: '/citizen/feedback', label: 'Feedback', icon: Star },
  ],
  ADMIN: [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/emergencies', label: 'All Emergencies', icon: Siren },
    { to: '/admin/users', label: 'Manage Users', icon: Users },
    { to: '/admin/departments', label: 'Departments', icon: Building2 },
    { to: '/admin/vehicles', label: 'Vehicles', icon: Truck },
    { to: '/admin/feedback', label: 'Feedback', icon: Star },
  ],
  DEPARTMENT: [
    { to: '/department', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/department/emergencies', label: 'Assigned Emergencies', icon: Siren },
    { to: '/department/responders', label: 'Responders', icon: Users },
    { to: '/department/vehicles', label: 'Vehicles', icon: Truck },
  ],
  RESPONDER: [
    { to: '/responder', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/responder/emergencies', label: 'My Emergencies', icon: Siren },
  ],
};

const roleLabels: Record<Role, string> = {
  CITIZEN: 'Citizen Portal',
  ADMIN: 'Admin Control Center',
  DEPARTMENT: 'Department Console',
  RESPONDER: 'Responder Console',
};

const roleColors: Record<Role, string> = {
  CITIZEN: 'bg-info-600',
  ADMIN: 'bg-primary-600',
  DEPARTMENT: 'bg-accent-600',
  RESPONDER: 'bg-success-600',
};

export function DashboardLayout({ children, title }: { children: ReactNode; title: string }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;
  const links = linksByRole[user.role] ?? [];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebar = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-neutral-200">
        <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shrink-0">
          <ShieldAlert className="w-6 h-6 text-white" />
        </div>
        <div className="min-w-0">
          <p className="font-display font-bold text-sm text-neutral-900 leading-tight">AI Emergency</p>
          <p className="text-xs text-neutral-500 leading-tight">Response System</p>
        </div>
      </div>

      {/* Role badge */}
      <div className="px-5 py-3">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-white ${roleColors[user.role]}`}>
          <Activity className="w-3.5 h-3.5" />
          {roleLabels[user.role]}
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setSidebarOpen(false)}
              className={`sidebar-link ${active ? 'sidebar-link-active' : ''}`}
            >
              <link.icon className="w-5 h-5 shrink-0" />
              <span>{link.label}</span>
              {active && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="border-t border-neutral-200 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-bold text-neutral-600">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-neutral-800 truncate">{user.name}</p>
            <p className="text-xs text-neutral-500 truncate">{user.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full btn-ghost text-error-600 hover:bg-error-50 hover:border-error-200">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-neutral-200 flex-col fixed inset-y-0 left-0 z-30">
        {sidebar}
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 animate-fade-in">
          <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 inset-y-0 w-72 bg-white shadow-2xl animate-slide-in-right">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-neutral-100">
              <X className="w-5 h-5 text-neutral-500" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-neutral-200 px-4 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-neutral-100">
              <Menu className="w-5 h-5 text-neutral-600" />
            </button>
            <h1 className="font-display font-bold text-lg text-neutral-900">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-neutral-500 hover:text-neutral-800 font-medium hidden sm:block">
              Home
            </Link>
            <div className="w-9 h-9 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-bold text-neutral-600">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
