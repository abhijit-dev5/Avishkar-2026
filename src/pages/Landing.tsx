import { Link } from 'react-router-dom';
import {
  ShieldAlert, Siren, MapPin, Brain, Clock, Bell, Star, ArrowRight,
  Car, Flame, HeartPulse, Waves, CloudLightning, Zap, Building2,
  CheckCircle2, Phone, Activity, Users, Truck, type LucideIcon,
} from 'lucide-react';
import { emergencyTypes } from '@/data/mockData';

const iconMap: Record<string, LucideIcon> = {
  Car, Flame, HeartPulse, Waves, CloudLightning, Zap, Building2, ShieldAlert,
};

const steps = [
  { icon: Siren, title: 'Report Emergency', desc: 'Citizen submits emergency with photo, description, and location.' },
  { icon: Brain, title: 'AI Analysis', desc: 'AI detects emergency type, severity, and priority automatically.' },
  { icon: Users, title: 'Department Assignment', desc: 'Admin verifies and assigns the appropriate department.' },
  { icon: Truck, title: 'Dispatch & Response', desc: 'Responders and vehicles are dispatched to the location.' },
  { icon: Bell, title: 'Citizen Notification', desc: 'Citizen receives real-time status updates throughout.' },
  { icon: Star, title: 'Resolution & Feedback', desc: 'Emergency resolved. Citizen rates the response quality.' },
];

const aiFeatures = [
  { icon: Brain, title: 'Intelligent Detection', desc: 'Classifies emergency type from uploaded images with 80–95% confidence.' },
  { icon: Activity, title: 'Severity Assessment', desc: 'Automatically calculates severity level (Low, Medium, High, Critical).' },
  { icon: Siren, title: 'Priority Scoring', desc: 'Assigns response priority to ensure critical cases are handled first.' },
  { icon: Users, title: 'Department Recommendation', desc: 'Recommends the most suitable emergency departments to dispatch.' },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-neutral-900">AI Emergency Response</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#how" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">How It Works</a>
            <a href="#types" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">Emergency Types</a>
            <a href="#ai" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">AI Features</a>
            <a href="#about" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">About</a>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
            <Link to="/register" className="btn-primary text-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-neutral-950">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-info-600/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-600/10 border border-primary-500/30 text-primary-400 text-sm font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              AI-Powered Emergency Management Platform
            </div>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
              Report Emergencies.<br />
              Get <span className="text-primary-500">Intelligent Response.</span>
            </h1>
            <p className="mt-6 text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              A smart emergency response system that uses AI to analyze reports, predict severity,
              and dispatch the right help — fast. Built for citizens, administrators, and emergency departments.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/register" className="btn-primary text-base px-6 py-3.5">
                <Siren className="w-5 h-5" />
                Report Emergency
              </Link>
              <Link to="/login" className="btn text-base px-6 py-3.5 bg-white/10 text-white border border-white/20 hover:bg-white/20">
                <Clock className="w-5 h-5" />
                Track Emergency
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { value: '12+', label: 'Emergencies Tracked' },
              { value: '5', label: 'Departments Connected' },
              { value: '8', label: 'Responders Active' },
              { value: '94%', label: 'AI Confidence Avg' },
            ].map((s) => (
              <div key={s.label} className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-3xl font-bold font-display text-white">{s.value}</p>
                <p className="text-sm text-neutral-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Types */}
      <section id="types" className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl text-neutral-900">Emergency Types We Handle</h2>
            <p className="text-neutral-500 mt-2">Report any of these emergencies and get AI-assisted response</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {emergencyTypes.map((type) => {
              const Icon = iconMap[type.icon] ?? ShieldAlert;
              return (
                <div key={type.emergency_type_id} className="card card-hover p-5 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-7 h-7 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 text-sm">{type.type_name}</h3>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{type.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl text-neutral-900">How The System Works</h2>
            <p className="text-neutral-500 mt-2">From report to resolution in six steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="relative card p-6 card-hover">
                <div className="absolute top-4 right-4 text-5xl font-bold text-neutral-100 font-display">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-neutral-900">{step.title}</h3>
                  <p className="text-sm text-neutral-500 mt-1.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section id="ai" className="py-20 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-info-600/10 border border-info-500/30 text-info-400 text-sm font-semibold mb-4">
              <Brain className="w-4 h-4" />
              AI-Powered Analysis
            </div>
            <h2 className="font-display font-bold text-3xl text-white">Intelligent Emergency Analysis</h2>
            <p className="text-neutral-400 mt-2">Our AI module analyzes every report and provides instant predictions</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiFeatures.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-info-600/20 flex items-center justify-center shrink-0">
                    <f.icon className="w-6 h-6 text-info-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{f.title}</h3>
                    <p className="text-sm text-neutral-400 mt-1.5 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Example card */}
          <div className="mt-8 max-w-2xl mx-auto p-6 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-info-400" />
              <span className="text-sm font-semibold text-neutral-300">AI Analysis Example</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-xs text-neutral-500">Detected Type</p>
                <p className="font-semibold text-white">Road Accident</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-xs text-neutral-500">Confidence</p>
                <p className="font-semibold text-success-400">94%</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-xs text-neutral-500">Severity</p>
                <p className="font-semibold text-accent-400">HIGH</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-xs text-neutral-500">Priority</p>
                <p className="font-semibold text-primary-400">CRITICAL</p>
              </div>
            </div>
            <div className="mt-3 p-3 rounded-lg bg-white/5">
              <p className="text-xs text-neutral-500">Recommended Departments</p>
              <div className="flex gap-2 mt-1.5">
                <span className="badge bg-info-600/20 text-info-300">Police</span>
                <span className="badge bg-error-600/20 text-error-300">Ambulance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="font-display font-bold text-2xl text-white">Emergency Contacts</h2>
            <p className="text-primary-100 mt-1">Direct helpline numbers for immediate assistance</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { name: 'Police', num: '100', icon: ShieldAlert },
              { name: 'Fire', num: '101', icon: Flame },
              { name: 'Ambulance', num: '108', icon: HeartPulse },
              { name: 'Disaster', num: '1070', icon: CloudLightning },
              { name: 'Electricity', num: '1912', icon: Zap },
            ].map((c) => (
              <div key={c.name} className="p-4 rounded-xl bg-white/10 border border-white/20 text-center hover:bg-white/15 transition cursor-pointer">
                <c.icon className="w-6 h-6 text-white mx-auto mb-2" />
                <p className="text-sm font-medium text-white">{c.name}</p>
                <p className="text-lg font-bold font-mono text-white mt-0.5">{c.num}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-3xl text-neutral-900">About This Project</h2>
          <p className="text-neutral-600 mt-4 leading-relaxed text-lg">
            The AI Emergency Response System is a college-level software project designed to modernize
            how citizens report emergencies and how authorities respond to them. The platform combines
            AI-powered analysis with a structured multi-role workflow — connecting citizens, administrators,
            emergency departments, and responders in one unified system.
          </p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: CheckCircle2, label: 'Java Spring Boot + REST API + MySQL', sub: 'Planned backend architecture' },
              { icon: Brain, label: 'Python AI Service + ML Model', sub: 'Planned AI prediction pipeline' },
              { icon: Activity, label: 'React + TypeScript Frontend', sub: 'Current prototype interface' },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-xl bg-neutral-50 border border-neutral-200 text-left">
                <item.icon className="w-6 h-6 text-primary-600 mb-2" />
                <p className="font-semibold text-sm text-neutral-900">{item.label}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display font-bold text-3xl text-neutral-900">Ready to Get Started?</h2>
          <p className="text-neutral-500 mt-2">Create an account and start reporting emergencies today</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="btn-primary text-base px-6 py-3.5">
              Create Account <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="btn-ghost text-base px-6 py-3.5">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">AI Emergency Response System</span>
          </div>
          <p className="text-sm text-neutral-500">College Project · Prototype Demo · 2025</p>
        </div>
      </footer>
    </div>
  );
}
