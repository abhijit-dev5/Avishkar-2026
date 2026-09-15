import { useEffect, useState } from 'react';
import { Users, Search, Mail, Phone, Calendar, Shield } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader } from '@/components/ui/StatCard';
import { StatCard } from '@/components/ui/StatCard';
import { users, admins } from '@/data/mockData';

export function AdminUsers() {
  const [filter, setFilter] = useState('');
  const allUsers = [...users, ...admins.map(a => ({ ...a, user_id: 1000 + a.admin_id, role: 'ADMIN' as const, password: a.password }))];

  const filtered = allUsers.filter((u) =>
    filter === '' ||
    u.name.toLowerCase().includes(filter.toLowerCase()) ||
    u.email.toLowerCase().includes(filter.toLowerCase())
  );

  const citizens = allUsers.filter((u) => u.role === 'CITIZEN').length;
  const totalAdmins = allUsers.filter((u) => u.role === 'ADMIN').length;

  return (
    <DashboardLayout title="Manage Users">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Users" value={allUsers.length} icon={Users} color="info" />
        <StatCard label="Citizens" value={citizens} icon={Users} color="success" />
        <StatCard label="Admins" value={totalAdmins} icon={Shield} color="primary" />
      </div>

      <div className="relative max-w-md mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400" />
        <input type="text" value={filter} onChange={(e) => setFilter(e.target.value)}
          className="input pl-10" placeholder="Search by name or email..." />
      </div>

      <Card>
        <CardHeader title="All Users" subtitle={`${filtered.length} users`} />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                {['ID', 'Name', 'Email', 'Phone', 'Role', 'Joined'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-neutral-500 uppercase px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((u) => (
                <tr key={u.user_id} className="hover:bg-neutral-50 transition">
                  <td className="px-4 py-3"><span className="font-mono text-sm text-neutral-500">#{u.user_id}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-bold text-neutral-600">
                        {u.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-neutral-800">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="text-sm text-neutral-600">{u.email}</span></td>
                  <td className="px-4 py-3"><span className="text-sm text-neutral-600">{u.phone}</span></td>
                  <td className="px-4 py-3">
                    <span className={`badge ${u.role === 'ADMIN' ? 'bg-primary-100 text-primary-700' : 'bg-info-100 text-info-700'}`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3"><span className="text-sm text-neutral-500">{new Date(u.created_at).toLocaleDateString()}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
}
