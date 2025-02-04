'use client';

import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

export default function RecordingList({ recordings }) {
  return (
    <div className="space-y-8">
      {recordings.map((recording) => (
        <div key={recording.id} className="bg-gray-50 shadow-lg rounded-xl p-6 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-red-500">{recording.uploaderName}</h2>
            <p className="text-gray-700 mt-2">{recording.description}</p>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(recording.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="mb-6">
            <AudioPlayer
              src={recording.audioUrl}
              className="rounded-lg overflow-hidden"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3 text-red-500">Transcript</h3>
              <pre className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-gray-800 border border-gray-100">
                {JSON.parse(recording.transcript).text}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3 text-red-500">Summary</h3>
              <p className="bg-gray-50 p-4 rounded-lg text-gray-800 border border-gray-100">{recording.summary}</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3 text-red-500">Evaluation</h3>
              <p className="bg-gray-50 p-4 rounded-lg text-gray-800 border border-gray-100">{recording.evaluation}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}