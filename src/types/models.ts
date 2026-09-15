// ============================================================
// DATA MODELS — mirrors the 15 entities of the system.
// These types represent the shape returned by the future
// Java Spring Boot + MySQL REST API.
// ============================================================

export type Role = 'CITIZEN' | 'ADMIN' | 'DEPARTMENT' | 'RESPONDER';

export type EmergencyTypeName =
  | 'Road Accident'
  | 'Fire'
  | 'Medical Emergency'
  | 'Flood'
  | 'Natural Disaster'
  | 'Electrical Accident'
  | 'Building Collapse'
  | 'Crime';

export type StatusName =
  | 'REPORTED'
  | 'VERIFIED'
  | 'DISPATCHED'
  | 'RESPONDER_ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'REJECTED';

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type Priority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';

export type DepartmentType =
  | 'POLICE'
  | 'FIRE'
  | 'MEDICAL'
  | 'DISASTER'
  | 'ELECTRICITY';

export type ResponderType =
  | 'Police Officer'
  | 'Firefighter'
  | 'Paramedic'
  | 'Rescue Worker';

export type VehicleType =
  | 'Patrol Car'
  | 'Fire Truck'
  | 'Ambulance'
  | 'Rescue Van'
  | 'Disaster Response Unit';

export interface User {
  user_id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
  created_at: string;
}

export interface Admin {
  admin_id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  created_at: string;
}

export interface EmergencyType {
  emergency_type_id: number;
  type_name: EmergencyTypeName;
  description: string;
  icon: string;
  color: string;
}

export interface EmergencyStatus {
  status_id: number;
  status_name: StatusName;
  description: string;
}

export interface EmergencyReport {
  emergency_id: number;
  user_id: number;
  emergency_type_id: number;
  location_id: number;
  status_id: number;
  description: string;
  priority: Priority;
  created_at: string;
  // joined fields (populated by mock data)
  citizen_name?: string;
  type_name?: EmergencyTypeName;
  status_name?: StatusName;
  location?: Location;
  ai_analysis?: AiAnalysis;
  attachments?: Attachment[];
  dispatches?: Dispatch[];
  department_name?: string;
  responder_name?: string;
  vehicle_number?: string;
}

export interface EmergencyDepartment {
  department_id: number;
  department_name: string;
  contact: string;
  address: string;
  department_type: DepartmentType;
}

export interface Responder {
  responder_id: number;
  department_id: number;
  name: string;
  phone: string;
  responder_type: ResponderType;
  availability_status: 'AVAILABLE' | 'ON_DUTY' | 'OFF_DUTY';
}

export interface Vehicle {
  vehicle_id: number;
  department_id: number;
  vehicle_number: string;
  vehicle_type: VehicleType;
  availability_status: 'AVAILABLE' | 'ON_DUTY' | 'OFF_DUTY';
}

export interface Dispatch {
  dispatch_id: number;
  emergency_id: number;
  responder_id: number;
  vehicle_id: number;
  department_id: number;
  dispatch_time: string;
  arrival_time: string | null;
  dispatch_status: 'DISPATCHED' | 'EN_ROUTE' | 'ON_SCENE' | 'COMPLETED';
}

export interface Location {
  location_id: number;
  emergency_id: number;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  area: string;
  pincode: string;
}

export interface Attachment {
  attachment_id: number;
  emergency_id: number;
  file_name: string;
  file_type: 'IMAGE' | 'VIDEO';
  file_path: string;
  uploaded_at: string;
}

export interface AiAnalysis {
  analysis_id: number;
  emergency_id: number;
  detected_type: EmergencyTypeName;
  confidence: number;
  severity: Severity;
  priority: Priority;
  analysis_time: string;
  recommended_departments: DepartmentType[];
}

export interface StatusUpdate {
  update_id: number;
  emergency_id: number;
  status_id: number;
  updated_by: string;
  remarks: string;
  update_time: string;
}

export interface Notification {
  notification_id: number;
  user_id: number;
  emergency_id: number;
  message: string;
  notification_type: 'STATUS_CHANGE' | 'ASSIGNMENT' | 'VERIFICATION' | 'RESOLUTION' | 'AI_ANALYSIS';
  is_read: boolean;
  created_at: string;
}

export interface Feedback {
  feedback_id: number;
  user_id: number;
  emergency_id: number;
  rating: number;
  comment: string;
  created_at: string;
}
