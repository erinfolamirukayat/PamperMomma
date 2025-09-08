"use client"

import { FilledButton } from '@/components/buttons'
import { CheckboxField, InputField } from '@/components/inputs'
import { AppLogo } from '@/components/logo'
import { ImageTile } from '@/components/tiles'
import { CreateRegistry } from '@/lib/services/registry/types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'


function Page() {
  const router = useRouter()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const arrivalDate = formData.get('arrival_date') as string;
    const babiesCount = parseInt(formData.get('babies_count')?.toString() ?? "1")
    // pull and update `new-registry` on session storage
    const existingRegistry = sessionStorage.getItem('new-registry');
    if (!existingRegistry) {
      console.error("No existing registry found in session storage.");
      // Redirect to the registry creation page if no existing registry is found
      router.push('/onboarding');
      return;
    }
    const newRegistry: CreateRegistry = JSON.parse(existingRegistry);
    newRegistry.arrival_date = arrivalDate;
    newRegistry.babies_count = babiesCount;
    sessionStorage.setItem('new-registry', JSON.stringify(newRegistry));
    // Redirect to the next page
    router.push('/onboarding/first-time');
  }

  return (
    <main className='flex flex-col items-center mx-6'>

      <header className='max-w-2xl flex flex-col items-center'>
        <div className='py-12'>
          <AppLogo />
        </div>
        <h1 className='text-headline-desktop-small text-center pb-4'>Congrats! When is this blessing arriving?</h1>
        <p className='text-body-desktop text-center'>This helps us personalize your experience.</p>
      </header>

      <form onSubmit={onSubmit} className='w-full max-w-96 py-6 space-y-4'>
        <InputField
          name='arrival_date'
          id='arrival_date'
          labeltext='Arrival date'
          type='date'
          required
          // > today's date
          min={new Date().toISOString().split("T")[0]}
        />
        <InputField
          id='babies_count'
          name='babies_count'
          labeltext='Number of babies'
          type='number'
          defaultValue={1}
          min={1}
          max={10}
          required
        />
        <div className='flex my-8'>
          <FilledButton className='mx-auto min-w-32 mt-4'>
            Next
          </FilledButton>
        </div>
      </form>
    </main>
  )
}

export default Page
