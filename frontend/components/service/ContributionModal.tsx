"use client";

import { useState } from 'react';
import {
    PaymentElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import { Icon } from '@iconify/react';

interface ContributionModalProps {
    sharableId: string;
    serviceId: number;
    serviceName: string;
    clientSecret: string;
    amount: number;
    onClose: () => void;
}

export function ContributionModal({ sharableId, serviceId, serviceName, clientSecret, amount, onClose }: ContributionModalProps) {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null); // Clear previous messages on a new submission attempt

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: `${window.location.origin}/contribution-success?sharable_id=${sharableId}&amount=${amount}`,
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message || "An unexpected error occurred.");
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsProcessing(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-2">Contribute to {serviceName}</h2>
                <p className="text-neutral-600 mb-6">Please enter your payment details below.</p>

                <form id="payment-form" onSubmit={handleSubmit}>
                    <PaymentElement id="payment-element" />
                    <button
                        disabled={isProcessing || !stripe || !elements}
                        id="submit"
                        className="w-full bg-primary-500 text-white font-bold py-3 px-4 rounded-lg mt-6 hover:bg-primary-600 disabled:bg-neutral-300 flex items-center justify-center"
                    >
                        {isProcessing ? (
                            <Icon icon="line-md:loading-twotone-loop" className="h-6 w-6" />
                        ) : (
                            <span>Pay now</span>
                        )}
                    </button>

                    {message && <div id="payment-message" className="text-red-500 mt-4 text-center">{message}</div>}
                </form>
                <button onClick={onClose} className="w-full text-center mt-4 text-neutral-500 hover:text-neutral-700">
                    Cancel
                </button>
            </div>
        </div>
    );
}