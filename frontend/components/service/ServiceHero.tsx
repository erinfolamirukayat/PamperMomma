"use client";

import { Service } from "@/lib/services/registry/types";
import { Icon } from "@iconify/react";

interface ServiceHeroProps {
    service: Service;
    setShowContributeForm: (show: boolean) => void;
    context: 'owner' | 'shared';
}
export function ServiceHero({ service, setShowContributeForm, context }: ServiceHeroProps) {
    const totalCost = parseFloat(service.total_cost || '0');
    const totalContributions = parseFloat(service.total_contributions || '0');
    const isOverfunded = totalContributions > totalCost;
    const progressPercentage = totalCost > 0 ? Math.min((totalContributions / totalCost) * 100, 100) : 0;
    const displayPercentage = totalCost > 0 ? ((totalContributions / totalCost) * 100).toFixed(0) : '0';

    return (
        <section className="bg-gradient-to-r from-pink-100 to-purple-100 p-8 text-center">
            <h1 className="text-3xl font-bold mb-2">{service.name}</h1>
            <p className="text-lg text-neutral-700 mb-4">{service.description}</p>
            <div className="w-full bg-neutral-200 rounded-full h-4 mb-4 max-w-lg mx-auto">
                <div
                    className={`${isOverfunded ? 'bg-green-500' : 'bg-gradient-to-r from-pink-500 to-purple-500'} h-4 rounded-full transition-all duration-500`}
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>
            <div className={`flex items-center justify-center gap-2 mb-4 ${isOverfunded ? 'text-green-600 font-semibold' : 'text-neutral-700'}`}>
                {isOverfunded && <Icon icon="material-symbols:check-circle-outline" className="h-5 w-5" />}
                <p>{isOverfunded ? 'Goal Surpassed!' : `${displayPercentage}% funded`}</p>
            </div>
            {context === 'owner' && (
                <button onClick={() => setShowContributeForm(true)} className="bg-primary-500 text-white px-6 py-2 rounded-lg">
                    Add Manual Contribution
                </button>
            )}
        </section>
    );
}