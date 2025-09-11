import { useHulkFetch } from 'hulk-react-utils';
import { Service } from '../services/registry/types';
import { useEffect, useMemo } from 'react';

export function useServiceDetails(serviceId: string | string[] | undefined) {
    const {
        dispatch: goService,
        data: serviceData
    } = useHulkFetch<Service>(serviceId ? `/registries/services/${serviceId}/` : null);

    useEffect(() => {
        if (serviceId) {
            goService({ method: 'GET' });
        }
    }, [serviceId, goService]);

    const completionPercentage = useMemo(() => {
        if (!serviceData) return "0.0";
        const totalContributions = parseFloat(serviceData.total_contributions || '0');
        const totalCost = parseFloat(serviceData.total_cost || '0');
        if (totalCost === 0) return "0.0";
        return ((totalContributions / totalCost) * 100).toFixed(1);
    }, [serviceData]);

    return { serviceData, completionPercentage };
}