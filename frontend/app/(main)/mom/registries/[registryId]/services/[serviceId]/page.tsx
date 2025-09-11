'use client'

import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { ServiceDetailView } from '@/components/service/ServiceDetailView';
import { useServiceDetails } from '@/lib/hooks/useServiceDetails';

function Page() {
    const { serviceId } = useParams()
    const [showContributeForm, setShowContributeForm] = useState(false)
    const { serviceData, completionPercentage } = useServiceDetails(serviceId);

    if (!serviceData) return null;

    return <ServiceDetailView
        serviceData={serviceData}
        showContributeForm={showContributeForm}
        setShowContributeForm={setShowContributeForm}
        completionPercentage={completionPercentage}
        context='owner'
    />
}

export default Page
