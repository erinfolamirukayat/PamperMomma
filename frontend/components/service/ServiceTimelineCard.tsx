"use client";

import { Service } from "@/lib/services/registry/types";

interface ServiceTimelineCardProps {
    service: Service;
}
export function ServiceTimelineCard({ service }: ServiceTimelineCardProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Timeline</h3>
            <p>Created: {new Date(service.created_at).toLocaleDateString()}</p>
        </div>
    );
}