import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, User, Mail, Lock, Phone, ArrowLeft, Loader2 } from 'lucide-react';
import { apiRegister } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await apiRegister(form.name, form.email, form.password, form.phone);
    setLoading(false);
    if (res.success && res.user) {
      login(res.user);
      toast('Account created successfully!');
      navigate('/citizen');
    } else {
      toast(res.message, 'error');
    }
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
            Join the<br />response network.
          </h1>
          <p className="text-neutral-400 mt-4 text-lg">
            Register as a citizen to report emergencies, track response status,
            and receive AI-assisted help when it matters most.
          </p>
          <div className="mt-8 space-y-3">
            {['Report emergencies with photos and location', 'Get AI-powered severity and priority analysis', 'Track response status in real time', 'Rate your experience after resolution'].map((f) => (
              <div key={f} className="flex items-center gap-2 text-neutral-300 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
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

          <h2 className="font-display font-bold text-2xl text-neutral-900">Create your account</h2>
          <p className="text-neutral-500 text-sm mt-1">Register as a citizen to start reporting emergencies</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400" />
                <input
                  type="text" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input pl-10" placeholder="John Doe"
                />
              </div>
            </div>
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
              <label className="label">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400" />
                <input
                  type="tel" required value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input pl-10" placeholder="+91 98765 43210"
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
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <p className="text-sm text-neutral-500 text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Sign in</Link>
          </p>

          <div className="mt-6 p-3 rounded-lg bg-info-50 border border-info-100 text-xs text-info-700">
            <span className="font-semibold">Demo accounts:</span> rahul@example.com / citizen123 · admin@ers.gov / admin123
          </div>
        </div>
      </div>
    </div>
  );
}
