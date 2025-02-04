import { PrismaClient } from '@prisma/client';
import RecordingsGrid from '../components/RecordingsGrid';

const prisma = new PrismaClient();

async function getRecordings() {
  const recordings = await prisma.recording.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return recordings;
}

export default async function RecordsPage() {
  const recordings = await getRecordings();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Recording Collection</h1>
        <RecordingsGrid recordings={recordings} />
      </div>
    </div>
  );
}