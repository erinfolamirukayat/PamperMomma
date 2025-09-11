"use client";

import { Service } from "@/lib/services/registry/types";

interface ServiceDetailsCardProps {
    service: Service;
}
export function ServiceDetailsCard({ service }: ServiceDetailsCardProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-2">
            <h3 className="text-xl font-bold mb-4">Service Details</h3>
            <p><strong>Total Cost:</strong> ${service.total_cost}</p>
            <p><strong>Hours:</strong> {service.hours}</p>
            <p><strong>Cost per Hour:</strong> ${service.cost_per_hour}</p>
        </div>
    );
}