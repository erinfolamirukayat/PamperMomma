"use client"

import { FilledButton, GoogleButton } from '@/components/buttons'
import { InputField } from '@/components/inputs'
import { AppLogo } from '@/components/logo'
import { ErrorModal, LoadingModal } from '@/components/modals'
import { login } from '@/lib/services/auth/actions'
import { CreateRegistry, Registry } from '@/lib/services/registry/types'
import { useHulk, useHulkAlert, useHulkFetch } from 'hulk-react-utils'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useActionState, useEffect } from 'react'


function LoginForm() {
    const hulk = useHulk()
    const alert = useHulkAlert()
    const router = useRouter()
    const [state, loginAction, isPending] = useActionState(login, null)
    const searchParams = useSearchParams()
    const isSignupSuccess = searchParams.get('signup') === 'success';   

    const {
        dispatch: goRegistries,
        data: registriesData
    } = useHulkFetch<Registry[]>("/registries/r/", {
        onSuccess(data, alert) {
            /// Step 4: Cleanup and redirect
            // remove the new-registry from session storage
            sessionStorage.removeItem('new-registry');
            // Redirect to the registries page after successful signup
            router.push('/mom/registries');
        },
        onError(error, alert) {
            console.error('Failed to create registry:', error);
            const alertId = 'create-registry-error-modal';
            alert?.push(
                <ErrorModal
                    error={{
                        code: 400,
                        message: 'Failed to create registry.',
                        details: ["You will be redirected to the registries page after 5 seconds to try again."],
                    }}
                    onClose={() => alert?.pop({ alertId })}
                />,
                { alertId }
            );
            // Close the modal after 5 seconds and redirect to /mom/registries/new
            setTimeout(() => {
                alert?.pop({ alertId });
                router.push('/mom/registries/new');
            }, 5000);
        }
    })

    useEffect(() => {
        if (state?.status === 'success') {
            hulk.auth.update({
                token: {
                    access_token: state!.data!
                },
                user: undefined
            });
            // pull and update `new-registry` on session storage
            const existingRegistry = sessionStorage.getItem('new-registry');
            if (existingRegistry === null) {
                // Redirect to the registries page after successful login
                router.push('/mom/registries');
            } else {
                const newRegistry: CreateRegistry = JSON.parse(existingRegistry);
                // send the new registry to the backend
                goRegistries({
                    method: 'POST',
                    body: JSON.stringify(newRegistry),
                })
            }
        } else if (state?.status === 'error') {
            // Handle error state, e.g., show a notification or alert
            console.error('Login failed:', state.error);
            const alertId = 'login-error-modal';
            alert?.push(
                <ErrorModal
                    error={state.error}
                    onClose={() => alert?.pop({ alertId })}
                />,
                { alertId }
            );
        }
    }, [state])

    useEffect(() => {
        const alertId = 'login-loading-modal';
        if (isPending) {
            alert?.push(<LoadingModal isLoading />, { alertId });
        } else {
            alert?.pop({ alertId });
        }
    }, [isPending]);


    return (
        <main className='flex flex-col items-center mx-6 pb-6'>
            <header className='max-w-2xl flex flex-col items-center mb-8'>
                <div className='py-12'>
                    <AppLogo />
                </div>
                <h1 className='text-headline-desktop-small text-center'>Create a Care Plan That Fits Your Needs</h1>
            </header>
            {isSignupSuccess &&
                <div className='w-full max-w-96 mb-6 p-4 border border-green-300 bg-green-50 text-green-800 rounded'>
                    <p className='text-label-desktop-large text-center'>Signup successful! Please login to continue.</p>
                </div>
            }
            <form action={loginAction} className='w-full max-w-96 flex flex-col gap-4'>
                <InputField labeltext='Email Address' type='email' name='email' required />
                <InputField labeltext='Password' type='password' name='password' required />
                <div className='flex mb-6 mt-4'>
                    <FilledButton className='mx-auto min-w-32'>Login</FilledButton>
                </div>
                <p className='text-label-desktop-large text-center text-neutral-800'>You don't have an account yet? <Link href="/onboarding" className='text-title-desktop-small hover:text-primary-500'>Signup</Link></p>
            </form>
        </main>
    )
}

function Page() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
            <LoginForm />
        </Suspense>
    )
}

export default Page