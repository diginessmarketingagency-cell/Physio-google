
import React from 'react';
import { Patient, ProgressLog } from '../types';
import ExerciseChart from './ExerciseChart';
import ProgressTracker from './ProgressTracker';
import { FileTextIcon } from './icons';

interface PatientPublicViewProps {
  patient: Patient | undefined;
  clinicName: string;
  onUpdateProgress: (patientId: string, progressLog: Omit<ProgressLog, 'id' | 'date' | 'author'>) => void;
}

const PatientPublicView: React.FC<PatientPublicViewProps> = ({ patient, clinicName, onUpdateProgress }) => {
  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-4">
        <FileTextIcon className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700">Patient Not Found</h2>
        <p className="text-gray-500 mt-2">The link may be invalid or the patient profile has been removed.</p>
        <a href="#" className="mt-6 px-4 py-2 text-sm font-medium text-white bg-[#782aa7] rounded-lg hover:bg-[#5f2084] transition-colors">
            Return to Homepage
        </a>
      </div>
    );
  }
  
  const handleAddLog = (log: Omit<ProgressLog, 'id' | 'date' | 'author'>) => {
    onUpdateProgress(patient.id, log);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
        <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-[#782aa7]">{clinicName}</h1>
            <p className="text-gray-600 mt-1">Your Personalized Exercise Program</p>
        </header>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Hello, {patient.name}!</h2>
            <p className="text-gray-600">Here is your prescribed exercise chart. Please follow the instructions carefully and log your progress below.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Exercises</h3>
            <ExerciseChart exercises={patient.exercises} onUpdate={() => {}} isReadOnly={true} />
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <ProgressTracker progress={patient.progress} onAddLog={handleAddLog} isPatientView={true} />
        </div>

        <footer className="mt-12 text-center text-xs text-gray-500">
            <p>If you experience any sharp or increasing pain, please stop and contact your physiotherapist at {clinicName}.</p>
        </footer>
    </div>
  );
};

export default PatientPublicView;
