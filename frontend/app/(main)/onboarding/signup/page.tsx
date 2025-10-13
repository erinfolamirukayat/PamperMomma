"use client"

import { FilledButton, GoogleButton } from '@/components/buttons'
import { InputField } from '@/components/inputs'
import { AppLogo } from '@/components/logo'
import { useHulkFetch } from 'hulk-react-utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'


function Page() {
    const router = useRouter()
    const {
        dispatch: goSignup,
        data: _
    } = useHulkFetch<any>('/accounts/signup/', {
        onSuccess: (data, alert) => {
            /// Step 2: Redirect to login
            router.push('/onboarding/login?signup=success');
        },
    })

    const onSubmit = async (e: React.FormEvent) => {
        /// Step 1: Signup flow
        // This will be called when the signup form is submitted
        e.preventDefault()
        // Handle form submission logic here
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const first_name = formData.get('first_name') as string;
        const last_name = formData.get('last_name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        goSignup({
            method: 'POST',
            body: JSON.stringify({
                first_name,
                last_name,
                email,
                password
            }),
        })
    }

    return (
        <main className='flex flex-col items-center mx-6 pb-6'>
            <header className='max-w-2xl flex flex-col items-center mb-8'>
                <div className='py-12'>
                    <AppLogo />
                </div>
                <h1 className='text-headline-desktop-small text-center'>Start your registry and we'll support you along the way!</h1>
            </header>
            <form onSubmit={onSubmit} className='w-full max-w-96 flex flex-col gap-4'>
                <div className='flex flex-row gap-4'>
                    <InputField
                        name="first_name"
                        id='first_name'
                        labeltext='First Name'
                        type='text'
                        autoFocus
                        required
                        pattern='.{2,30}'
                        title='First name should be between 2 and 30 characters.'
                    />
                    <InputField
                        name="last_name"
                        id='last_name'
                        labeltext='Last Name'
                        type='text'
                        required
                        pattern='.{2,30}'
                        title='Last name should be between 2 and 30 characters.'
                    />
                </div>
                <InputField
                    name='email'
                    id='email'
                    labeltext='Email Address'
                    type='email'
                    required
                    title='Please enter a valid email address.'
                />
                <InputField
                    name='password'
                    id='password'
                    labeltext='Password'
                    type='password'
                    required
                    pattern='(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}'
                    title='Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.'
                />
                {/* <CheckboxField
                    id='offer-consent'
                    labeltext="I'd like to receive promotional offers and updates from approved PamperMomma partners."
                /> */}
                <div className='flex mb-6 mt-4'>
                    <FilledButton className='mx-auto min-w-32'>Signup</FilledButton>
                </div>
                <p className='text-label-desktop-large text-center text-neutral-800'>Already have an account? <Link href="/onboarding/login" className='text-title-desktop-small hover:text-primary-500'>Login</Link></p>
                <p className='text-label-desktop-small text-center text-neutral-500'>By clicking Sign Up, you agree to the PamperMomma <Link href="" className='underline whitespace-nowrap'>Terms of Use</Link> and <Link href="" className='underline whitespace-nowrap'>Privacy Policy</Link>.</p>
            </form>
        </main>
    )
}

export default Page