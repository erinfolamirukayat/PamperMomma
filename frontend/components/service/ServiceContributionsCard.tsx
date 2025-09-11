"use client";

import { Service } from "@/lib/services/registry/types";

interface ServiceContributionsCardProps {
    service: Service;
    setShowContributeForm: (show: boolean) => void;
}
export function ServiceContributionsCard({ service }: ServiceContributionsCardProps) {
    const contributions = service.contributions || [];
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Contributions</h3>
            {contributions.length > 0 ? (
                <ul>
                    {contributions.map((c, i) => (
                        <li key={i} className="border-b py-2 flex justify-between">
                            <span>{c.contributor_name || 'Anonymous'}</span>
                            <span>${parseFloat(c.amount).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No contributions yet.</p>
            )}
        </div>
    );
}