import type {
  User,
  Admin,
  EmergencyType,
  EmergencyStatus,
  EmergencyReport,
  EmergencyDepartment,
  Responder,
  Vehicle,
  Dispatch,
  Location,
  Attachment,
  AiAnalysis,
  StatusUpdate,
  Notification,
  Feedback,
} from '@/types/models';

// ============================================================
// MOCK DATA — realistic sample data for the prototype.
// Replace with API calls once the Spring Boot backend is live.
// ============================================================

export const emergencyTypes: EmergencyType[] = [
  { emergency_type_id: 1, type_name: 'Road Accident', description: 'Vehicle collision or road traffic incident', icon: 'Car', color: 'primary' },
  { emergency_type_id: 2, type_name: 'Fire', description: 'Structural, wildfire, or industrial fire', icon: 'Flame', color: 'accent' },
  { emergency_type_id: 3, type_name: 'Medical Emergency', description: 'Heart attack, injury, or medical crisis', icon: 'HeartPulse', color: 'error' },
  { emergency_type_id: 4, type_name: 'Flood', description: 'Flooding in streets, homes, or low-lying areas', icon: 'Waves', color: 'info' },
  { emergency_type_id: 5, type_name: 'Natural Disaster', description: 'Earthquake, cyclone, or landslide', icon: 'CloudLightning', color: 'warning' },
  { emergency_type_id: 6, type_name: 'Electrical Accident', description: 'Power line, transformer, or electrical hazard', icon: 'Zap', color: 'warning' },
  { emergency_type_id: 7, type_name: 'Building Collapse', description: 'Structural failure or building damage', icon: 'Building2', color: 'neutral' },
  { emergency_type_id: 8, type_name: 'Crime', description: 'Theft, assault, or security emergency', icon: 'ShieldAlert', color: 'primary' },
];

export const emergencyStatuses: EmergencyStatus[] = [
  { status_id: 1, status_name: 'REPORTED', description: 'Emergency has been reported by a citizen' },
  { status_id: 2, status_name: 'VERIFIED', description: 'Admin has verified the report' },
  { status_id: 3, status_name: 'DISPATCHED', description: 'Department and resources dispatched' },
  { status_id: 4, status_name: 'RESPONDER_ASSIGNED', description: 'Responder assigned to the emergency' },
  { status_id: 5, status_name: 'IN_PROGRESS', description: 'Response is in progress on scene' },
  { status_id: 6, status_name: 'RESOLVED', description: 'Emergency has been resolved' },
  { status_id: 7, status_name: 'REJECTED', description: 'Report was rejected as invalid' },
];

export const users: User[] = [
  { user_id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', password: 'citizen123', phone: '+91 98765 43210', role: 'CITIZEN', created_at: '2025-08-01T09:00:00Z' },
  { user_id: 2, name: 'Priya Patel', email: 'priya@example.com', password: 'citizen123', phone: '+91 98123 45678', role: 'CITIZEN', created_at: '2025-08-05T11:30:00Z' },
  { user_id: 3, name: 'Amit Kumar', email: 'amit@example.com', password: 'citizen123', phone: '+91 99887 76655', role: 'CITIZEN', created_at: '2025-08-10T14:00:00Z' },
  { user_id: 4, name: 'Sneha Reddy', email: 'sneha@example.com', password: 'citizen123', phone: '+91 90080 70605', role: 'CITIZEN', created_at: '2025-08-15T08:45:00Z' },
];

export const admins: Admin[] = [
  { admin_id: 1, name: 'System Administrator', email: 'admin@ers.gov', password: 'admin123', phone: '+91 90000 11111', created_at: '2025-07-01T09:00:00Z' },
];

export const departments: EmergencyDepartment[] = [
  { department_id: 1, department_name: 'Police Department', contact: '+91 100', address: 'Police HQ, MG Road, Bangalore', department_type: 'POLICE' },
  { department_id: 2, department_name: 'Fire Department', contact: '+91 101', address: 'Fire Station, Indiranagar, Bangalore', department_type: 'FIRE' },
  { department_id: 3, department_name: 'Ambulance / Medical Dept', contact: '+91 108', address: 'Medical Center, Jayanagar, Bangalore', department_type: 'MEDICAL' },
  { department_id: 4, department_name: 'Disaster Management Dept', contact: '+91 1070', address: 'Disaster Control Room, Whitefield, Bangalore', department_type: 'DISASTER' },
  { department_id: 5, department_name: 'Electricity Department', contact: '+91 1912', address: 'BESCOM Office, Koramangala, Bangalore', department_type: 'ELECTRICITY' },
];

export const responders: Responder[] = [
  { responder_id: 1, department_id: 1, name: 'Inspector Verma', phone: '+91 95551 11111', responder_type: 'Police Officer', availability_status: 'ON_DUTY' },
  { responder_id: 2, department_id: 1, name: 'SI Gupta', phone: '+91 95552 22222', responder_type: 'Police Officer', availability_status: 'AVAILABLE' },
  { responder_id: 3, department_id: 2, name: 'Captain Singh', phone: '+91 95553 33333', responder_type: 'Firefighter', availability_status: 'ON_DUTY' },
  { responder_id: 4, department_id: 2, name: 'FF Rao', phone: '+91 95554 44444', responder_type: 'Firefighter', availability_status: 'AVAILABLE' },
  { responder_id: 5, department_id: 3, name: 'Dr. Mehta', phone: '+91 95555 55555', responder_type: 'Paramedic', availability_status: 'ON_DUTY' },
  { responder_id: 6, department_id: 3, name: 'Nurse Iyer', phone: '+91 95556 66666', responder_type: 'Paramedic', availability_status: 'AVAILABLE' },
  { responder_id: 7, department_id: 4, name: 'Rescue Lead Das', phone: '+91 95557 77777', responder_type: 'Rescue Worker', availability_status: 'AVAILABLE' },
  { responder_id: 8, department_id: 5, name: 'Tech Nair', phone: '+91 95558 88888', responder_type: 'Rescue Worker', availability_status: 'AVAILABLE' },
];

export const vehicles: Vehicle[] = [
  { vehicle_id: 1, department_id: 1, vehicle_number: 'KA-01-P-1001', vehicle_type: 'Patrol Car', availability_status: 'ON_DUTY' },
  { vehicle_id: 2, department_id: 1, vehicle_number: 'KA-01-P-1002', vehicle_type: 'Patrol Car', availability_status: 'AVAILABLE' },
  { vehicle_id: 3, department_id: 2, vehicle_number: 'KA-01-F-2001', vehicle_type: 'Fire Truck', availability_status: 'ON_DUTY' },
  { vehicle_id: 4, department_id: 2, vehicle_number: 'KA-01-F-2002', vehicle_type: 'Fire Truck', availability_status: 'AVAILABLE' },
  { vehicle_id: 5, department_id: 3, vehicle_number: 'KA-01-A-3001', vehicle_type: 'Ambulance', availability_status: 'ON_DUTY' },
  { vehicle_id: 6, department_id: 3, vehicle_number: 'KA-01-A-3002', vehicle_type: 'Ambulance', availability_status: 'AVAILABLE' },
  { vehicle_id: 7, department_id: 4, vehicle_number: 'KA-01-D-4001', vehicle_type: 'Rescue Van', availability_status: 'AVAILABLE' },
  { vehicle_id: 8, department_id: 5, vehicle_number: 'KA-01-E-5001', vehicle_type: 'Disaster Response Unit', availability_status: 'AVAILABLE' },
];

export const locations: Location[] = [
  { location_id: 1, emergency_id: 1, latitude: 12.9716, longitude: 77.5946, address: 'MG Road, near Trinity Circle', city: 'Bangalore', area: 'MG Road', pincode: '560001' },
  { location_id: 2, emergency_id: 2, latitude: 12.9352, longitude: 77.6245, address: 'Koramangala 5th Block, near Sony Signal', city: 'Bangalore', area: 'Koramangala', pincode: '560095' },
  { location_id: 3, emergency_id: 3, latitude: 12.9279, longitude: 77.6271, address: 'HSR Layout, Sector 2, near BDA Complex', city: 'Bangalore', area: 'HSR Layout', pincode: '560102' },
  { location_id: 4, emergency_id: 4, latitude: 12.9698, longitude: 77.7500, address: 'Whitefield Main Road, near Phoenix Mall', city: 'Bangalore', area: 'Whitefield', pincode: '560066' },
  { location_id: 5, emergency_id: 5, latitude: 13.0298, longitude: 77.5664, address: 'Yeshwanthpur, near Metro Station', city: 'Bangalore', area: 'Yeshwanthpur', pincode: '560022' },
  { location_id: 6, emergency_id: 6, latitude: 12.9081, longitude: 77.6476, address: 'Electronic City Phase 1, near Infosys Gate', city: 'Bangalore', area: 'Electronic City', pincode: '560100' },
  { location_id: 7, emergency_id: 7, latitude: 12.9763, longitude: 77.6033, address: 'Residency Road, near Richmond Circle', city: 'Bangalore', area: 'Residency Road', pincode: '560025' },
  { location_id: 8, emergency_id: 8, latitude: 12.9443, longitude: 77.6947, address: 'Sarjapur Road, near Wipro Corporate Office', city: 'Bangalore', area: 'Sarjapur Road', pincode: '560035' },
  { location_id: 9, emergency_id: 9, latitude: 13.0067, longitude: 77.5803, address: 'Malleshwaram 8th Cross', city: 'Bangalore', area: 'Malleshwaram', pincode: '560003' },
  { location_id: 10, emergency_id: 10, latitude: 12.8456, longitude: 77.6603, address: 'Bannerghatta Road, near IIM Bangalore', city: 'Bangalore', area: 'Bannerghatta', pincode: '560076' },
  { location_id: 11, emergency_id: 11, latitude: 12.9916, longitude: 77.5705, address: 'Hebbal Flyover, near Esteem Mall', city: 'Bangalore', area: 'Hebbal', pincode: '560024' },
  { location_id: 12, emergency_id: 12, latitude: 12.9352, longitude: 77.5350, address: 'Kengeri, near R V College of Engineering', city: 'Bangalore', area: 'Kengeri', pincode: '560059' },
];

export const attachments: Attachment[] = [
  { attachment_id: 1, emergency_id: 1, file_name: 'accident_photo.jpg', file_type: 'IMAGE', file_path: '/uploads/accident_photo.jpg', uploaded_at: '2025-09-01T10:05:00Z' },
  { attachment_id: 2, emergency_id: 2, file_name: 'fire_smoke.mp4', file_type: 'VIDEO', file_path: '/uploads/fire_smoke.mp4', uploaded_at: '2025-09-02T14:20:00Z' },
  { attachment_id: 3, emergency_id: 3, file_name: 'medical_injury.jpg', file_type: 'IMAGE', file_path: '/uploads/medical_injury.jpg', uploaded_at: '2025-09-03T09:15:00Z' },
  { attachment_id: 4, emergency_id: 4, file_name: 'flood_street.jpg', file_type: 'IMAGE', file_path: '/uploads/flood_street.jpg', uploaded_at: '2025-09-04T16:30:00Z' },
  { attachment_id: 5, emergency_id: 5, file_name: 'collapse_debris.jpg', file_type: 'IMAGE', file_path: '/uploads/collapse_debris.jpg', uploaded_at: '2025-09-05T11:45:00Z' },
];

export const aiAnalyses: AiAnalysis[] = [
  { analysis_id: 1, emergency_id: 1, detected_type: 'Road Accident', confidence: 94, severity: 'HIGH', priority: 'CRITICAL', analysis_time: '2025-09-01T10:06:00Z', recommended_departments: ['POLICE', 'MEDICAL'] },
  { analysis_id: 2, emergency_id: 2, detected_type: 'Fire', confidence: 91, severity: 'CRITICAL', priority: 'CRITICAL', analysis_time: '2025-09-02T14:21:00Z', recommended_departments: ['FIRE'] },
  { analysis_id: 3, emergency_id: 3, detected_type: 'Medical Emergency', confidence: 88, severity: 'HIGH', priority: 'HIGH', analysis_time: '2025-09-03T09:16:00Z', recommended_departments: ['MEDICAL'] },
  { analysis_id: 4, emergency_id: 4, detected_type: 'Flood', confidence: 86, severity: 'HIGH', priority: 'HIGH', analysis_time: '2025-09-04T16:31:00Z', recommended_departments: ['DISASTER'] },
  { analysis_id: 5, emergency_id: 5, detected_type: 'Building Collapse', confidence: 90, severity: 'CRITICAL', priority: 'CRITICAL', analysis_time: '2025-09-05T11:46:00Z', recommended_departments: ['DISASTER', 'MEDICAL'] },
  { analysis_id: 6, emergency_id: 6, detected_type: 'Electrical Accident', confidence: 85, severity: 'MEDIUM', priority: 'HIGH', analysis_time: '2025-09-06T08:21:00Z', recommended_departments: ['ELECTRICITY', 'FIRE'] },
  { analysis_id: 7, emergency_id: 7, detected_type: 'Crime', confidence: 82, severity: 'HIGH', priority: 'HIGH', analysis_time: '2025-09-06T19:21:00Z', recommended_departments: ['POLICE'] },
  { analysis_id: 8, emergency_id: 8, detected_type: 'Road Accident', confidence: 89, severity: 'MEDIUM', priority: 'NORMAL', analysis_time: '2025-09-07T12:31:00Z', recommended_departments: ['POLICE'] },
  { analysis_id: 9, emergency_id: 9, detected_type: 'Natural Disaster', confidence: 87, severity: 'CRITICAL', priority: 'CRITICAL', analysis_time: '2025-09-07T15:46:00Z', recommended_departments: ['DISASTER', 'MEDICAL'] },
  { analysis_id: 10, emergency_id: 10, detected_type: 'Medical Emergency', confidence: 92, severity: 'HIGH', priority: 'HIGH', analysis_time: '2025-09-08T07:16:00Z', recommended_departments: ['MEDICAL'] },
  { analysis_id: 11, emergency_id: 11, detected_type: 'Road Accident', confidence: 83, severity: 'MEDIUM', priority: 'NORMAL', analysis_time: '2025-09-08T18:21:00Z', recommended_departments: ['POLICE', 'MEDICAL'] },
  { analysis_id: 12, emergency_id: 12, detected_type: 'Flood', confidence: 80, severity: 'LOW', priority: 'LOW', analysis_time: '2025-09-09T06:31:00Z', recommended_departments: ['DISASTER'] },
];

export const dispatches: Dispatch[] = [
  { dispatch_id: 1, emergency_id: 1, responder_id: 1, vehicle_id: 1, department_id: 1, dispatch_time: '2025-09-01T10:10:00Z', arrival_time: '2025-09-01T10:25:00Z', dispatch_status: 'ON_SCENE' },
  { dispatch_id: 2, emergency_id: 2, responder_id: 3, vehicle_id: 3, department_id: 2, dispatch_time: '2025-09-02T14:25:00Z', arrival_time: '2025-09-02T14:38:00Z', dispatch_status: 'ON_SCENE' },
  { dispatch_id: 3, emergency_id: 3, responder_id: 5, vehicle_id: 5, department_id: 3, dispatch_time: '2025-09-03T09:20:00Z', arrival_time: '2025-09-03T09:35:00Z', dispatch_status: 'ON_SCENE' },
  { dispatch_id: 4, emergency_id: 4, responder_id: 7, vehicle_id: 7, department_id: 4, dispatch_time: '2025-09-04T16:35:00Z', arrival_time: null, dispatch_status: 'EN_ROUTE' },
  { dispatch_id: 5, emergency_id: 5, responder_id: 7, vehicle_id: 7, department_id: 4, dispatch_time: '2025-09-05T11:50:00Z', arrival_time: '2025-09-05T12:10:00Z', dispatch_status: 'ON_SCENE' },
];

export const statusUpdates: StatusUpdate[] = [
  { update_id: 1, emergency_id: 1, status_id: 1, updated_by: 'Rahul Sharma', remarks: 'Emergency reported by citizen', update_time: '2025-09-01T10:05:00Z' },
  { update_id: 2, emergency_id: 1, status_id: 2, updated_by: 'System Administrator', remarks: 'Report verified by admin', update_time: '2025-09-01T10:08:00Z' },
  { update_id: 3, emergency_id: 1, status_id: 3, updated_by: 'System Administrator', remarks: 'Dispatched to Police + Medical', update_time: '2025-09-01T10:10:00Z' },
  { update_id: 4, emergency_id: 1, status_id: 4, updated_by: 'System Administrator', remarks: 'Inspector Verma assigned', update_time: '2025-09-01T10:12:00Z' },
  { update_id: 5, emergency_id: 1, status_id: 5, updated_by: 'Inspector Verma', remarks: 'On scene, response in progress', update_time: '2025-09-01T10:25:00Z' },
  { update_id: 6, emergency_id: 1, status_id: 6, updated_by: 'Inspector Verma', remarks: 'Situation resolved, area secured', update_time: '2025-09-01T11:00:00Z' },
  { update_id: 7, emergency_id: 2, status_id: 1, updated_by: 'Priya Patel', remarks: 'Emergency reported by citizen', update_time: '2025-09-02T14:20:00Z' },
  { update_id: 8, emergency_id: 2, status_id: 2, updated_by: 'System Administrator', remarks: 'Report verified by admin', update_time: '2025-09-02T14:23:00Z' },
  { update_id: 9, emergency_id: 2, status_id: 3, updated_by: 'System Administrator', remarks: 'Dispatched to Fire Department', update_time: '2025-09-02T14:25:00Z' },
  { update_id: 10, emergency_id: 2, status_id: 5, updated_by: 'Captain Singh', remarks: 'Firefighting in progress', update_time: '2025-09-02T14:38:00Z' },
];

export const notifications: Notification[] = [
  { notification_id: 1, user_id: 1, emergency_id: 1, message: 'Your emergency report #001 has been verified by admin.', notification_type: 'VERIFICATION', is_read: false, created_at: '2025-09-01T10:08:00Z' },
  { notification_id: 2, user_id: 1, emergency_id: 1, message: 'Inspector Verma has been assigned to your emergency #001.', notification_type: 'ASSIGNMENT', is_read: false, created_at: '2025-09-01T10:12:00Z' },
  { notification_id: 3, user_id: 1, emergency_id: 1, message: 'Response is now in progress for emergency #001.', notification_type: 'STATUS_CHANGE', is_read: true, created_at: '2025-09-01T10:25:00Z' },
  { notification_id: 4, user_id: 1, emergency_id: 1, message: 'Emergency #001 has been resolved. Please share your feedback.', notification_type: 'RESOLUTION', is_read: false, created_at: '2025-09-01T11:00:00Z' },
  { notification_id: 5, user_id: 2, emergency_id: 2, message: 'Your emergency report #002 has been verified by admin.', notification_type: 'VERIFICATION', is_read: false, created_at: '2025-09-02T14:23:00Z' },
  { notification_id: 6, user_id: 2, emergency_id: 2, message: 'Firefighting is in progress for emergency #002.', notification_type: 'STATUS_CHANGE', is_read: false, created_at: '2025-09-02T14:38:00Z' },
  { notification_id: 7, user_id: 3, emergency_id: 3, message: 'AI analysis complete for emergency #003: Medical Emergency detected (88% confidence).', notification_type: 'AI_ANALYSIS', is_read: true, created_at: '2025-09-03T09:16:00Z' },
  { notification_id: 8, user_id: 1, emergency_id: 1, message: 'AI analysis complete for emergency #001: Road Accident detected (94% confidence).', notification_type: 'AI_ANALYSIS', is_read: true, created_at: '2025-09-01T10:06:00Z' },
];

export const feedbacks: Feedback[] = [
  { feedback_id: 1, user_id: 1, emergency_id: 1, rating: 5, comment: 'Very fast response. Police and ambulance arrived within 20 minutes. Thank you!', created_at: '2025-09-01T11:30:00Z' },
  { feedback_id: 2, user_id: 2, emergency_id: 2, rating: 4, comment: 'Firefighters were quick and professional. Good work.', created_at: '2025-09-02T15:30:00Z' },
];

export const emergencyReports: EmergencyReport[] = [
  {
    emergency_id: 1, user_id: 1, emergency_type_id: 1, location_id: 1, status_id: 6,
    description: 'Two-car collision at MG Road near Trinity Circle. One person appears injured. Traffic is blocked.',
    priority: 'CRITICAL', created_at: '2025-09-01T10:05:00Z',
    citizen_name: 'Rahul Sharma', type_name: 'Road Accident', status_name: 'RESOLVED',
    location: locations[0], ai_analysis: aiAnalyses[0], attachments: [attachments[0]],
    dispatches: [dispatches[0]], department_name: 'Police + Medical', responder_name: 'Inspector Verma', vehicle_number: 'KA-01-P-1001',
  },
  {
    emergency_id: 2, user_id: 2, emergency_type_id: 2, location_id: 2, status_id: 5,
    description: 'Fire broke out in a commercial building near Sony Signal. Heavy smoke visible from the street.',
    priority: 'CRITICAL', created_at: '2025-09-02T14:20:00Z',
    citizen_name: 'Priya Patel', type_name: 'Fire', status_name: 'IN_PROGRESS',
    location: locations[1], ai_analysis: aiAnalyses[1], attachments: [attachments[1]],
    dispatches: [dispatches[1]], department_name: 'Fire Department', responder_name: 'Captain Singh', vehicle_number: 'KA-01-F-2001',
  },
  {
    emergency_id: 3, user_id: 3, emergency_type_id: 3, location_id: 3, status_id: 5,
    description: 'Elderly person collapsed near HSR BDA Complex. Conscious but needs immediate medical attention.',
    priority: 'HIGH', created_at: '2025-09-03T09:15:00Z',
    citizen_name: 'Amit Kumar', type_name: 'Medical Emergency', status_name: 'IN_PROGRESS',
    location: locations[2], ai_analysis: aiAnalyses[2], attachments: [attachments[2]],
    dispatches: [dispatches[2]], department_name: 'Ambulance / Medical Dept', responder_name: 'Dr. Mehta', vehicle_number: 'KA-01-A-3001',
  },
  {
    emergency_id: 4, user_id: 4, emergency_type_id: 4, location_id: 4, status_id: 4,
    description: 'Heavy flooding on Whitefield Main Road near Phoenix Mall. Water level rising, vehicles stuck.',
    priority: 'HIGH', created_at: '2025-09-04T16:30:00Z',
    citizen_name: 'Sneha Reddy', type_name: 'Flood', status_name: 'RESPONDER_ASSIGNED',
    location: locations[3], ai_analysis: aiAnalyses[3], attachments: [attachments[3]],
    dispatches: [dispatches[3]], department_name: 'Disaster Management Dept', responder_name: 'Rescue Lead Das', vehicle_number: 'KA-01-D-4001',
  },
  {
    emergency_id: 5, user_id: 1, emergency_type_id: 7, location_id: 5, status_id: 5,
    description: 'Portion of old building collapsed near Yeshwanthpur Metro. People may be trapped under debris.',
    priority: 'CRITICAL', created_at: '2025-09-05T11:45:00Z',
    citizen_name: 'Rahul Sharma', type_name: 'Building Collapse', status_name: 'IN_PROGRESS',
    location: locations[4], ai_analysis: aiAnalyses[4], attachments: [attachments[4]],
    dispatches: [dispatches[4]], department_name: 'Disaster Management Dept', responder_name: 'Rescue Lead Das', vehicle_number: 'KA-01-D-4001',
  },
  {
    emergency_id: 6, user_id: 2, emergency_type_id: 6, location_id: 6, status_id: 3,
    description: 'Transformer burst near Infosys Gate, Electronic City. Sparks flying, risk of fire.',
    priority: 'HIGH', created_at: '2025-09-06T08:20:00Z',
    citizen_name: 'Priya Patel', type_name: 'Electrical Accident', status_name: 'DISPATCHED',
    location: locations[5], ai_analysis: aiAnalyses[5], attachments: [],
    dispatches: [], department_name: 'Electricity + Fire', responder_name: '—', vehicle_number: '—',
  },
  {
    emergency_id: 7, user_id: 3, emergency_type_id: 8, location_id: 7, status_id: 2,
    description: 'Chain snatching incident on Residency Road near Richmond Circle. Suspect fled towards Brigade Road.',
    priority: 'HIGH', created_at: '2025-09-06T19:20:00Z',
    citizen_name: 'Amit Kumar', type_name: 'Crime', status_name: 'VERIFIED',
    location: locations[6], ai_analysis: aiAnalyses[6], attachments: [],
    dispatches: [], department_name: '—', responder_name: '—', vehicle_number: '—',
  },
  {
    emergency_id: 8, user_id: 4, emergency_type_id: 1, location_id: 8, status_id: 2,
    description: 'Minor bike skid on Sarjapur Road near Wipro. Rider has minor injuries, traffic slow.',
    priority: 'NORMAL', created_at: '2025-09-07T12:30:00Z',
    citizen_name: 'Sneha Reddy', type_name: 'Road Accident', status_name: 'VERIFIED',
    location: locations[7], ai_analysis: aiAnalyses[7], attachments: [],
    dispatches: [], department_name: '—', responder_name: '—', vehicle_number: '—',
  },
  {
    emergency_id: 9, user_id: 1, emergency_type_id: 5, location_id: 9, status_id: 1,
    description: 'Tremors felt in Malleshwaram area. Cracks visible in some older buildings. Residents panicking.',
    priority: 'CRITICAL', created_at: '2025-09-07T15:45:00Z',
    citizen_name: 'Rahul Sharma', type_name: 'Natural Disaster', status_name: 'REPORTED',
    location: locations[8], ai_analysis: aiAnalyses[8], attachments: [],
    dispatches: [], department_name: '—', responder_name: '—', vehicle_number: '—',
  },
  {
    emergency_id: 10, user_id: 2, emergency_type_id: 3, location_id: 10, status_id: 1,
    description: 'Person experiencing chest pain near IIM Bangalore gate. Needs urgent medical help.',
    priority: 'HIGH', created_at: '2025-09-08T07:15:00Z',
    citizen_name: 'Priya Patel', type_name: 'Medical Emergency', status_name: 'REPORTED',
    location: locations[9], ai_analysis: aiAnalyses[9], attachments: [],
    dispatches: [], department_name: '—', responder_name: '—', vehicle_number: '—',
  },
  {
    emergency_id: 11, user_id: 3, emergency_type_id: 1, location_id: 11, status_id: 1,
    description: 'Multi-vehicle pileup on Hebbal Flyover. Several vehicles damaged, traffic at standstill.',
    priority: 'NORMAL', created_at: '2025-09-08T18:20:00Z',
    citizen_name: 'Amit Kumar', type_name: 'Road Accident', status_name: 'REPORTED',
    location: locations[10], ai_analysis: aiAnalyses[10], attachments: [],
    dispatches: [], department_name: '—', responder_name: '—', vehicle_number: '—',
  },
  {
    emergency_id: 12, user_id: 4, emergency_type_id: 4, location_id: 12, status_id: 1,
    description: 'Waterlogging in Kengeri near RV College. Minor flooding, vehicles managing to pass slowly.',
    priority: 'LOW', created_at: '2025-09-09T06:30:00Z',
    citizen_name: 'Sneha Reddy', type_name: 'Flood', status_name: 'REPORTED',
    location: locations[11], ai_analysis: aiAnalyses[11], attachments: [],
    dispatches: [], department_name: '—', responder_name: '—', vehicle_number: '—',
  },
];
