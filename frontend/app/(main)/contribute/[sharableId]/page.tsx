"use client";

import { useParams } from 'next/navigation';
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Icon } from '@iconify/react';
import { RegistryHeader, RegistryOverview } from '@/components/registry';
import { formatDate } from '@/lib/helper';
import { ServiceWidget } from '@/components/service/ServiceWidget';
import { HulkFetchErrorProps, useHulkFetch } from 'hulk-react-utils';
import { PublicRegistryProps, Service } from '@/lib/services/registry/types';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ContributionModal } from '@/components/service/ContributionModal';
import { useRegistryData } from '@/lib/hooks/useRegistryData';


function Page() {
    const stripePromise = useMemo(() => {
        const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
        return key ? loadStripe(key) : null;
    }, []);

    const { sharableId } = useParams();
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState<HulkFetchErrorProps | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    const fetchCallbacks = useMemo(() => ({
        onSuccess: () => setStatus('success'),
        onError: (e: HulkFetchErrorProps) => {
            setStatus('error');
            setError(e);
        }
    }), []);

    const {
        dispatch: goRegistries,
        data: registriesData
    } = useHulkFetch<PublicRegistryProps>(`/registries/public/${sharableId}/`, fetchCallbacks);

    const paymentIntentCallbacks = useMemo(() => ({
        onSuccess: (data) => {
            setClientSecret(data.clientSecret);
            setIsModalOpen(true);
        },
        onError: (e) => {
            console.error("Failed to create payment intent:", e);
        }
    }), []);

    const { dispatch: createPaymentIntent } = useHulkFetch<{ clientSecret: string }>('/registries/payments/create-payment-intent/', paymentIntentCallbacks);

    useEffect(() => {
        if (sharableId) {
            setStatus('loading');
            goRegistries({ method: 'GET' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sharableId]);

    const handleInitiateContribution = useCallback((service: Service, amount: number) => {
        setSelectedService(service);
        createPaymentIntent({
            method: 'POST',
            body: JSON.stringify({ service_id: service.id, amount })
        });
    }, [createPaymentIntent]);

    const { availableServices, completedServices, totalRaised, totalCost } = useRegistryData(registriesData);

    if (status === 'loading') {
        return (
            <div className='flex-1 flex items-center justify-center'>
                <Icon icon="line-md:loading-twotone-loop" className="h-12 w-12 text-primary-500" />
            </div>
        )
    }

    if (status === 'error') {
        return (
            <div className='flex-1 flex items-center justify-center text-center p-6'>
                <p className='text-red-500'>Error loading registry: {error?.message}</p>
            </div>
        )
    }

    return (
        <main className='relative min-h-full flex-1'>
            {isModalOpen && clientSecret && selectedService && stripePromise && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <ContributionModal
                        sharableId={sharableId as string}
                        serviceId={selectedService.id}
                        serviceName={selectedService.name}
                        clientSecret={clientSecret}
                        onClose={() => {
                            setIsModalOpen(false);
                            setClientSecret(null);
                            setSelectedService(null);
                        }}
                    />
                </Elements>
            )}

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
                        available_services={String(availableServices.length)}
                        completed_services={String(completedServices.length)}
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
                            onContribute={handleInitiateContribution}
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