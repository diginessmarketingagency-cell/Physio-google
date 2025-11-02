
import React from 'react';
import { Patient, PatientStatus } from '../types';

interface PatientCardProps {
  patient: Patient;
  onSelect: (patient: Patient) => void;
}

const statusColors: Record<PatientStatus, string> = {
  [PatientStatus.InProgress]: "bg-blue-100 text-blue-800",
  [PatientStatus.Recovered]: "bg-green-100 text-green-800",
  [PatientStatus.OnHold]: "bg-yellow-100 text-yellow-800",
};

const PatientCard: React.FC<PatientCardProps> = ({ patient, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(patient)}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-[#782aa7] transition-all duration-200"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{patient.name}</h3>
          <p className="text-sm text-gray-500">{patient.id}</p>
        </div>
        <span
          className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusColors[patient.status]}`}
        >
          {patient.status}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {patient.tags.map(tag => (
          <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md">
            {tag}
          </span>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-4">
        Added: {new Date(patient.dateAdded).toLocaleDateString()}
      </p>
    </div>
  );
};

export default PatientCard;
