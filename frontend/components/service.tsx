"use client";

import { Service } from "@/lib/services/registry/types";
import { Icon } from "@iconify/react";
import React from "react";

// --- ServiceHero ---
interface ServiceHeroProps {
    service: Service;
    setShowContributeForm: (show: boolean) => void;
    completionPercentage: string;
}
export function ServiceHero({ service, setShowContributeForm, completionPercentage }: ServiceHeroProps) {
    return (
        <section className="bg-gradient-to-r from-pink-100 to-purple-100 p-8 text-center">
            <h1 className="text-3xl font-bold mb-2">{service.name}</h1>
            <p className="text-lg text-neutral-700 mb-4">{service.description}</p>
            <div className="w-full bg-neutral-200 rounded-full h-4 mb-4 max-w-lg mx-auto">
                <div
                    className="bg-gradient-to-r from-pink-500 to-purple-500 h-4 rounded-full"
                    style={{ width: `${completionPercentage}%` }}
                ></div>
            </div>
            <p className="mb-4">{completionPercentage}% funded</p>
            <button onClick={() => setShowContributeForm(true)} className="bg-primary-500 text-white px-6 py-2 rounded-lg">
                Add Manual Contribution
            </button>
        </section>
    );
}

// --- ServiceDetailsCard ---
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

// --- ServiceQuickStatCard ---
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

// --- ServiceTimelineCard ---
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

// --- ServiceContributionsCard ---
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

// --- ServiceContributionFormModal ---
interface ServiceContributionFormModalProps {
    showContributeForm: boolean;
    setShowContributeForm: (show: boolean) => void;
}
export function ServiceContributionFormModal({ showContributeForm, setShowContributeForm }: ServiceContributionFormModalProps) {
    if (!showContributeForm) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Add Manual Contribution</h2>
                <p>This form is for the registry owner to manually add offline contributions.</p>
                <button onClick={() => setShowContributeForm(false)} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
                    Close
                </button>
            </div>
        </div>
    );
}