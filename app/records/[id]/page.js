import { PrismaClient } from '@prisma/client';
import RecordingList from '../../components/RecordingList';

const prisma = new PrismaClient();

async function getRecording(id) {
  return await prisma.recording.findUnique({
    where: { id },
  });
}

export default async function RecordingPage({ params }) {
  const recording = await getRecording(params.id);

  if (!recording) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900">Recording not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <RecordingList recordings={[recording]} />
      </div>
    </div>
  );
}