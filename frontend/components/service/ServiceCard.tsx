"use client";

import { Service } from "@/lib/services/registry/types";
import { Icon } from "@iconify/react";
import { useCallback, useState } from "react";

interface ServiceCardProps {
    service: Service;
    context: 'public' | 'owner' | 'mom' | 'shared';
    onContribute?: (service: Service, amount: number) => void;
}

export function ServiceCard({ service, context, onContribute }: ServiceCardProps) {
    const [contributionAmount, setContributionAmount] = useState('');
    const [error, setError] = useState('');

    const totalCost = parseFloat(service.total_cost || '0');
    const totalContributions = parseFloat(service.total_contributions || '0');
    const amountRemaining = totalCost - totalContributions;
    const isFullyFunded = amountRemaining <= 0;
    const progressPercentage = totalCost > 0 ? (totalContributions / totalCost) * 100 : 0;

    const handleContributeClick = useCallback(() => {
        const amount = parseFloat(contributionAmount);
        if (isNaN(amount) || amount < 0.50) {
            setError('Minimum contribution is $0.50.');
            return;
        }
        if (amount > amountRemaining) {
            setError(`Amount cannot exceed the remaining $${amountRemaining.toFixed(2)}.`);
            return;
        }
        setError('');
        onContribute?.(service, amount);
    }, [contributionAmount, amountRemaining, onContribute, service]);

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
                    <div className="flex items-center gap-2">
                        <div className="relative flex-grow">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                            <input
                                type="number"
                                placeholder="Amount"
                                min="0.50"
                                step="0.01"
                                disabled={isFullyFunded}
                                value={contributionAmount}
                                onChange={(e) => {
                                    setContributionAmount(e.target.value);
                                    setError('');
                                }}
                                className="w-full border border-neutral-300 rounded-lg py-2 pl-7 pr-3 focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-100"
                            />
                        </div>
                        <button
                            onClick={handleContributeClick}
                            disabled={isFullyFunded}
                            className="bg-primary-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
                        >
                            {isFullyFunded ? 'Funded' : 'Contribute'}
                        </button>
                    </div>
                    {error && <p className="text-red-500 text-body-small mt-2">{error}</p>}
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