// ============================================================
// SIMULATED AI ANALYSIS SERVICE
// For the prototype, this module simulates an AI model that
// analyzes emergency reports and returns predictions.
//
// Future architecture:
//   Java Spring Boot → REST API → Python AI Service → ML Model
//   → Prediction → Java Backend → MySQL
//
// The function signature is designed so that the simulated
// logic can be replaced with a real fetch() to a Python AI
// REST API without changing any calling code.
// ============================================================

import { emergencyTypes } from '@/data/mockData';
import type { AiAnalysis, DepartmentType, EmergencyTypeName, Severity, Priority } from '@/types/models';

// Predefined AI prediction rules — one per emergency type.
// In production these would come from a trained ML model.
const aiRules: Record<EmergencyTypeName, {
  confidence: number;
  severity: Severity;
  priority: Priority;
  departments: DepartmentType[];
}> = {
  'Road Accident':        { confidence: 94, severity: 'HIGH',     priority: 'CRITICAL', departments: ['POLICE', 'MEDICAL'] },
  'Fire':                 { confidence: 91, severity: 'CRITICAL', priority: 'CRITICAL', departments: ['FIRE'] },
  'Medical Emergency':    { confidence: 88, severity: 'HIGH',     priority: 'HIGH',     departments: ['MEDICAL'] },
  'Flood':                { confidence: 86, severity: 'HIGH',     priority: 'HIGH',     departments: ['DISASTER'] },
  'Natural Disaster':     { confidence: 87, severity: 'CRITICAL', priority: 'CRITICAL', departments: ['DISASTER', 'MEDICAL'] },
  'Electrical Accident':  { confidence: 85, severity: 'MEDIUM',   priority: 'HIGH',     departments: ['ELECTRICITY', 'FIRE'] },
  'Building Collapse':    { confidence: 90, severity: 'CRITICAL', priority: 'CRITICAL', departments: ['DISASTER', 'MEDICAL'] },
  'Crime':                { confidence: 82, severity: 'HIGH',     priority: 'HIGH',     departments: ['POLICE'] },
};

export function simulateAiAnalysis(emergencyTypeId: number): AiAnalysis | null {
  const type = emergencyTypes.find((t) => t.emergency_type_id === emergencyTypeId);
  if (!type) return null;

  const rule = aiRules[type.type_name];
  // Small variance so results feel realistic but stay in range
  const variance = Math.floor(Math.random() * 5) - 2;
  const confidence = Math.min(99, Math.max(75, rule.confidence + variance));

  return {
    analysis_id: Date.now(),
    emergency_id: 0, // set by caller
    detected_type: type.type_name,
    confidence,
    severity: rule.severity,
    priority: rule.priority,
    analysis_time: new Date().toISOString(),
    recommended_departments: rule.departments,
  };
}

export function getAiRule(typeName: EmergencyTypeName) {
  return aiRules[typeName];
}
