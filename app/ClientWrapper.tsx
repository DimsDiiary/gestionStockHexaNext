'use client';

import { useEffect } from 'react';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialisation de Flowbite
    import('flowbite');
  }, []);

  return <>{children}</>;
}