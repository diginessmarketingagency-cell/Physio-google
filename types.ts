
export enum PatientStatus {
  InProgress = "In Progress",
  Recovered = "Recovered",
  OnHold = "On Hold",
}

export enum SortOption {
    DateNewest = "Date Added (Newest)",
    DateOldest = "Date Added (Oldest)",
    NameAZ = "Name (A-Z)",
    Status = "Status",
}

export interface Exercise {
  id: string;
  name: string;
  sets: string;
  reps: string;
  duration: string;
  notes: string;
}

export interface ProgressLog {
  id: string;
  date: string;
  painLevel: number;
  completed: boolean;
  notes: string;
  author: 'Doctor' | 'Patient';
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  dateAdded: string;
  status: PatientStatus;
  tags: string[];
  exercises: Exercise[];
  progress: ProgressLog[];
}

export interface ClinicInfo {
  name: string;
  logo: string; // base64 string
}
