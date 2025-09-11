"use client";

import { Service } from "@/lib/services/registry/types";

interface ServiceQuickStatCardProps {
    service: Service;
}
export function ServiceQuickStatCard({ service }: ServiceQuickStatCardProps) {
    const amountRemaining = parseFloat(service.total_cost) - parseFloat(service.total_contributions);
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
            <p><strong>Raised:</strong> ${parseFloat(service.total_contributions).toFixed(2)}</p>
            <p><strong>Remaining:</strong> ${amountRemaining.toFixed(2)}</p>
        </div>
    );
}