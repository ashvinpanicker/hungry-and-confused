import PreferenceForm from '@/components/PreferenceForm';
import { Suspense } from 'react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Food Match
        </h1>
        <Suspense fallback={<div>Loading...</div>}>
          <PreferenceForm />
        </Suspense>
      </div>
    </main>
  );
}