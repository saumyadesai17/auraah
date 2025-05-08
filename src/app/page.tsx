'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
    React.useEffect(() => {
      router.replace('/explore');
    }, [router]);
  
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Welcome to Aura App</h1>
      </div>
    );
}
