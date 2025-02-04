'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function RecordingCard({ recording, onDelete }) {
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this recording?')) {
      const response = await fetch(`/api/recordings/${recording.id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        onDelete();
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {recording.uploaderName}
        </h2>
        <p className="text-gray-700 mb-4 line-clamp-2">
          {recording.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {new Date(recording.createdAt).toLocaleDateString()}
          </span>
          <div className="space-x-4">
            <Link
              href={`/records/${recording.id}`}
              className="text-red-500 hover:text-red-600 font-medium"
            >
              View Details
            </Link>
            <button
              onClick={handleDelete}
              className="text-gray-500 hover:text-gray-600 font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}