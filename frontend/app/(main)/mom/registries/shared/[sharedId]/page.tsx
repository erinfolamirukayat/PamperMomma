"use client";

import { ServiceWidget } from '@/components/service';
import { SharedRegistry } from '@/lib/services/registry/types';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { Icon } from '@iconify/react';
import { RegistryHeader, RegistryOverview } from '@/components/registry';
import { formatDate } from '@/lib/helper';
import { useHulkFetch } from 'hulk-react-utils';

function Page() {
    const { sharedId } = useParams();
    const {
        dispatch: goSharedRegistries,
        data: sharedRegistriesData
    } = useHulkFetch<SharedRegistry>(`/registries/shared/${sharedId}/`);

    useEffect(() => {
        if (sharedId) {
            goSharedRegistries({ method: 'GET' });
        }
    }, [sharedId])

    const registry = sharedRegistriesData?.registry;

    const availableServices = registry?.services?.filter((service) => service.is_available && !service.is_completed) ?? [];
    const completedServices = registry?.services?.filter((service) => service.is_completed) ?? [];



    // Calculate total contributions and costs
    const totalRaised = sharedRegistriesData?.registry?.services?.reduce((sum, service) =>
        sum + parseFloat(service.total_contributions || '0'), 0) ?? 0;
    const totalCost = sharedRegistriesData?.registry?.services?.reduce((sum, service) =>
        sum + parseFloat(service.total_cost || '0'), 0) ?? 0;

    return (
        <main className='relative min-h-full flex-1'>
            {registry && (
                <>
                    {/* Registry Header */}
                    <RegistryHeader
                        registryname={registry.name}
                        babiesCount={registry.babies_count}
                        arrivalDate={formatDate(registry.arrival_date)}
                        isFirstTime={registry.is_first_time}
                        shareableId={registry.shareable_id}
                    />

                    {/* Dashboard Cards */}
                    <RegistryOverview
                        available_services={availableServices.length.toString()}
                        completed_services={completedServices.length.toString()}
                        total_raised={`$${totalRaised.toFixed(2)}`}
                        total_cost={`$${totalCost.toFixed(2)}`}
                    />
                </>
            )}

            {/* Services Sections */}
            <section className='px-6 sm:px-12 pb-12'>
                <div className='max-w-6xl mx-auto space-y-8'>

                    {/* Available Services */}
                    {availableServices.length > 0 && (
                        <ServiceWidget
                            title='Available Services'
                            description='Help support these services for the new mom'
                            services={availableServices}
                            context='shared'
                        />
                    )}

                    {/* Completed Services */}
                    {completedServices.length > 0 && (
                        <ServiceWidget
                            title='Completed Services'
                            description='These services have been fully funded!'
                            services={completedServices}
                            context='shared'
                        />
                    )}

                    {/* Empty State */}
                    {(!registry?.services || registry.services.length === 0) && (
                        <div className='text-center py-12'>
                            <Icon icon="material-symbols-light:inbox-outline" className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
                            <h3 className='text-title-desktop text-neutral-600 mb-2'>No Services Yet</h3>
                            <p className='text-body-desktop text-neutral-500 mb-6'>
                                This registry is just getting started! Reach out to the expecting mom to see how you can help support their journey.
                            </p>
                            <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                                <button className='bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300'>
                                    Contact Mom
                                </button>
                                <button className='border border-pink-300 text-pink-600 px-6 py-3 rounded-xl font-semibold hover:bg-pink-50 transition-all duration-300'>
                                    Share Registry
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}

export default Page
