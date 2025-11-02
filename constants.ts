
import { Patient, PatientStatus, ClinicInfo } from './types';

export const INITIAL_CLINIC_INFO: ClinicInfo = {
    name: "HealWell Physiotherapy",
    logo: "", // Will be empty by default, user can upload
};

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: `PID-${Math.random().toString(36).substr(2, 9)}`,
    name: "John Doe",
    email: "john.doe@example.com",
    dateAdded: "2023-10-26T10:00:00Z",
    status: PatientStatus.InProgress,
    tags: ["Neck Pain", "Posture Correction"],
    exercises: [
      { id: 'ex1', name: "Cervical Retraction", sets: "3", reps: "10", duration: "5s hold", notes: "Keep chin tucked." },
      { id: 'ex2', name: "Scapular Squeezes", sets: "3", reps: "15", duration: "-", notes: "Focus on middle back." },
    ],
    progress: [
        { id: 'p1', date: '2023-10-27T10:00:00Z', painLevel: 5, completed: true, notes: 'Felt a good stretch.', author: 'Patient'}
    ],
  },
  {
    id: `PID-${Math.random().toString(36).substr(2, 9)}`,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    dateAdded: "2023-10-20T14:30:00Z",
    status: PatientStatus.Recovered,
    tags: ["ACL Tear", "Sports Injury"],
    exercises: [
      { id: 'ex1', name: "Quad Sets", sets: "4", reps: "10", duration: "10s hold", notes: "Press knee down firmly." },
      { id: 'ex2', name: "Heel Slides", sets: "3", reps: "20", duration: "-", notes: "Slide heel towards hip." },
    ],
    progress: [],
  },
  {
    id: `PID-${Math.random().toString(36).substr(2, 9)}`,
    name: "Mike Johnson",
    email: "mike.j@example.com",
    dateAdded: "2023-09-15T09:00:00Z",
    status: PatientStatus.OnHold,
    tags: ["Low Back Pain"],
    exercises: [
        { id: 'ex1', name: "Cat-Cow Stretch", sets: "2", reps: "10", duration: "-", notes: "Sync with breathing." },
    ],
    progress: [],
  },
];
