
import React, { useState } from 'react';
import { ProgressLog } from '../types';

interface ProgressTrackerProps {
  progress: ProgressLog[];
  onAddLog: (log: Omit<ProgressLog, 'id' | 'date' | 'author'>) => void;
  isPatientView?: boolean;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ progress, onAddLog, isPatientView = false }) => {
  const [completed, setCompleted] = useState(false);
  const [painLevel, setPainLevel] = useState(5);
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes && !completed) {
        alert("Please provide some feedback or mark exercises as completed.");
        return;
    }
    onAddLog({ completed, painLevel, notes });
    setCompleted(false);
    setPainLevel(5);
    setNotes("");
  };
  
  const sortedProgress = [...progress].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
      {isPatientView && (
        <form onSubmit={handleSubmit} className="p-4 mb-6 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Log Your Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Pain Level (0 = No Pain, 10 = Severe Pain)</label>
              <div className="flex items-center gap-4">
                 <input
                    type="range"
                    min="0"
                    max="10"
                    value={painLevel}
                    onChange={(e) => setPainLevel(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#782aa7]"
                />
                <span className="font-bold text-[#782aa7] w-8 text-center">{painLevel}</span>
              </div>
            </div>
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes (optional)</label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#782aa7] focus:ring-[#782aa7] sm:text-sm"
                placeholder="How did the exercises feel today?"
              ></textarea>
            </div>
             <div className="flex items-start col-span-1 md:col-span-2">
                <div className="flex items-center h-5">
                    <input
                        id="completed"
                        type="checkbox"
                        checked={completed}
                        onChange={(e) => setCompleted(e.target.checked)}
                        className="focus:ring-[#782aa7] h-4 w-4 text-[#782aa7] border-gray-300 rounded"
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="completed" className="font-medium text-gray-700">I completed all my exercises today.</label>
                </div>
            </div>
          </div>
          <button type="submit" className="mt-4 w-full md:w-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#782aa7] hover:bg-[#5f2084] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#782aa7]">
            Add Progress Entry
          </button>
        </form>
      )}

      <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress History</h3>
      <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
        {sortedProgress.length > 0 ? (
          sortedProgress.map(log => (
            <div key={log.id} className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                <span>{new Date(log.date).toLocaleString()}</span>
                <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${log.author === 'Patient' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>{log.author}</span>
              </div>
              <p className="text-sm text-gray-700 mb-1">{log.notes || "No notes provided."}</p>
              <div className="flex items-center gap-4 text-sm">
                <span>Pain: <span className="font-medium">{log.painLevel}/10</span></span>
                {log.completed && <span className="text-green-600 font-medium">Exercises Completed</span>}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No progress has been logged yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;
