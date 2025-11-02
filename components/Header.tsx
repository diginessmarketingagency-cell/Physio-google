
import React from 'react';
import { PlusIcon, SearchIcon, UploadIcon, DownloadIcon } from './icons';
import { SortOption } from '../types';

interface HeaderProps {
    clinicName: string;
    onAddPatient: () => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    activeTags: string[];
    allTags: string[];
    onTagFilterChange: (tag: string) => void;
    sortOption: SortOption;
    onSortChange: (option: SortOption) => void;
    onImport: (file: File) => void;
    onExport: () => void;
}

const Header: React.FC<HeaderProps> = ({
    clinicName,
    onAddPatient,
    searchTerm,
    onSearchChange,
    activeTags,
    allTags,
    onTagFilterChange,
    sortOption,
    onSortChange,
    onImport,
    onExport
}) => {
    
    const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onImport(e.target.files[0]);
            e.target.value = ''; // Reset input
        }
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-10 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <h1 className="text-2xl font-bold text-[#782aa7]">{clinicName}</h1>
                    <div className="flex items-center gap-2">
                        <label htmlFor="csv-import" className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <UploadIcon className="w-4 h-4" /> Import
                        </label>
                        <input type="file" id="csv-import" className="hidden" accept=".csv" onChange={handleFileImport} />
                        <button onClick={onExport} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <DownloadIcon className="w-4 h-4" /> Export
                        </button>
                        <button onClick={onAddPatient} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#782aa7] rounded-lg hover:bg-[#5f2084] transition-colors">
                            <PlusIcon className="w-5 h-5" /> Add Patient
                        </button>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name, ID, or tag..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#782aa7] focus:border-[#782aa7] sm:text-sm"
                        />
                    </div>
                     <div>
                        <select
                            value={sortOption}
                            onChange={(e) => onSortChange(e.target.value as SortOption)}
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#782aa7] focus:border-[#782aa7] sm:text-sm rounded-md"
                        >
                            {Object.values(SortOption).map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                </div>
                 {allTags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2 items-center">
                        <span className="text-sm font-medium text-gray-600">Filter by tag:</span>
                        {allTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => onTagFilterChange(tag)}
                                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                                    activeTags.includes(tag)
                                    ? 'bg-[#782aa7] text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                {tag}
                            </button>
                        ))}
                         {activeTags.length > 0 && (
                            <button
                                onClick={() => onTagFilterChange('')} // Special value to clear
                                className="text-sm text-gray-500 hover:text-[#782aa7]"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
