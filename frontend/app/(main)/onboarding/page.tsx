"use client"

import { FilledButton } from '@/components/buttons'
import { InputField } from '@/components/inputs'
import { AppLogo } from '@/components/logo'
import { CreateRegistry } from '@/lib/services/registry/types'
import App from 'next/app'
import { useRouter } from 'next/navigation'
import React from 'react'

function Page() {
    // Welcome the user to the onboarding flow
    // Ask for their first-time registry name
    const router = useRouter();
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const registryName = formData.get('registry-name') as string;
        // Save to session storage
        const newRegistry: CreateRegistry = {
            name: registryName,
            is_first_time: true,
            arrival_date: "",
            babies_count: 1,
            thank_you_message: "",
            welcome_message: "",
            services: []
        };
        sessionStorage.setItem('new-registry', JSON.stringify(newRegistry));
        // Redirect to the next step in the onboarding flow
        router.push('/onboarding/services');
    }
    return (
        <main className='flex flex-col items-center mx-6'>
            <div className='py-12'>
                <AppLogo />
            </div>
            <h1 className='text-headline-desktop-small max-w-2xl text-center pb-8'>Design the Help You Deserve After Baby Arrives</h1>
            <p className='text-body-desktop max-w-2xl text-center'>Welcome to PamperMomma! Let's start by creating your first registry to help you get the support you need during this special time.</p>
            <form className='max-w-md w-full' onSubmit={onSubmit}>
                <div className='flex flex-col gap-4 mt-6'>
                    <InputField
                        type='text'
                        className='w-full'
                        id='registry-name'
                        name='registry-name'
                        placeholder='e.g., Baby Smith Pamper Registry'
                        labeltext='Pamper Registry Name'
                        required
                        autoFocus
                        pattern='.{10,50}'
                        title='Registry name should be between 10 and 50 characters.'
                    />
                    <FilledButton
                        type='submit'
                        className='mt-4 self-center'
                    >
                        Continue
                    </FilledButton>
                </div>
            </form>
        </main>
    )
}

export default Page