
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Patient, ClinicInfo, PatientStatus, ProgressLog, SortOption } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { INITIAL_PATIENTS, INITIAL_CLINIC_INFO } from './constants';
import Header from './components/Header';
import PatientList from './components/PatientList';
import PatientDetailModal from './components/PatientDetailModal';
import PatientPublicView from './components/PatientPublicView';
import PDFPreview from './components/PDFPreview';
import { importFromCsv, exportToCsv } from './services/dataService';

const App: React.FC = () => {
    const [patients, setPatients] = useLocalStorage<Patient[]>('physio-patients', INITIAL_PATIENTS);
    const [clinicInfo, setClinicInfo] = useLocalStorage<ClinicInfo>('physio-clinic-info', INITIAL_CLINIC_INFO);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTags, setActiveTags] = useState<string[]>([]);
    const [sortOption, setSortOption] = useState<SortOption>(SortOption.DateNewest);
    
    // Simple hash-based routing
    const [route, setRoute] = useState(window.location.hash);
    useEffect(() => {
        const handleHashChange = () => setRoute(window.location.hash);
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        patients.forEach(p => p.tags.forEach(t => tags.add(t)));
        return Array.from(tags).sort();
    }, [patients]);
    
    const handleTagFilterChange = (tag: string) => {
        if (tag === '') { // Special case to clear filters
            setActiveTags([]);
            return;
        }
        setActiveTags(prev => 
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const filteredAndSortedPatients = useMemo(() => {
        let processedPatients = [...patients]
            .filter(p => {
                const searchLower = searchTerm.toLowerCase();
                const matchesSearch = 
                    p.name.toLowerCase().includes(searchLower) ||
                    p.id.toLowerCase().includes(searchLower) ||
                    p.tags.some(t => t.toLowerCase().includes(searchLower));
                
                const matchesTags = activeTags.length === 0 || activeTags.every(t => p.tags.includes(t));

                return matchesSearch && matchesTags;
            });

        processedPatients.sort((a, b) => {
            switch(sortOption) {
                case SortOption.NameAZ:
                    return a.name.localeCompare(b.name);
                case SortOption.Status:
                    return a.status.localeCompare(b.status);
                case SortOption.DateOldest:
                    return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
                case SortOption.DateNewest:
                default:
                    return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
            }
        });

        return processedPatients;
    }, [patients, searchTerm, activeTags, sortOption]);

    const handleAddPatient = () => {
        const newPatient: Patient = {
            id: `PID-${Math.random().toString(36).substr(2, 9)}`,
            name: "New Patient",
            email: "",
            dateAdded: new Date().toISOString(),
            status: PatientStatus.InProgress,
            tags: [],
            exercises: [],
            progress: [],
        };
        setPatients(prev => [newPatient, ...prev]);
        setSelectedPatient(newPatient);
    };
    
    const handleUpdatePatient = (updatedPatient: Patient) => {
        setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
    };

    const handleDeletePatient = (patientId: string) => {
        setPatients(prev => prev.filter(p => p.id !== patientId));
    };

    const handleUpdateProgress = (patientId: string, progressLog: Omit<ProgressLog, 'id' | 'date' | 'author'>) => {
        setPatients(prev => prev.map(p => {
            if (p.id === patientId) {
                const newLog: ProgressLog = {
                    ...progressLog,
                    id: `p-${Date.now()}`,
                    date: new Date().toISOString(),
                    author: 'Patient',
                };
                return { ...p, progress: [...p.progress, newLog]};
            }
            return p;
        }));
        alert("Your progress has been submitted successfully!");
    };
    
    const handleImport = useCallback((file: File) => {
        importFromCsv(file, (newPatients) => {
            // A simple merge strategy: update existing, add new.
            const patientMap = new Map(patients.map(p => [p.id, p]));
            newPatients.forEach(p => patientMap.set(p.id, p));
            setPatients(Array.from(patientMap.values()));
        });
    }, [patients, setPatients]);

    const handleExport = useCallback(() => {
        exportToCsv(patients);
    }, [patients]);


    // Router logic
    if (route.startsWith('#/patient/')) {
        const patientId = route.split('/')[2];
        const patient = patients.find(p => p.id === patientId);
        return <PatientPublicView patient={patient} clinicName={clinicInfo.name} onUpdateProgress={handleUpdateProgress} />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                clinicName={clinicInfo.name}
                onAddPatient={handleAddPatient}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                activeTags={activeTags}
                allTags={allTags}
                onTagFilterChange={handleTagFilterChange}
                sortOption={sortOption}
                onSortChange={setSortOption}
                onImport={handleImport}
                onExport={handleExport}
            />
            <main className="max-w-7xl mx-auto p-4 md:p-6">
                <PatientList patients={filteredAndSortedPatients} onSelectPatient={setSelectedPatient} />
            </main>
            {selectedPatient && (
                <PatientDetailModal
                    patient={selectedPatient}
                    clinicInfo={clinicInfo}
                    onClose={() => setSelectedPatient(null)}
                    onUpdatePatient={handleUpdatePatient}
                    onUpdateClinicInfo={setClinicInfo}
                    onDeletePatient={handleDeletePatient}
                />
            )}
            <PDFPreview patient={selectedPatient} clinicInfo={clinicInfo} />
        </div>
    );
};

export default App;
