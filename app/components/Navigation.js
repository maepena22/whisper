'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">
                APEX<span className="text-red-500">AI</span>
              </span>
            </Link>
          </div>
          <div className="flex space-x-8">
            <Link 
              href="/"
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                pathname === '/' 
                  ? 'text-red-500 border-b-2 border-red-500' 
                  : 'text-gray-700 hover:text-red-500'
              }`}
            >
              Upload
            </Link>
            <Link 
              href="/records"
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                pathname.startsWith('/records')
                  ? 'text-red-500 border-b-2 border-red-500' 
                  : 'text-gray-700 hover:text-red-500'
              }`}
            >
              Records
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}