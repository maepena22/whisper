'use client';

import { useRouter } from 'next/navigation';
import RecordingCard from './RecordingCard';

export default function RecordingsGrid({ recordings }) {
  const router = useRouter();

  const handleDelete = () => {
    router.refresh();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {recordings.map((recording) => (
        <RecordingCard 
          key={recording.id} 
          recording={recording}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}