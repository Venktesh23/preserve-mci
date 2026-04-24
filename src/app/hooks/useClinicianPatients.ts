import { useState, useCallback, useMemo, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

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

export interface ClinicianNote {
  id: string;
  patientId: string;
  clinicianId: string;
  note: string;
  timestamp: string;
  type: 'general' | 'concern' | 'progress' | 'follow-up' | 'recommendation';
  read?: boolean;
}


export interface PatientStats {
  totalPatients: number;
  activePatients: number;
  inactivePatients: number;
  patientsNeedingAttention: number;
  averageAdherence: number;
  averageSleepQuality: number;
}

/* ──────────────────────── Demo sleep data (for display when no real logs exist) ──────────────────────── */

export const DEMO_PATIENT_ID = 'demo_patient_001';

export function getDemoSleepLogs() {
  const now = new Date();
  const hours = [5.8, 6.2, 6.5, 6.1, 7.0, 7.3, 6.8, 6.4, 6.9, 7.2, 7.0, 6.7, 7.1, 7.4, 7.3, 6.8, 7.5, 7.2, 7.6, 7.1, 7.4, 7.8, 7.3, 7.6, 7.2, 7.5, 7.8, 7.4, 7.6, 7.9];
  const quality = [2, 3, 3, 2, 3, 4, 3, 3, 4, 4, 3, 3, 4, 4, 4, 3, 5, 4, 4, 4, 4, 5, 4, 4, 4, 5, 5, 4, 4, 5];
  return hours.map((h, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (hours.length - 1 - i));
    return { date: date.toISOString(), hoursSlept: h, sleepQuality: quality[i] };
  });
}

/* ──────────────────────── Hook ──────────────────────── */

export function useClinicianPatients() {
  const [patients, setPatients] = useState<ClinicianPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<ClinicianNote[]>([]);
  const [sleepQualityMap, setSleepQualityMap] = useState<Map<string, number[]>>(new Map());

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        setPatients([]);
        return;
      }

      // Fetch all active assignments for this clinician
      const { data: assignments, error: assignError } = await supabase
        .from('clinician_patients')
        .select('patient_id, assigned_at, status, risk_level, notes')
        .eq('clinician_id', userData.user.id)
        .eq('status', 'active');

      if (assignError) throw assignError;
      if (!assignments || assignments.length === 0) {
        setPatients([]);
        return;
      }

      const patientIds = assignments.map((a) => a.patient_id);

      // Fetch profile details for those patients
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email, age, last_active')
        .in('id', patientIds);

      if (profileError) throw profileError;

      // Fetch care partner names for each patient
      const { data: caregiverLinks } = await supabase
        .from('caregiver_patients')
        .select('patient_id, caregiver_id')
        .in('patient_id', patientIds);

      const caregiverIds = (caregiverLinks ?? []).map((c) => c.caregiver_id);
      const { data: caregiverProfiles } = caregiverIds.length > 0
        ? await supabase.from('profiles').select('id, full_name').in('id', caregiverIds)
        : { data: [] };

      const caregiverProfileMap = new Map((caregiverProfiles ?? []).map((p) => [p.id, p.full_name]));
      const patientCaregiverMap = new Map(
        (caregiverLinks ?? []).map((c) => [c.patient_id, caregiverProfileMap.get(c.caregiver_id)])
      );

      // Fetch average sleep quality per patient
      const { data: sleepData } = await supabase
        .from('sleep_logs')
        .select('user_id, sleep_quality')
        .in('user_id', patientIds);

      const sleepQualityMap = new Map<string, number[]>();
      for (const row of sleepData ?? []) {
        if (!sleepQualityMap.has(row.user_id)) sleepQualityMap.set(row.user_id, []);
        sleepQualityMap.get(row.user_id)!.push(row.sleep_quality);
      }

      const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

      const mapped: ClinicianPatient[] = assignments.map((a) => {
        const profile = profileMap.get(a.patient_id);
        return {
          id: a.patient_id,
          name: profile?.full_name || 'Unknown Patient',
          email: profile?.email || '',
          age: profile?.age ?? 0,
          dateEnrolled: a.assigned_at,
          lastActive: profile?.last_active ?? a.assigned_at,
          riskLevel: (a.risk_level as 'low' | 'medium' | 'high') ?? 'medium',
          notes: a.notes ?? undefined,
          carePartnerName: patientCaregiverMap.get(a.patient_id) ?? undefined,
        };
      });

      setPatients(mapped);
      // Store sleep quality map for stats
      setSleepQualityMap(sleepQualityMap);
    } catch (e) {
      console.error('Failed to fetch patients:', e);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNotes = useCallback(async (clinicianId: string) => {
    const { data } = await supabase
      .from('clinician_notes')
      .select('*')
      .eq('clinician_id', clinicianId)
      .order('created_at', { ascending: false });
    setNotes((data ?? []).map((r) => ({
      id: r.id,
      patientId: r.patient_id,
      clinicianId: r.clinician_id,
      note: r.note,
      timestamp: r.created_at,
      type: r.type,
      read: r.read ?? false,
    })));
  }, []);

  useEffect(() => {
    (async () => {
      await fetchPatients();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) await fetchNotes(user.id);
    })();
  }, [fetchPatients, fetchNotes]);

  const addPatient = useCallback(
    async (patientData: ClinicianPatient) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) throw new Error('Not authenticated');

      const { error } = await supabase.from('clinician_patients').insert({
        clinician_id: userData.user.id,
        patient_id: patientData.id,
        status: 'active',
        risk_level: patientData.riskLevel ?? 'medium',
      });

      if (error) throw error;

      await fetchPatients();
      return patientData;
    },
    [fetchPatients]
  );

  const updatePatient = useCallback(
    async (patientId: string, updates: Partial<ClinicianPatient>) => {
      setPatients((prev) =>
        prev.map((p) => (p.id === patientId ? { ...p, ...updates } : p))
      );

      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) return;

        const cpUpdates: Record<string, unknown> = {};
        if (updates.riskLevel !== undefined) cpUpdates.risk_level = updates.riskLevel;
        if (updates.notes !== undefined) cpUpdates.notes = updates.notes;

        if (Object.keys(cpUpdates).length > 0) {
          const { error } = await supabase
            .from('clinician_patients')
            .update(cpUpdates)
            .eq('clinician_id', userData.user.id)
            .eq('patient_id', patientId);

          if (error) throw error;
        }
      } catch (e) {
        console.error('Failed to update patient:', e);
        await fetchPatients();
      }
    },
    [fetchPatients]
  );

  const addNote = useCallback(
    async (note: Omit<ClinicianNote, 'id' | 'timestamp'>) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return null;

      const { data, error } = await supabase
        .from('clinician_notes')
        .insert({
          clinician_id: note.clinicianId || userData.user.id,
          patient_id: note.patientId,
          note: note.note,
          type: note.type,
          read: false,
        })
        .select()
        .single();

      if (error) { console.error('Failed to save note:', error); return null; }

      const newNote: ClinicianNote = {
        id: data.id,
        patientId: data.patient_id,
        clinicianId: data.clinician_id,
        note: data.note,
        timestamp: data.created_at,
        type: data.type,
        read: false,
      };
      setNotes((prev) => [newNote, ...prev]);
      return newNote;
    },
    []
  );

  const markNoteAsRead = useCallback(async (noteId: string) => {
    await supabase.from('clinician_notes').update({ read: true }).eq('id', noteId);
    setNotes((prev) => prev.map((n) => (n.id === noteId ? { ...n, read: true } : n)));
  }, []);

  const getPatientNotes = useCallback(
    (patientId: string) => notes.filter((n) => n.patientId === patientId),
    [notes]
  );

  const getPatientById = useCallback(
    (patientId: string) => patients.find((p) => p.id === patientId),
    [patients]
  );

  const stats: PatientStats = useMemo(() => {
    const now = new Date();
    const total = patients.length;
    const active = patients.filter((p) => {
      const days = Math.floor(
        (now.getTime() - new Date(p.lastActive).getTime()) / 86400000
      );
      return days <= 7;
    }).length;
    const inactive = total - active;
    const needingAttention = patients.filter((p) => {
      const days = Math.floor(
        (now.getTime() - new Date(p.lastActive).getTime()) / 86400000
      );
      return days > 3 || p.riskLevel === 'high';
    }).length;

    const allQualities = [...sleepQualityMap.values()].flat();
    const averageSleepQuality = allQualities.length > 0
      ? Math.round((allQualities.reduce((s, q) => s + q, 0) / allQualities.length) * 10) / 10
      : 0;

    return {
      totalPatients: total,
      activePatients: active,
      inactivePatients: inactive,
      patientsNeedingAttention: needingAttention,
      averageAdherence: total > 0 ? Math.round((active / total) * 100) : 0,
      averageSleepQuality,
    };
  }, [patients, sleepQualityMap]);

  const getPatientsByRisk = useCallback(
    (riskLevel: 'low' | 'medium' | 'high') =>
      patients.filter((p) => p.riskLevel === riskLevel),
    [patients]
  );

  const searchPatients = useCallback(
    (query: string) => {
      const q = query.toLowerCase();
      return patients.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q)
      );
    },
    [patients]
  );

  const searchUnassignedPatients = useCallback(async (query: string) => {
    if (!query.trim()) return [];
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role')
        .eq('role', 'patient')
        .ilike('full_name', `%${query}%`)
        .limit(10);

      if (error) throw error;

      return (data ?? []).map((p) => ({
        id: p.id,
        name: p.full_name,
        email: p.email,
        age: 0,
        dateEnrolled: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        riskLevel: 'low' as const,
      }));
    } catch (e) {
      console.error('Error searching unassigned patients:', e);
      return [];
    }
  }, []);

  return {
    patients,
    loading,
    stats,
    addPatient,
    updatePatient,
    getPatientById,
    getPatientsByRisk,
    searchPatients,
    searchUnassignedPatients,
    addNote,
    getPatientNotes,
    markNoteAsRead,
    notes,
    refresh: fetchPatients,
  };
}

