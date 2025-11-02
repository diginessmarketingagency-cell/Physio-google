
import { Patient, ClinicInfo } from '../types';

declare const jspdf: any;
declare const html2canvas: any;

// PDF Service
export const generatePdf = async (patient: Patient, clinicInfo: ClinicInfo) => {
    const pdfElement = document.getElementById('pdf-preview');
    if (!pdfElement) {
        alert('PDF preview element not found.');
        return;
    }

    const canvas = await html2canvas(pdfElement, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    const { jsPDF } = jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${patient.name.replace(' ', '_')}_Exercise_Chart.pdf`);
};

// CSV Service
export const exportToCsv = (patients: Patient[]) => {
    if (patients.length === 0) {
        alert("No patient data to export.");
        return;
    }

    const replacer = (key: any, value: any) => value === null ? '' : value;
    const header = Object.keys(patients[0]);
    // A bit more complex due to nested data
    const csv = [
        "id,name,email,dateAdded,status,tags,exercises,progress",
        ...patients.map(row => 
            [
                row.id,
                row.name,
                row.email,
                row.dateAdded,
                row.status,
                `"${row.tags.join(';')}"`,
                `"${JSON.stringify(row.exercises).replace(/"/g, '""')}"`,
                `"${JSON.stringify(row.progress).replace(/"/g, '""')}"`
            ].join(',')
        )
    ].join('\r\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `physiotrack_patients_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

export const importFromCsv = (file: File, callback: (patients: Patient[]) => void) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        const csv = event.target?.result as string;
        try {
            const lines = csv.split('\r\n');
            const header = lines[0].split(',');
            if (header.join(',') !== "id,name,email,dateAdded,status,tags,exercises,progress") {
                throw new Error("Invalid CSV header format.");
            }

            const importedPatients: Patient[] = lines.slice(1).filter(line => line).map(line => {
                const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
                const unquote = (str: string) => str.startsWith('"') && str.endsWith('"') ? str.slice(1, -1) : str;

                return {
                    id: values[0],
                    name: values[1],
                    email: values[2],
                    dateAdded: values[3],
                    status: values[4] as any,
                    tags: unquote(values[5]).split(';'),
                    exercises: JSON.parse(unquote(values[6]).replace(/""/g, '"')),
                    progress: JSON.parse(unquote(values[7]).replace(/""/g, '"')),
                };
            });
            callback(importedPatients);
            alert(`${importedPatients.length} patients imported successfully!`);
        } catch(error) {
            console.error("CSV Import Error:", error);
            alert("Failed to import CSV. Please check the file format and content.");
        }
    };
    reader.readAsText(file);
};
