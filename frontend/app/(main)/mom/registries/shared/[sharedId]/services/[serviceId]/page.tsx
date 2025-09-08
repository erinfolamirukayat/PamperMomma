'use client'

import { Service } from '@/lib/services/registry/types'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { ServiceContributionFormModal, ServiceDetailsCard, ServiceHero, ServiceQuickStatCard, ServiceTimelineCard } from '@/components/service'
import { useHulkFetch } from 'hulk-react-utils'

function Page() {
    const { sharedId, serviceId } = useParams()
    const [showContributeForm, setShowContributeForm] = useState(false)

    const {
        dispatch: goService,
        data: serviceData
    } = useHulkFetch<Service>(`/registries/shared/${sharedId}/services/${serviceId}`)

    useEffect(() => {
        if (serviceId) {
            goService({ method: 'GET' });
        }
    }, [serviceId])

    // Calculate completion percentage
    const completionPercentage = serviceData ?
        ((parseFloat(serviceData.total_contributions) / parseFloat(serviceData.total_cost)) * 100).toFixed(1) : "0.0";

    if (!serviceData) return null;

    return (
        <main className='relative min-h-full flex-1'>
            {/* Hero Section */}
            <ServiceHero
                service={serviceData}
                setShowContributeForm={setShowContributeForm}
                completionPercentage={completionPercentage}
            />

            {/* Main Content */}
            <section className='px-6 sm:px-12 py-8'>
                <div className='max-w-4xl mx-auto space-y-8'>
                    {/* Service Details Grid */}
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                        {/* Service Information Card */}
                        <ServiceDetailsCard service={serviceData} />

                        {/* Quick Stats Sidebar */}
                        <div className='space-y-4'>
                            <ServiceQuickStatCard service={serviceData} />

                            {/* Service Timeline */}
                            <ServiceTimelineCard service={serviceData} />
                        </div>
                    </div>

                    {/* Contributions Section */}
                    {/* <ServiceContributionsCard service={serviceData} setShowContributeForm={setShowContributeForm} /> */}
                </div>
            </section>

            {/* Contribution Form Modal */}
            <ServiceContributionFormModal
                setShowContributeForm={setShowContributeForm}
                showContributeForm={showContributeForm}
            />
        </main>
    )
}

export default Page



