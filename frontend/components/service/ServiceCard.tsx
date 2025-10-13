"use client";

import { Service } from "@/lib/services/registry/types";
import { Icon } from "@iconify/react";
import { useRouter, useParams } from "next/navigation";
import { useCallback } from "react";

interface ServiceCardProps {
    service: Service;
    context: 'public' | 'owner' | 'mom' | 'shared';
    onContribute?: (service: Service) => void;
    onDelete?: (serviceId: number) => void;
}

export function ServiceCard({ service, context, onContribute, onDelete }: ServiceCardProps) {
    const router = useRouter();
    const { registryId } = useParams();

    const totalCost = parseFloat(service.total_cost || '0');
    const totalContributions = parseFloat(service.total_contributions || '0');
    const isFullyFunded = totalContributions >= totalCost;
    const isOverfunded = totalContributions > totalCost;
    const progressPercentage = totalCost > 0 ? Math.min((totalContributions / totalCost) * 100, 100) : 0;

    const handleContributeClick = useCallback(() => {
        onContribute?.(service);
    }, [onContribute, service]);

    const handleDeleteClick = useCallback(() => {
        if (window.confirm(`Are you sure you want to delete the "${service.name}" service? This action cannot be undone.`)) {
            onDelete?.(service.id);
        }
    }, [onDelete, service.id, service.name]);

    const handleCardClick = () => {
        // Navigate to service detail page only for owner/mom context
        if (context === 'owner' || context === 'mom') {
            router.push(`/mom/registries/${registryId}/services/${service.id}`);
        }
    };

    return (
        <div onClick={handleCardClick} className={`bg-white border border-neutral-200 rounded-2xl p-6 flex flex-col transition-all duration-300 ${(context === 'owner' || context === 'mom') && 'cursor-pointer hover:shadow-md hover:border-primary-300'}`}>
            <h4 className="text-title-small font-bold text-neutral-800 mb-2">{service.name}</h4>
            <p className="text-body-small text-neutral-600 mb-4 flex-grow">{service.description}</p>

            <div className="flex flex-row items-center justify-between gap-4 text-label-desktop-small mb-4">
                <div className="flex items-center gap-1 text-neutral-700">
                    <Icon icon="material-symbols-light:schedule-outline" className="h-5 w-5" />
                    <span className="font-medium">{service.hours}</span>
                    <span className="text-neutral-500">hrs</span>
                </div>

                <div className="flex items-center gap-1 text-neutral-700">
                    {/* <Icon icon="material-symbols-light:money-outline-rounded" className="h-5 w-5" /> */}
                    <span className="font-medium">${parseFloat(service.cost_per_hour).toFixed(2)}</span>
                    <span className="text-neutral-500">/hr</span>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex justify-between items-center mb-1 text-body-small font-medium">
                    <span className="text-neutral-600">
                        {isOverfunded ? 'Overfunded!' : 'Raised'}
                    </span>
                    <span className={`flex items-center gap-1 ${isOverfunded ? 'text-green-600 font-semibold' : 'text-neutral-800'}`}>
                        {isOverfunded && <Icon icon="material-symbols:check-circle-outline" className="h-4 w-4" />}
                        <span>${totalContributions.toFixed(2)} / ${totalCost.toFixed(2)}</span>
                    </span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2.5">
                    <div
                        className={`${isOverfunded ? 'bg-green-500' : 'bg-gradient-to-r from-pink-500 to-purple-500'} h-2.5 rounded-full transition-all duration-500`}
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </div>

            {context === 'public' && onContribute && (
                <div className="mt-auto">
                    <button
                        onClick={handleContributeClick}
                        disabled={isFullyFunded}
                        className="w-full bg-primary-500 text-white font-semibold px-4 py-3 rounded-lg hover:bg-primary-600 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
                    >
                        {isFullyFunded ? 'Goal Reached' : 'Contribute Now'}
                    </button>
                </div>
            )}

            {(context === 'owner' || context === 'mom') && (
                <div className="mt-auto flex justify-end gap-2">
                     <button className="text-neutral-600 hover:text-neutral-900 p-2 rounded-full">
                        <Icon icon="material-symbols:edit-outline" className="h-5 w-5" />
                    </button>
                    {!isFullyFunded && totalContributions === 0 && (
                        <button onClick={handleDeleteClick} className="text-red-600 hover:text-red-800 p-2 rounded-full">
                            <Icon icon="material-symbols:delete-outline" className="h-5 w-5" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}