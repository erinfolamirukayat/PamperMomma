"use client";

import { Service } from "@/lib/services/registry/types";

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