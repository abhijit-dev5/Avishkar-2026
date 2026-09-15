import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { apiLogin } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import type { Role } from '@/types/models';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const roleRoutes: Record<Role, string> = {
    CITIZEN: '/citizen',
    ADMIN: '/admin',
    DEPARTMENT: '/department',
    RESPONDER: '/responder',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await apiLogin(form.email, form.password);
    setLoading(false);
    if (res.success && res.user) {
      login(res.user);
      toast('Welcome back, ' + res.user.name + '!');
      navigate(roleRoutes[res.user.role]);
    } else {
      toast(res.message, 'error');
    }
  };

  const quickLogin = (email: string, password: string) => {
    setForm({ email, password });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-neutral-950 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-info-600/20 rounded-full blur-3xl" />
        <div className="relative flex flex-col justify-center px-16 text-white">
          <Link to="/" className="flex items-center gap-2.5 mb-12">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold">AI Emergency Response</span>
          </Link>
          <h1 className="font-display font-extrabold text-4xl leading-tight">
            Welcome back to<br />the response network.
          </h1>
          <p className="text-neutral-400 mt-4 text-lg">
            Sign in to report emergencies, track response status, manage dispatches,
            and monitor the full emergency workflow.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-neutral-50">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
          <div className="lg:hidden flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-neutral-900">AI Emergency Response</span>
          </div>

          <h2 className="font-display font-bold text-2xl text-neutral-900">Sign in to your account</h2>
          <p className="text-neutral-500 text-sm mt-1">Access your emergency response dashboard</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400" />
                <input
                  type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input pl-10" placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400" />
                <input
                  type="password" required value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input pl-10" placeholder="••••••••"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <p className="text-sm text-neutral-500 text-center mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700">Register here</Link>
          </p>

          {/* Quick demo logins */}
          <div className="mt-6">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Quick Demo Login</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => quickLogin('rahul@example.com', 'citizen123')}
                className="p-2.5 rounded-lg bg-white border border-neutral-200 hover:border-info-300 hover:bg-info-50 text-left transition">
                <p className="text-sm font-semibold text-neutral-800">Citizen</p>
                <p className="text-xs text-neutral-500">rahul@example.com</p>
              </button>
              <button onClick={() => quickLogin('admin@ers.gov', 'admin123')}
                className="p-2.5 rounded-lg bg-white border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 text-left transition">
                <p className="text-sm font-semibold text-neutral-800">Admin</p>
                <p className="text-xs text-neutral-500">admin@ers.gov</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
