"use client";

import { Service } from "@/lib/services/registry/types";
import { useState } from "react";
import { Icon } from "@iconify/react";

interface ContributionInfoModalProps {
    service: Service;
    registryOwnerName: string;
    onClose: () => void;
    onSubmit: (amount: number, name: string, email: string) => void;
    isSubmitting: boolean;
}

export function ContributionInfoModal({ service, registryOwnerName, onClose, onSubmit, isSubmitting }: ContributionInfoModalProps) {
    const [amount, setAmount] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const totalCost = parseFloat(service.total_cost || '0');
    const totalContributions = parseFloat(service.total_contributions || '0');
    const amountRemaining = totalCost - totalContributions;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const contributionAmount = parseFloat(amount);

        if (isNaN(contributionAmount) || contributionAmount < 10.00) {
            setError('Minimum contribution is $10.00.');
            return;
        }
        if (!name.trim()) {
            setError('Please enter your name.');
            return;
        }
        if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setError('');
        onSubmit(contributionAmount, name, email);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 overflow-y-auto p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-800">
                    <Icon icon="material-symbols:close" className="h-6 w-6" />
                </button>

                <h2 className="text-title-desktop text-neutral-800 font-bold mb-2">Contribute to {service.name}</h2>
                <p className="text-body-desktop text-neutral-600 mb-6">
                    Let {registryOwnerName} know who to thank! This will help them keep track of all the wonderful support they've received.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">Your Name</label>
                        <input id="name" type="text" placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-neutral-300 rounded-lg py-2 px-3 focus:ring-primary-500 focus:border-primary-500" required />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">Your Email</label>
                        <input id="email" type="email" placeholder="jane.doe@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-neutral-300 rounded-lg py-2 px-3 focus:ring-primary-500 focus:border-primary-500" required />
                    </div>
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-neutral-700 mb-1">Amount</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                            <input id="amount" type="number" placeholder="50.00" min="10.00" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full border border-neutral-300 rounded-lg py-2 pl-7 pr-3 focus:ring-primary-500 focus:border-primary-500" required />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-body-small text-center bg-red-50 p-3 rounded-lg">{error}</p>}

                    <button type="submit" disabled={isSubmitting} className="w-full bg-primary-500 text-white font-bold py-3 px-4 rounded-lg mt-6 hover:bg-primary-600 disabled:bg-neutral-300 flex items-center justify-center">
                        {isSubmitting ? (
                            <Icon icon="line-md:loading-twotone-loop" className="h-6 w-6" />
                        ) : (
                            <span>Proceed to Payment</span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}