"use client";

import { Icon } from "@iconify/react";
import { FilledButton } from "../buttons";

interface PayoutSetupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContinue: () => void;
    isLoading: boolean;
}

export function PayoutSetupModal({ isOpen, onClose, onContinue, isLoading }: PayoutSetupModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-800">
                    <Icon icon="material-symbols:close" className="h-6 w-6" />
                </button>
                <div className="text-center">
                    <Icon icon="logos:stripe" className="h-12 w-auto mx-auto mb-4" />
                    <h2 className="text-title-desktop font-bold mb-2">You're being redirected to Stripe</h2>
                    <p className="text-body-desktop text-neutral-600 mb-6">
                        To receive your funds, you'll need to provide some information to our secure payment partner, Stripe.
                    </p>
                </div>

                <div className="space-y-4 bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                    <h3 className="font-semibold text-neutral-800">Please use the following information:</h3>
                    <div className="space-y-2 text-sm">
                        <p>If asked for your <span className="font-bold">Business Type</span>, please select:</p>
                        <p className="bg-white p-2 rounded border border-dashed border-neutral-300 font-mono text-primary-600">Individual</p>
                    </div>
                    <div className="space-y-2 text-sm">
                        <p>When asked for your <span className="font-bold">Industry</span>, please select:</p>
                        <p className="bg-white p-2 rounded border border-dashed border-neutral-300 font-mono text-primary-600">Personal Services &gt; Child Day Care Services</p>
                    </div>
                    <div className="space-y-2 text-sm">
                        <p>When asked for your <span className="font-bold">Business Website</span>, please enter:</p>
                        <p className="bg-white p-2 rounded border border-dashed border-neutral-300 font-mono text-primary-600">pampermomma.com</p>
                    </div>
                </div>

                <FilledButton onClick={onContinue} disabled={isLoading} className="w-full mt-6">
                    {isLoading ? (
                        <Icon icon="line-md:loading-twotone-loop" className="h-6 w-6" />
                    ) : (
                        'Continue to Stripe'
                    )}
                </FilledButton>
            </div>
        </div>
    );
}