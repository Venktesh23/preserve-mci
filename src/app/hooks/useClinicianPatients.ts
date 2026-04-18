import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../utils/storage';
import { SleepLogData } from './useSleepLogs';

/**
 * Patient Data Structure for Clinician View
 */
export interface ClinicianPatient {
  id: string;
  name: string;
  email: string;
  age: number;
  dateEnrolled: string;
  lastActive: string;
  carePartnerName?: string;
  riskLevel: 'low' | 'medium' | 'high';
  notes?: string;
}

/**
 * Clinician Patients Storage
 */
export interface ClinicianPatientsStorage {
  patients: ClinicianPatient[];
}

/**
 * Clinician Note
 */
export interface ClinicianNote {
  id: string;
  patientId: string;
  clinicianId: string;
  note: string;
  timestamp: string;
  type: 'general' | 'concern' | 'progress' | 'follow-up';
}

/**
 * Clinician Notes Storage
 */
export interface ClinicianNotesStorage {
  notes: ClinicianNote[];
}

/**
 * Patient Statistics for Clinician View
 */
export interface PatientStats {
  totalPatients: number;
  activePatients: number;
  inactivePatients: number;
  patientsNeedingAttention: number;
  averageAdherence: number;
  averageSleepQuality: number;
}

/**
 * Hook for managing clinician's patient data
 */
export function useClinicianPatients() {
  const [patientsStorage, setPatientsStorage] = useLocalStorage<ClinicianPatientsStorage>(
    STORAGE_KEYS.CLINICIAN_PATIENTS,
    { patients: generateMockPatients() }
  );

  const [notesStorage, setNotesStorage] = useLocalStorage<ClinicianNotesStorage>(
    STORAGE_KEYS.CLINICIAN_NOTES,
    { notes: [] }
  );

  /**
   * Add a new patient
   */
  const addPatient = useCallback(
    (patientData: Omit<ClinicianPatient, 'id' | 'dateEnrolled'>) => {
      const newPatient: ClinicianPatient = {
        ...patientData,
        id: generateId(),
        dateEnrolled: new Date().toISOString(),
      };

      setPatientsStorage((prev) => ({
        patients: [...prev.patients, newPatient],
      }));

      return newPatient;
    },
    [setPatientsStorage]
  );

  /**
   * Update patient data
   */
  const updatePatient = useCallback(
    (patientId: string, updates: Partial<ClinicianPatient>) => {
      setPatientsStorage((prev) => ({
        patients: prev.patients.map((patient) =>
          patient.id === patientId ? { ...patient, ...updates } : patient
        ),
      }));
    },
    [setPatientsStorage]
  );

  /**
   * Add a note for a patient
   */
  const addNote = useCallback(
    (note: Omit<ClinicianNote, 'id' | 'timestamp'>) => {
      const newNote: ClinicianNote = {
        ...note,
        id: generateId(),
        timestamp: new Date().toISOString(),
      };

      setNotesStorage((prev) => ({
        notes: [newNote, ...prev.notes],
      }));

      return newNote;
    },
    [setNotesStorage]
  );

  /**
   * Get notes for a specific patient
   */
  const getPatientNotes = useCallback(
    (patientId: string) => {
      return notesStorage.notes.filter((note) => note.patientId === patientId);
    },
    [notesStorage.notes]
  );

  /**
   * Get patient by ID
   */
  const getPatientById = useCallback(
    (patientId: string) => {
      return patientsStorage.patients.find((p) => p.id === patientId);
    },
    [patientsStorage.patients]
  );

  /**
   * Calculate aggregate statistics
   */
  const stats: PatientStats = useMemo(() => {
    const patients = patientsStorage.patients;
    const totalPatients = patients.length;

    // Consider active if last active within 7 days
    const now = new Date();
    const activePatients = patients.filter((p) => {
      const lastActive = new Date(p.lastActive);
      const daysSince = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
      return daysSince <= 7;
    }).length;

    const inactivePatients = totalPatients - activePatients;

    // Patients needing attention (inactive > 3 days or high risk)
    const patientsNeedingAttention = patients.filter((p) => {
      const lastActive = new Date(p.lastActive);
      const daysSince = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
      return daysSince > 3 || p.riskLevel === 'high';
    }).length;

    // Mock adherence and sleep quality (in real app, would calculate from actual data)
    const averageAdherence = 73; // percentage
    const averageSleepQuality = 68; // percentage

    return {
      totalPatients,
      activePatients,
      inactivePatients,
      patientsNeedingAttention,
      averageAdherence,
      averageSleepQuality,
    };
  }, [patientsStorage.patients]);

  /**
   * Get patients by risk level
   */
  const getPatientsByRisk = useCallback(
    (riskLevel: 'low' | 'medium' | 'high') => {
      return patientsStorage.patients.filter((p) => p.riskLevel === riskLevel);
    },
    [patientsStorage.patients]
  );

  /**
   * Search patients
   */
  const searchPatients = useCallback(
    (query: string) => {
      const lowerQuery = query.toLowerCase();
      return patientsStorage.patients.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.email.toLowerCase().includes(lowerQuery)
      );
    },
    [patientsStorage.patients]
  );

  return {
    // Data
    patients: patientsStorage.patients,
    stats,

    // Patient actions
    addPatient,
    updatePatient,
    getPatientById,
    getPatientsByRisk,
    searchPatients,

    // Notes
    addNote,
    getPatientNotes,
    notes: notesStorage.notes,
  };
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate mock patients for demo
 */
function generateMockPatients(): ClinicianPatient[] {
  const names = [
    { name: 'Margaret Johnson', age: 72, risk: 'low' as const },
    { name: 'Robert Chen', age: 68, risk: 'medium' as const },
    { name: 'Patricia Williams', age: 75, risk: 'high' as const },
    { name: 'James Miller', age: 70, risk: 'low' as const },
    { name: 'Linda Davis', age: 73, risk: 'medium' as const },
    { name: 'Michael Brown', age: 69, risk: 'low' as const },
    { name: 'Barbara Wilson', age: 76, risk: 'high' as const },
    { name: 'William Garcia', age: 71, risk: 'medium' as const },
  ];

  const now = new Date();

  return names.map((person, index) => {
    // Vary last active dates
    const daysAgo = Math.floor(Math.random() * 10);
    const lastActive = new Date(now);
    lastActive.setDate(lastActive.getDate() - daysAgo);

    // Enrollment dates in past 3 months
    const enrolledDaysAgo = 30 + Math.floor(Math.random() * 60);
    const dateEnrolled = new Date(now);
    dateEnrolled.setDate(dateEnrolled.getDate() - enrolledDaysAgo);

    return {
      id: `patient_${index + 1}`,
      name: person.name,
      email: `${person.name.toLowerCase().replace(' ', '.')}@example.com`,
      age: person.age,
      dateEnrolled: dateEnrolled.toISOString(),
      lastActive: lastActive.toISOString(),
      carePartnerName: Math.random() > 0.3 ? 'Care Partner' : undefined,
      riskLevel: person.risk,
    };
  });
}
