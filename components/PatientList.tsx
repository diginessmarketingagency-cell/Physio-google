
import React from 'react';
import { Patient } from '../types';
import PatientCard from './PatientCard';

interface PatientListProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
}

const PatientList: React.FC<PatientListProps> = ({ patients, onSelectPatient }) => {
  if (patients.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-gray-700">No patients found.</h3>
        <p className="text-gray-500 mt-2">Try adjusting your search or filters, or add a new patient to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {patients.map(patient => (
        <PatientCard key={patient.id} patient={patient} onSelect={onSelectPatient} />
      ))}
    </div>
  );
};

export default PatientList;
