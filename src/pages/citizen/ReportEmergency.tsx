import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Siren, MapPin, Upload, Loader2, Camera, FileText, Navigation,
  Car, Flame, HeartPulse, Waves, CloudLightning, Zap, Building2,
  ShieldAlert, type LucideIcon, X,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { apiCreateEmergency } from '@/services/api';
import { emergencyTypes } from '@/data/mockData';

const iconMap: Record<string, LucideIcon> = {
  Car, Flame, HeartPulse, Waves, CloudLightning, Zap, Building2, ShieldAlert,
};

export function ReportEmergency() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [form, setForm] = useState({
    description: '',
    address: '',
    city: 'Bangalore',
    area: '',
    pincode: '',
    latitude: 12.9716,
    longitude: 77.5946,
  });

  if (!user) return null;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const useMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setForm((f) => ({ ...f, latitude: pos.coords.latitude, longitude: pos.coords.longitude }));
          toast('Location detected successfully.', 'info');
        },
        () => toast('Could not detect location. Using default.', 'error')
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) {
      toast('Please select an emergency type.', 'error');
      return;
    }
    if (!form.description || !form.address) {
      toast('Please fill in all required fields.', 'error');
      return;
    }
    setLoading(true);
    const res = await apiCreateEmergency({
      user_id: user.user_id,
      emergency_type_id: selectedType,
      description: form.description,
      address: form.address,
      city: form.city,
      area: form.area,
      pincode: form.pincode,
      latitude: form.latitude,
      longitude: form.longitude,
      fileName,
    });
    setLoading(false);
    if (res.success && res.emergency) {
      toast('Emergency report submitted! AI is analyzing...');
      navigate(`/citizen/ai-analysis?id=${res.emergency.emergency_id}&type=${selectedType}`);
    } else {
      toast(res.message, 'error');
    }
  };

  return (
    <DashboardLayout title="Report Emergency">
      <form onSubmit={handleSubmit} className="max-w-4xl">
        {/* Step 1: Emergency Type */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold">1</div>
            <h3 className="font-display font-bold text-neutral-900">Select Emergency Type</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {emergencyTypes.map((type) => {
              const Icon = iconMap[type.icon] ?? ShieldAlert;
              const active = selectedType === type.emergency_type_id;
              return (
                <button
                  key={type.emergency_type_id}
                  type="button"
                  onClick={() => setSelectedType(type.emergency_type_id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    active
                      ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-100'
                      : 'border-neutral-200 bg-white hover:border-neutral-300'
                  }`}
                >
                  <Icon className={`w-7 h-7 mb-2 ${active ? 'text-primary-600' : 'text-neutral-400'}`} />
                  <p className={`font-semibold text-sm ${active ? 'text-primary-700' : 'text-neutral-700'}`}>{type.type_name}</p>
                  <p className="text-xs text-neutral-400 mt-0.5 leading-tight">{type.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Details */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold">2</div>
            <h3 className="font-display font-bold text-neutral-900">Emergency Details</h3>
          </div>
          <div className="card p-5 space-y-4">
            <div>
              <label className="label">Description <span className="text-error-500">*</span></label>
              <div className="relative">
                <FileText className="absolute left-3 top-3.5 w-4.5 h-4.5 text-neutral-400" />
                <textarea
                  required value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  className="input pl-10 resize-none"
                  placeholder="Describe what happened. Include details like number of people affected, visible damage, etc."
                />
              </div>
            </div>

            <div>
              <label className="label">Photo / Video Attachment</label>
              <div className="relative">
                {fileName ? (
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 bg-neutral-50">
                    <Camera className="w-5 h-5 text-neutral-500" />
                    <span className="text-sm text-neutral-700 flex-1 truncate">{fileName}</span>
                    <button type="button" onClick={() => setFileName('')} className="text-neutral-400 hover:text-error-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed border-neutral-300 hover:border-primary-400 hover:bg-primary-50/30 cursor-pointer transition">
                    <Upload className="w-5 h-5 text-neutral-400" />
                    <span className="text-sm text-neutral-500">Click to upload a photo or video</span>
                    <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFile} />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Location */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold">3</div>
            <h3 className="font-display font-bold text-neutral-900">Location Information</h3>
          </div>
          <div className="card p-5 space-y-4">
            <div>
              <label className="label">Address <span className="text-error-500">*</span></label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400" />
                <input
                  type="text" required value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="input pl-10" placeholder="Street address, landmark, etc."
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label">City</label>
                <input
                  type="text" value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="input" placeholder="City"
                />
              </div>
              <div>
                <label className="label">Area</label>
                <input
                  type="text" value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  className="input" placeholder="Area / Locality"
                />
              </div>
              <div>
                <label className="label">Pincode</label>
                <input
                  type="text" value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  className="input" placeholder="560001"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Latitude</label>
                <input
                  type="number" step="any" value={form.latitude}
                  onChange={(e) => setForm({ ...form, latitude: parseFloat(e.target.value) })}
                  className="input font-mono text-sm" placeholder="12.9716"
                />
              </div>
              <div>
                <label className="label">Longitude</label>
                <input
                  type="number" step="any" value={form.longitude}
                  onChange={(e) => setForm({ ...form, longitude: parseFloat(e.target.value) })}
                  className="input font-mono text-sm" placeholder="77.5946"
                />
              </div>
            </div>
            <button type="button" onClick={useMyLocation}
              className="btn-ghost text-sm text-info-600 hover:bg-info-50 hover:border-info-200">
              <Navigation className="w-4 h-4" /> Use My Current Location
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className="btn-primary text-base px-6 py-3">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Siren className="w-5 h-5" />}
            {loading ? 'Submitting...' : 'Submit Emergency Report'}
          </button>
          <p className="text-sm text-neutral-500">AI analysis will run automatically after submission.</p>
        </div>
      </form>
    </DashboardLayout>
  );
}
