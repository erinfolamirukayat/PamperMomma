'use client';

import { Service } from '@/lib/services/registry/types';
import { ServiceContributionFormModal, ServiceContributionsCard, ServiceDetailsCard, ServiceHero, ServiceQuickStatCard, ServiceTimelineCard } from '@/components/service.tsx';

interface ServiceDetailViewProps {
    serviceData: Service;
    showContributeForm: boolean;
    setShowContributeForm: (show: boolean) => void;
    completionPercentage: string;
    context: 'owner' | 'shared';
}

export function ServiceDetailView({
    serviceData,
    showContributeForm,
    setShowContributeForm,
    completionPercentage,
    context
}: ServiceDetailViewProps) {
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
                    {context === 'owner' && (
                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                            <ServiceDetailsCard service={serviceData} />
                            <div className='space-y-4'>
                                <ServiceQuickStatCard service={serviceData} />
                                <ServiceTimelineCard service={serviceData} />
                            </div>
                        </div>
                    )}

                    <ServiceContributionsCard service={serviceData} setShowContributeForm={setShowContributeForm} />
                </div>
            </section>

            {/* Contribution Form Modal */}
            <ServiceContributionFormModal
                setShowContributeForm={setShowContributeForm}
                showContributeForm={showContributeForm}
            />
        </main>
    );
}