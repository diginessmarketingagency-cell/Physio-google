
import React from 'react';
import { Exercise } from '../types';
import { TrashIcon, PlusIcon } from './icons';

interface ExerciseChartProps {
  exercises: Exercise[];
  onUpdate: (updatedExercises: Exercise[]) => void;
  isReadOnly?: boolean;
}

const ExerciseChart: React.FC<ExerciseChartProps> = ({ exercises, onUpdate, isReadOnly = false }) => {
  const handleExerciseChange = <K extends keyof Exercise,>(index: number, field: K, value: Exercise[K]) => {
    const updated = exercises.map((ex, i) =>
      i === index ? { ...ex, [field]: value } : ex
    );
    onUpdate(updated);
  };

  const addExercise = () => {
    onUpdate([
      ...exercises,
      { id: `ex-${Date.now()}`, name: '', sets: '', reps: '', duration: '', notes: '' }
    ]);
  };

  const removeExercise = (index: number) => {
    onUpdate(exercises.filter((_, i) => i !== index));
  };

  const InputCell: React.FC<{ value: string; onChange: (val: string) => void }> = ({ value, onChange }) => (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent p-2 -m-2 focus:bg-white focus:ring-1 focus:ring-[#782aa7] rounded"
      disabled={isReadOnly}
    />
  );
  
  const TextareaCell: React.FC<{ value: string; onChange: (val: string) => void }> = ({ value, onChange }) => (
    <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent p-2 -m-2 focus:bg-white focus:ring-1 focus:ring-[#782aa7] rounded resize-none"
        rows={1}
        disabled={isReadOnly}
    />
);


  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th scope="col" className="px-4 py-3 w-1/4">Exercise</th>
            <th scope="col" className="px-4 py-3">Sets</th>
            <th scope="col" className="px-4 py-3">Reps</th>
            <th scope="col" className="px-4 py-3">Duration</th>
            <th scope="col" className="px-4 py-3 w-1/3">Notes</th>
            {!isReadOnly && <th scope="col" className="px-4 py-3"></th>}
          </tr>
        </thead>
        <tbody>
          {exercises.map((ex, index) => (
            <tr key={ex.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2"><InputCell value={ex.name} onChange={(v) => handleExerciseChange(index, 'name', v)} /></td>
              <td className="px-4 py-2"><InputCell value={ex.sets} onChange={(v) => handleExerciseChange(index, 'sets', v)} /></td>
              <td className="px-4 py-2"><InputCell value={ex.reps} onChange={(v) => handleExerciseChange(index, 'reps', v)} /></td>
              <td className="px-4 py-2"><InputCell value={ex.duration} onChange={(v) => handleExerciseChange(index, 'duration', v)} /></td>
              <td className="px-4 py-2"><TextareaCell value={ex.notes} onChange={(v) => handleExerciseChange(index, 'notes', v)} /></td>
              {!isReadOnly && (
                <td className="px-4 py-2 text-center">
                  <button onClick={() => removeExercise(index)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {!isReadOnly && (
        <button
          onClick={addExercise}
          className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#782aa7] rounded-lg hover:bg-[#5f2084] transition-colors"
        >
          <PlusIcon className="w-4 h-4" /> Add Exercise
        </button>
      )}
    </div>
  );
};

export default ExerciseChart;
