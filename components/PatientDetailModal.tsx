
import React, { useState, useEffect, useCallback } from 'react';
import { Patient, PatientStatus, Exercise, ProgressLog, ClinicInfo } from '../types';
import ExerciseChart from './ExerciseChart';
import ProgressTracker from './ProgressTracker';
import { XIcon, DownloadIcon, ShareIcon, UploadIcon, CheckCircleIcon } from './icons';
import { generatePdf } from '../services/dataService';

interface PatientDetailModalProps {
  patient: Patient | null;
  clinicInfo: ClinicInfo;
  onClose: () => void;
  onUpdatePatient: (updatedPatient: Patient) => void;
  onUpdateClinicInfo: (updatedInfo: ClinicInfo) => void;
  onDeletePatient: (patientId: string) => void;
}

const PatientDetailModal: React.FC<PatientDetailModalProps> = ({ patient, clinicInfo, onClose, onUpdatePatient, onUpdateClinicInfo, onDeletePatient }) => {
  const [localPatient, setLocalPatient] = useState<Patient | null>(patient);
  const [localClinicInfo, setLocalClinicInfo] = useState<ClinicInfo>(clinicInfo);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    setLocalPatient(patient);
  }, [patient]);

  useEffect(() => {
    setLocalClinicInfo(clinicInfo);
  }, [clinicInfo]);
  
  const handlePatientChange = <K extends keyof Patient,>(field: K, value: Patient[K]) => {
      if (localPatient) {
          setLocalPatient({ ...localPatient, [field]: value });
      }
  };

  const handleClinicInfoChange = <K extends keyof ClinicInfo,>(field: K, value: ClinicInfo[K]) => {
      setLocalClinicInfo({ ...localClinicInfo, [field]: value });
  };
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleClinicInfoChange('logo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSave = () => {
    if (localPatient) {
        onUpdatePatient(localPatient);
    }
    onUpdateClinicInfo(localClinicInfo);
    onClose();
  };

  const addProgressLog = (log: Omit<ProgressLog, 'id' | 'date' | 'author'>) => {
    if (localPatient) {
      const newLog: ProgressLog = {
        ...log,
        id: `p-${Date.now()}`,
        date: new Date().toISOString(),
        author: 'Doctor',
      };
      handlePatientChange('progress', [...localPatient.progress, newLog]);
    }
  };

  const handleShare = () => {
    if (!patient) return;
    const url = `${window.location.origin}${window.location.pathname}#/patient/${patient.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleDelete = () => {
    if (patient && window.confirm(`Are you sure you want to delete patient ${patient.name}? This action cannot be undone.`)) {
        onDeletePatient(patient.id);
        onClose();
    }
  };


  if (!localPatient) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <header className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">{localPatient.name}</h2>
            <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                <XIcon className="w-6 h-6" />
            </button>
        </header>
        
        <main className="p-6 overflow-y-auto flex-grow space-y-6">
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Patient Name</label>
                    <input type="text" value={localPatient.name} onChange={e => handlePatientChange('name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#782aa7] focus:ring-[#782aa7] sm:text-sm"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Patient Email</label>
                    <input type="email" value={localPatient.email} onChange={e => handlePatientChange('email', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#782aa7] focus:ring-[#782aa7] sm:text-sm"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select value={localPatient.status} onChange={e => handlePatientChange('status', e.target.value as PatientStatus)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#782aa7] focus:ring-[#782aa7] sm:text-sm">
                        {Object.values(PatientStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
                    <input type="text" value={localPatient.tags.join(', ')} onChange={e => handlePatientChange('tags', e.target.value.split(',').map(t => t.trim()))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#782aa7] focus:ring-[#782aa7] sm:text-sm"/>
                </div>
            </section>

            <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Exercise Chart</h3>
                <ExerciseChart exercises={localPatient.exercises} onUpdate={exs => handlePatientChange('exercises', exs)} />
            </section>
            
            <section>
                <ProgressTracker progress={localPatient.progress} onAddLog={addProgressLog} />
            </section>

            <section className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Branding & Export</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Clinic Name</label>
                        <input type="text" value={localClinicInfo.name} onChange={e => handleClinicInfoChange('name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#782aa7] focus:ring-[#782aa7] sm:text-sm"/>
                    </div>
                     <div className="flex items-end">
                         <label htmlFor="logo-upload" className="w-full cursor-pointer flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                            <UploadIcon className="w-4 h-4" /> {localClinicInfo.logo ? "Change Logo" : "Upload Logo"}
                         </label>
                         <input id="logo-upload" type="file" className="hidden" accept="image/*" onChange={handleLogoUpload}/>
                     </div>
                 </div>
            </section>

        </main>
        
        <footer className="p-4 bg-gray-50 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
                 <button onClick={handleDelete} className="text-sm text-red-600 hover:text-red-800">Delete Patient</button>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center">
                <button onClick={() => generatePdf(localPatient, localClinicInfo)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#782aa7] bg-purple-100 border border-transparent rounded-lg hover:bg-purple-200 transition-colors">
                    <DownloadIcon className="w-5 h-5" /> Download PDF
                </button>
                 <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#782aa7] bg-purple-100 border border-transparent rounded-lg hover:bg-purple-200 transition-colors">
                    {copied ? <CheckCircleIcon className="w-5 h-5 text-green-600"/> : <ShareIcon className="w-5 h-5" />}
                    {copied ? 'Link Copied!' : 'Share Link'}
                </button>
                 <button onClick={handleSave} className="px-6 py-2 text-sm font-medium text-white bg-[#782aa7] rounded-lg hover:bg-[#5f2084] transition-colors">
                    Save Changes
                </button>
            </div>
        </footer>
      </div>
    </div>
  );
};

export default PatientDetailModal;
