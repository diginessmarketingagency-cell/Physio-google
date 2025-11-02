
import React from 'react';
import { Patient, ClinicInfo } from '../types';

interface PDFPreviewProps {
  patient: Patient | null;
  clinicInfo: ClinicInfo;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ patient, clinicInfo }) => {
  if (!patient) return null;

  const renderLogo = () => {
    if (clinicInfo.logo) {
      return <img src={clinicInfo.logo} alt="Clinic Logo" className="h-20 w-auto object-contain" />;
    }
    return <div className="h-20 w-20 bg-gray-200 flex items-center justify-center text-gray-500">Logo</div>;
  };

  return (
    <div id="pdf-preview" className="absolute -left-full top-0 w-[210mm] min-h-[297mm] bg-white p-12 font-sans text-gray-800">
      <header className="flex justify-between items-start border-b-2 border-gray-800 pb-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{clinicInfo.name}</h1>
          <p className="text-sm text-gray-600">Personalized Exercise Program</p>
        </div>
        {renderLogo()}
      </header>

      <section className="mb-8 grid grid-cols-2 gap-x-8 gap-y-2">
        <div>
          <p className="font-bold">Patient Name:</p>
          <p>{patient.name}</p>
        </div>
        <div>
          <p className="font-bold">Patient ID:</p>
          <p>{patient.id}</p>
        </div>
        <div>
          <p className="font-bold">Date Issued:</p>
          <p>{new Date().toLocaleDateString()}</p>
        </div>
      </section>

      <main>
        <h2 className="text-xl font-bold mb-4 border-b border-gray-400 pb-2">Your Exercises</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border border-gray-300">Exercise</th>
              <th className="p-3 border border-gray-300">Sets</th>
              <th className="p-3 border border-gray-300">Reps</th>
              <th className="p-3 border border-gray-300">Duration/Hold</th>
              <th className="p-3 border border-gray-300">Notes</th>
            </tr>
          </thead>
          <tbody>
            {patient.exercises.map((ex) => (
              <tr key={ex.id}>
                <td className="p-3 border border-gray-300 align-top">{ex.name}</td>
                <td className="p-3 border border-gray-300 align-top">{ex.sets}</td>
                <td className="p-3 border border-gray-300 align-top">{ex.reps}</td>
                <td className="p-3 border border-gray-300 align-top">{ex.duration}</td>
                <td className="p-3 border border-gray-300 align-top">{ex.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      <footer className="mt-12 text-center text-xs text-gray-500">
        <p>This exercise plan was prescribed by {clinicInfo.name}.</p>
        <p>If you experience any sharp or increasing pain, please stop and contact your physiotherapist.</p>
      </footer>
    </div>
  );
};

export default PDFPreview;
