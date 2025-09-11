import { useMemo } from 'react';
import { Registry, Service } from '../services/registry/types';

export function useRegistryData(registry?: Registry | null) {
    return useMemo(() => {
        const services = registry?.services ?? [];

        const availableServices = services.filter((service: Service) => service.is_available && !service.is_completed);
        const completedServices = services.filter((service: Service) => service.is_completed);

        const totalRaised = services.reduce((sum, service) => sum + parseFloat(service.total_contributions || '0'), 0);
        const totalCost = services.reduce((sum, service) => sum + parseFloat(service.total_cost || '0'), 0);
        const totalWithdrawn = services.reduce((sum, service) => sum + parseFloat(service.total_withdrawn || '0'), 0);
        const availableBalance = services.reduce((sum, service) => sum + parseFloat(service.available_withdrawable_amount || '0'), 0);

        return {
            availableServices,
            completedServices,
            totalRaised,
            totalCost,
            totalWithdrawn,
            availableBalance,
        };
    }, [registry]);
}