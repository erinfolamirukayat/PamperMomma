'use client'

import { useSelectedLayoutSegment } from 'next/navigation'
import React from 'react'

function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  // This layout is used for the onboarding flow
  const total_steps = 5;
  const steps = {
    '': 1,
    'services': 2,
    'arrival': 3,
    'first-time': 4,
    'signup': 5,
  }
  let segment = useSelectedLayoutSegment() as keyof typeof steps | null;
  if (!segment) {
    // If segment is null, default to 'registry'
    // This happens when the user is on the root of the onboarding flow
    segment = '';
  }
  return (
    <div className='pt-6 relative min-h-screen'>
      <div className='h-3 w-full fixed top-0 z-30 [background-image:_linear-gradient(to_right,var(--color-primary-100),var(--color-green-100),var(--color-orange-100),var(--color-red-100))]'>
        <div className='h-full overflow-hidden transition-all' style={{ width: `${steps[segment] * 100 / total_steps}%` }}>
          <div className='h-full w-screen [background-image:_linear-gradient(to_right,var(--color-primary-500),var(--color-green-500),var(--color-orange-500),var(--color-red-500))]' />
        </div>
      </div>
      {children}
    </div>
  )
}

export default Layout