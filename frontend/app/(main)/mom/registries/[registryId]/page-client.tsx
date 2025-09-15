"use client";

import { ServiceWidget } from '@/components/service/ServiceWidget';
import Link from 'next/link';
import { Registry } from '@/lib/services/registry/types';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { Icon } from '@iconify/react';
import { FinancialSummary, RegistryHeader, RegistryOverview } from '@/components/registry';
import { formatDate } from '@/lib/helper';
import { HulkFetchErrorProps, useHulkAlert, useHulkFetch } from 'hulk-react-utils';
import { useRegistryData } from '@/lib/hooks/useRegistryData';
import { ErrorModal } from '@/components/modals';

interface PageClientProps {
    accessToken: string | null;
}

function PageClient({ accessToken }: PageClientProps) {
    const { registryId } = useParams();
    const alert = useHulkAlert();
    const {
        dispatch: goRegistries,
        data: registriesData
    } = useHulkFetch<Registry>(`/registries/r/${registryId}/`);

    useEffect(() => {
        if (registryId) {
            goRegistries({ method: 'GET' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [registryId])

    const handleDeleteService = async (serviceId: number) => {
        if (!accessToken) {
            console.error("Authentication token not found.");
            // Optionally, redirect to login or show an error message
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/registries/services/${serviceId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.ok) {
                // Refetch registry data to update the UI
                goRegistries({ method: 'GET' });
            } else {
                const errorData: HulkFetchErrorProps = { message: "Failed to delete service", details: [await response.text()], code: response.status };
                console.error(errorData.message, errorData.details);
                alert.push(<ErrorModal error={errorData} />, {
                    alertId: `delete-service-error-${serviceId}`
                });
            }
        } catch (error) {
            const errorData: HulkFetchErrorProps = { message: "An error occurred while deleting the service.", details: [(error as Error).message], code: 500 };
            console.error(errorData.message, errorData.details);
            alert.push(<ErrorModal error={errorData} />, {
                alertId: `delete-service-catch-error-${serviceId}`
            });
        }
    };

    const { availableServices, completedServices, totalRaised, totalCost, totalWithdrawn, availableBalance } = useRegistryData(registriesData);

    return (
        <main className='relative min-h-full flex-1'>
            {registriesData && (
                <>
                    {/* Registry Header */}
                    <RegistryHeader
                        registryname={registriesData.name}
                        registryWelcomeMessage={registriesData.welcome_message}
                        babiesCount={registriesData.babies_count}
                        arrivalDate={formatDate(registriesData.arrival_date)}
                        isFirstTime={registriesData.is_first_time}
                        shareableId={registriesData.shareable_id}
                    />

                    {/* Dashboard Cards */}
                    <RegistryOverview
                        available_services={availableServices.length.toString()}
                        completed_services={completedServices.length.toString()}
                        total_raised={`$${totalRaised.toFixed(2)}`}
                        total_cost={`$${totalCost.toFixed(2)}`}
                    />

                    {/* Financial Summary */}
                    {(totalRaised > 0) && (
                        <FinancialSummary
                            total_contribution={totalRaised.toFixed(2)}
                            total_withdrawn={totalWithdrawn.toFixed(2)}
                            available_balance={(availableBalance).toFixed(2)}
                        />
                    )}
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
                            context='mom'
                            onDelete={handleDeleteService}
                        />
                    )}

                    {/* Completed Services */}
                    {completedServices.length > 0 && (
                        <ServiceWidget
                            title='Completed Services'
                            description='These services have been fully funded!'
                            services={completedServices}
                            context='mom'
                            onDelete={handleDeleteService}
                        />
                    )}

                    {/* Empty State */}
                    {(!registriesData?.services || registriesData.services.length === 0) && (
                        <div className='text-center py-12'>
                            <Icon icon="material-symbols-light:inbox-outline" className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
                            <h3 className='text-title-desktop text-neutral-600 mb-2'>No Services Yet</h3>
                            <p className='text-body-desktop text-neutral-500 mb-6'>
                                Start by adding services to your registry to receive help from your community.
                            </p>
                            <Link href={`/mom/registries/${registryId}/services/new`}>
                                <button className='px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-label-desktop'>
                                    Add First Service
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}

export default PageClient
