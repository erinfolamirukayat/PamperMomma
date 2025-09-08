"use client"

import { FilledButton, OutlinedButton } from '@/components/buttons'
import { InputField } from '@/components/inputs'
import { AppLogo } from '@/components/logo'
import { ImageTile } from '@/components/tiles'
import { CreateRegistry } from '@/lib/services/registry/types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'


function Page() {
  const router = useRouter()

  const onChoice = (choice: boolean) => {
    // pull and update `new-registry` on session storage
    const existingRegistry = sessionStorage.getItem('new-registry');
    if (!existingRegistry) {
      console.error("No existing registry found in session storage.");
      // Redirect to the registry creation page if no existing registry is found
      router.push('/onboarding');
      return;
    }
    const newRegistry: CreateRegistry = JSON.parse(existingRegistry);
    newRegistry.is_first_time = choice;
    sessionStorage.setItem('new-registry', JSON.stringify(newRegistry));
    // Redirect to the next page
    router.push("/onboarding/signup");
  }

  return (
    <main className='flex flex-col items-center mx-lg'>

      <header className='max-w-2xl flex flex-col items-center'>
        <div className='py-12'>
          <AppLogo />
        </div>
        <h1 className='text-headline-desktop-small text-center pb-4'>Are you a first-time parent?</h1>
        <p className='text-body-desktop text-center'>This helps us personalize your experience.</p>
      </header>
      <div className='flex flex-row my-8 gap-4'>
        <FilledButton className='mx-auto min-w-32 mt-4' onClick={() => onChoice(true)}>Yes</FilledButton>
        <OutlinedButton className='mx-auto min-w-32 mt-4' onClick={() => onChoice(false)}>No</OutlinedButton>
      </div>
    </main>
  )
}

export default Page