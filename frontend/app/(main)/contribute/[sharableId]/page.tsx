"use client";

import { useParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { Icon } from '@iconify/react';
import { RegistryHeader, RegistryOverview } from '@/components/registry';
import { formatDate } from '@/lib/helper';
import { ServiceWidget } from '@/components/service';
import { useHulkFetch } from 'hulk-react-utils';
import { PublicRegistryProps } from '@/lib/services/registry/types';


function Page() {
    const { sharableId } = useParams();
    const {
        dispatch: goRegistries,
        data: registriesData
    } = useHulkFetch<PublicRegistryProps>(`/registries/public/${sharableId}/`);

    useEffect(() => {
        if (sharableId) {
            goRegistries({ method: 'GET' });
        }
    }, [sharableId])

    const availableServices = registriesData?.services?.filter((service) => service.is_available && !service.is_completed) ?? [];
    const completedServices = registriesData?.services?.filter((service) => service.is_completed) ?? [];

    // Calculate total contributions and costs
    const totalRaised = registriesData?.services?.reduce((sum, service) =>
        sum + parseFloat(service.total_contributions || '0'), 0) ?? 0;
    const totalCost = registriesData?.services?.reduce((sum, service) =>
        sum + parseFloat(service.total_cost || '0'), 0) ?? 0;

    return (
        <main className='relative min-h-full flex-1'>
            {registriesData && (
                <>
                    {/* Registry Header */}
                    <RegistryHeader
                        registryname={registriesData.name}
                        babiesCount={registriesData.babies_count}
                        arrivalDate={formatDate(registriesData.arrival_date)}
                        isFirstTime={registriesData.is_first_time}
                        shareableId={registriesData.shareable_id}
                        registryWelcomeMessage={registriesData.welcome_message}
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
                <div className='max-w-6xl mx-auto space-y-12'>
                    {/* Available Services */}
                    {availableServices.length > 0 && (
                        <ServiceWidget
                            title='Available Services'
                            description='Help support these services for the new mom'
                            services={availableServices}
                            context='public'
                        />
                    )}

                    {/* Completed Services */}
                    {completedServices.length > 0 && (
                        <ServiceWidget
                            title='Completed Services'
                            description='These services have been fully funded!'
                            services={completedServices}
                            context='public'
                        />
                    )}

                    {/* Empty State */}
                    {(!registriesData?.services || registriesData.services.length === 0) && (
                        <div className='text-center py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 rounded-3xl border border-pink-100'>
                            <div className='max-w-md mx-auto'>
                                <div className='bg-gradient-to-r from-pink-100 to-purple-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center'>
                                    <Icon icon="material-symbols-light:baby-changing-station" className="h-12 w-12 text-pink-500" />
                                </div>
                                <h3 className='text-title-desktop-large text-neutral-800 font-bold mb-4'>No Services Yet</h3>
                                <p className='text-body-desktop text-neutral-600 mb-8 leading-relaxed'>
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
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}

export default Page