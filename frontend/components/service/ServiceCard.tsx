"use client";

import { Service } from "@/lib/services/registry/types";
import { Icon } from "@iconify/react";
import { useCallback, useState } from "react";

interface ServiceCardProps {
    service: Service;
    context: 'public' | 'owner' | 'mom' | 'shared';
    onContribute?: (service: Service) => void;
}

export function ServiceCard({ service, context, onContribute }: ServiceCardProps) {
    const totalCost = parseFloat(service.total_cost || '0');
    const totalContributions = parseFloat(service.total_contributions || '0');
    const isFullyFunded = totalContributions >= totalCost;
    const progressPercentage = totalCost > 0 ? (totalContributions / totalCost) * 100 : 0;

    const handleContributeClick = useCallback(() => {
        onContribute?.(service);
    }, [onContribute, service]);

    return (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 flex flex-col">
            <h4 className="text-title-small font-bold text-neutral-800 mb-2">{service.name}</h4>
            <p className="text-body-small text-neutral-600 mb-4 flex-grow">{service.description}</p>

            <div className="mb-4">
                <div className="flex justify-between items-center mb-1 text-body-small font-medium">
                    <span className="text-neutral-600">Raised</span>
                    <span className="text-neutral-800">${totalContributions.toFixed(2)} / ${totalCost.toFixed(2)}</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2.5">
                    <div
                        className="bg-gradient-to-r from-pink-500 to-purple-500 h-2.5 rounded-full"
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
                    <button className="text-red-600 hover:text-red-800 p-2 rounded-full">
                        <Icon icon="material-symbols:delete-outline" className="h-5 w-5" />
                    </button>
                </div>
            )}
        </div>
    );
}