'use client'

import { Registry, SharedRegistry } from '@/lib/services/registry/types'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { Icon } from '@iconify/react'
import { FilledButton } from '@/components/buttons'
import { QuickActions, RegistryHero, RegistryWidget } from '@/components/registry'
import { useHulkFetch } from 'hulk-react-utils'

function Page() {
    const router = useRouter()

    // Fetch user's own registries
    const {
        dispatch: goRegistries,
        data: registriesData
    } = useHulkFetch<Registry[]>("/registries/r/")

    // Fetch shared registries
    const {
        dispatch: goShared,
        data: sharedData
    } = useHulkFetch<SharedRegistry[]>("/registries/shared/")

    useEffect(() => {
        goRegistries({ method: 'GET' })
        goShared({ method: 'GET' })
    }, [])

    const totalRegistries = (registriesData?.length || 0) + (sharedData?.length || 0);

    return (
        <main className='relative min-h-full flex-1'>
            {/* Header Section */}
            <RegistryHero totalRegistries={totalRegistries} />

            {/* Main Content */}
            <section className='px-6 sm:px-12 py-8'>
                <div className='max-w-6xl mx-auto space-y-8'>
                    {/* My Registries */}
                    {registriesData && registriesData.length > 0 && (
                        <RegistryWidget
                            title={`My Registries (${registriesData.length})`}
                            registries={registriesData}
                            action={<FilledButton
                                onClick={() => router.push('/mom/registries/new')}
                                className='flex flex-row items-center justify-center sm:justify-start gap-2'
                            >
                                <Icon icon="material-symbols-light:add" className="h-5 w-5" />
                                Create New Pamper Registry
                            </FilledButton>}
                        />
                    )}

                    {/* Shared Registries */}
                    {sharedData && sharedData.length > 0 && (
                        <RegistryWidget
                            title={`Shared with Me (${sharedData.length})`}
                            sharedRegistries={sharedData}
                        />
                    )}

                    {/* Empty State */}
                    {totalRegistries === 0 && (
                        <div className='text-center py-16'>
                            <div className='bg-white rounded-2xl p-12 shadow-sm border-2 border-dashed border-neutral-200 max-w-lg mx-auto'>
                                <Icon icon="material-symbols:baby-changing-station" className="h-20 w-20 text-neutral-400 mx-auto mb-6" />
                                <h3 className='text-title-desktop text-neutral-600 mb-4'>No Registries Yet</h3>
                                <p className='text-body-desktop text-neutral-500 mb-8'>
                                    Create your first baby registry to start your journey. You can add services,
                                    share with family and friends, and track contributions.
                                </p>
                                <FilledButton
                                    onClick={() => router.push('/mom/registries/new')}
                                    className='flex items-center gap-2 mx-auto'
                                >
                                    <Icon icon="material-symbols-light:add" className="h-5 w-5" />
                                    Create Your First Pamper Registry
                                </FilledButton>
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    {totalRegistries > 0 && (
                        <QuickActions
                            title='Quick Actions'
                            descrption='Manage your registries and get help from your community'
                            actions={
                                <div className='flex flex-wrap gap-3'>
                                    <FilledButton
                                        onClick={() => router.push('/mom/registries/new')}
                                        className='flex items-center gap-2 bg-primary-500 hover:bg-primary-600'
                                    >
                                        <Icon icon="material-symbols-light:add" className="h-5 w-5" />
                                        New Registry
                                    </FilledButton>
                                    <FilledButton
                                        onClick={() => router.push('/mom/settings')}
                                        className='flex items-center gap-2 bg-neutral-500 hover:bg-neutral-600'
                                    >
                                        <Icon icon="material-symbols-light:settings-outline" className="h-5 w-5" />
                                        Settings
                                    </FilledButton>
                                </div>
                            }
                        />
                    )}
                </div>
            </section>
        </main>
    )
}

export default Page