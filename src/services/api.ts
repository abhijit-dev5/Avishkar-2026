// ============================================================
// API SERVICE LAYER — placeholder REST API functions.
// Each function simulates a network call with latency and
// returns mock data. Replace the mock logic with real fetch()
// calls to the Java Spring Boot backend when it is ready.
//
// Future backend: Java Spring Boot + REST API + MySQL
// ============================================================

import {
  users, admins, emergencyReports, emergencyTypes, emergencyStatuses,
  departments, responders, vehicles, dispatches, locations,
  attachments, aiAnalyses, statusUpdates, notifications, feedbacks,
} from '@/data/mockData';
import type {
  User, EmergencyReport, AiAnalysis, Notification, Feedback,
  EmergencyDepartment, Responder, Vehicle, StatusName,
} from '@/types/models';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ---------- AUTH ----------

// POST /api/users/register
export async function apiRegister(name: string, email: string, password: string, phone: string): Promise<{ success: boolean; message: string; user?: User }> {
  await delay(600);
  const existing = users.find((u) => u.email === email);
  if (existing) return { success: false, message: 'An account with this email already exists.' };
  const newUser: User = {
    user_id: users.length + 1, name, email, password, phone,
    role: 'CITIZEN', created_at: new Date().toISOString(),
  };
  users.push(newUser);
  return { success: true, message: 'Registration successful.', user: newUser };
}

// POST /api/users/login
export async function apiLogin(email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
  await delay(500);
  const user = users.find((u) => u.email === email && u.password === password);
  if (user) return { success: true, message: 'Login successful.', user };
  const admin = admins.find((a) => a.email === email && a.password === password);
  if (admin) {
    const adminUser: User = {
      user_id: 1000 + admin.admin_id, name: admin.name, email: admin.email,
      password: admin.password, phone: admin.phone, role: 'ADMIN', created_at: admin.created_at,
    };
    return { success: true, message: 'Login successful.', user: adminUser };
  }
  return { success: false, message: 'Invalid email or password.' };
}

// ---------- EMERGENCIES ----------

// GET /api/emergencies
export async function apiGetAllEmergencies(): Promise<EmergencyReport[]> {
  await delay(400);
  return [...emergencyReports];
}

// GET /api/emergencies/{id}
export async function apiGetEmergencyById(id: number): Promise<EmergencyReport | null> {
  await delay(300);
  return emergencyReports.find((e) => e.emergency_id === id) ?? null;
}

// POST /api/emergencies
export async function apiCreateEmergency(data: {
  user_id: number;
  emergency_type_id: number;
  description: string;
  address: string;
  city: string;
  area: string;
  pincode: string;
  latitude: number;
  longitude: number;
  fileName?: string;
}): Promise<{ success: boolean; message: string; emergency?: EmergencyReport }> {
  await delay(800);
  const newId = emergencyReports.length + 1;
  const locId = locations.length + 1;
  const newLoc = {
    location_id: locId, emergency_id: newId,
    latitude: data.latitude, longitude: data.longitude,
    address: data.address, city: data.city, area: data.area, pincode: data.pincode,
  };
  locations.push(newLoc);

  const newAtt = data.fileName ? [{
    attachment_id: attachments.length + 1, emergency_id: newId,
    file_name: data.fileName, file_type: 'IMAGE' as const,
    file_path: `/uploads/${data.fileName}`, uploaded_at: new Date().toISOString(),
  }] : [];
  attachments.push(...newAtt);

  const report: EmergencyReport = {
    emergency_id: newId, user_id: data.user_id,
    emergency_type_id: data.emergency_type_id, location_id: locId, status_id: 1,
    description: data.description, priority: 'NORMAL',
    created_at: new Date().toISOString(),
    citizen_name: users.find((u) => u.user_id === data.user_id)?.name ?? 'Unknown',
    type_name: emergencyTypes.find((t) => t.emergency_type_id === data.emergency_type_id)?.type_name,
    status_name: 'REPORTED', location: newLoc, ai_analysis: undefined,
    attachments: newAtt, dispatches: [],
    department_name: '—', responder_name: '—', vehicle_number: '—',
  };
  emergencyReports.push(report);
  return { success: true, message: 'Emergency report submitted.', emergency: report };
}

// PUT /api/emergencies/{id}/status
export async function apiUpdateEmergencyStatus(id: number, statusName: StatusName, updatedBy: string, remarks: string): Promise<{ success: boolean; message: string }> {
  await delay(300);
  const report = emergencyReports.find((e) => e.emergency_id === id);
  if (!report) return { success: false, message: 'Emergency not found.' };
  const status = emergencyStatuses.find((s) => s.status_name === statusName);
  if (status) {
    report.status_id = status.status_id;
    report.status_name = status.status_name;
  }
  statusUpdates.push({
    update_id: statusUpdates.length + 1, emergency_id: id,
    status_id: report.status_id, updated_by: updatedBy, remarks,
    update_time: new Date().toISOString(),
  });
  return { success: true, message: 'Status updated.' };
}

// PUT /api/emergencies/{id}/assign
export async function apiAssignEmergency(id: number, data: {
  department_id?: number; responder_id?: number; vehicle_id?: number;
}): Promise<{ success: boolean; message: string }> {
  await delay(400);
  const report = emergencyReports.find((e) => e.emergency_id === id);
  if (!report) return { success: false, message: 'Emergency not found.' };
  if (data.department_id) {
    const dept = departments.find((d) => d.department_id === data.department_id);
    if (dept) report.department_name = dept.department_name;
  }
  if (data.responder_id) {
    const resp = responders.find((r) => r.responder_id === data.responder_id);
    if (resp) {
      report.responder_name = resp.name;
      resp.availability_status = 'ON_DUTY';
    }
  }
  if (data.vehicle_id) {
    const veh = vehicles.find((v) => v.vehicle_id === data.vehicle_id);
    if (veh) {
      report.vehicle_number = veh.vehicle_number;
      veh.availability_status = 'ON_DUTY';
    }
  }
  if (data.responder_id && data.vehicle_id) {
    report.status_name = 'RESPONDER_ASSIGNED';
    report.status_id = 4;
  }
  return { success: true, message: 'Assignment updated.' };
}

// GET /api/admin/emergencies
export async function apiGetAdminEmergencies(): Promise<EmergencyReport[]> {
  await delay(400);
  return [...emergencyReports];
}

// ---------- AI ----------

// POST /api/ai/analyze  (delegates to simulatedAIService)
export async function apiAnalyzeEmergency(emergencyTypeId: number): Promise<AiAnalysis | null> {
  await delay(2000);
  const { simulateAiAnalysis } = await import('@/services/aiService');
  return simulateAiAnalysis(emergencyTypeId);
}

// ---------- FEEDBACK ----------

// POST /api/feedback
export async function apiSubmitFeedback(userId: number, emergencyId: number, rating: number, comment: string): Promise<{ success: boolean; message: string }> {
  await delay(400);
  feedbacks.push({
    feedback_id: feedbacks.length + 1, user_id: userId, emergency_id: emergencyId,
    rating, comment, created_at: new Date().toISOString(),
  });
  return { success: true, message: 'Feedback submitted. Thank you!' };
}

// GET /api/notifications
export async function apiGetNotifications(userId: number): Promise<Notification[]> {
  await delay(300);
  return notifications.filter((n) => n.user_id === userId);
}

// ---------- REFERENCE DATA ----------

export async function apiGetDepartments(): Promise<EmergencyDepartment[]> {
  await delay(200);
  return [...departments];
}

export async function apiGetResponders(): Promise<Responder[]> {
  await delay(200);
  return [...responders];
}

export async function apiGetVehicles(): Promise<Vehicle[]> {
  await delay(200);
  return [...vehicles];
}

export async function apiGetStatusUpdates(emergencyId: number) {
  await delay(200);
  return statusUpdates.filter((s) => s.emergency_id === emergencyId);
}
