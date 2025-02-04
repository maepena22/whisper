'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Home() {
  const [uploaderName, setUploaderName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('audio', file);
      formData.append('uploaderName', uploaderName);
      formData.append('description', description);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.recording);
        toast.success('Analysis completed successfully!');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error('Error processing file: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">
          Sales Pitch <span className="text-red-500">Analysis</span>
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 rounded-xl p-6 shadow-md border border-gray-100">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Uploader Name</label>
            <input
              type="text"
              value={uploaderName}
              onChange={(e) => setUploaderName(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Audio File (Japanese)</label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : 'Analyze Sales Pitch'}
          </button>
        </form>

        {result && (
          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-red-500">Transcript</h3>
              <pre className="whitespace-pre-wrap bg-white p-4 rounded-lg border border-gray-200 text-gray-900">{JSON.parse(result.transcript).text}</pre>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-red-500">Summary</h3>
              <p className="bg-white p-4 rounded-lg border border-gray-200 text-gray-900">{result.summary}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-red-500">Evaluation</h3>
              <p className="bg-white p-4 rounded-lg border border-gray-200 text-gray-900">{result.evaluation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
