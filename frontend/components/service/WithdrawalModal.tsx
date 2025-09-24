"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { FilledButton } from "../buttons";
import { useHulkFetch } from "hulk-react-utils";
import { useParams } from "next/navigation";

interface WithdrawalModalProps {
    isOpen: boolean;
    onClose: () => void;
    availableBalance: number;
    onSuccess: () => void;
}

type Step = 'amount' | 'verify';

export function WithdrawalModal({ isOpen, onClose, availableBalance, onSuccess }: WithdrawalModalProps) {
    const { registryId } = useParams();
    const [step, setStep] = useState<Step>('amount');
    const [amount, setAmount] = useState(availableBalance.toFixed(2));
    const [otp, setOtp] = useState('');
    const [deviceIdentity, setDeviceIdentity] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { dispatch: initiateWithdrawal } = useHulkFetch<{ device_identity: string }>(
        `/registries/r/${registryId}/initiate-withdrawal-verification/`, {
        onSuccess: (data) => {
            setDeviceIdentity(data.device_identity);
            setStep('verify');
            setIsLoading(false);
        },
        onError: (e) => {
            setError(e.details?.[0] || e.message || "Failed to start withdrawal process.");
            setIsLoading(false);
        }
    });

    const { dispatch: finalizeWithdrawal } = useHulkFetch(
        `/registries/r/${registryId}/withdraw/`, {
        onSuccess: () => {
            onSuccess();
            onClose();
            setIsLoading(false);
        },
        onError: (e) => {
            setError(e.details?.[0] || e.message || "Withdrawal failed.");
            setIsLoading(false);
        }
    });

    if (!isOpen) return null;

    const handleAmountSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const withdrawalAmount = parseFloat(amount);

        if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
            setError("Please enter a valid amount.");
            return;
        }
        if (withdrawalAmount > availableBalance) {
            setError("Amount cannot exceed available balance.");
            return;
        }
        initiateWithdrawal({ method: 'POST', body: JSON.stringify({ amount: withdrawalAmount }) });
    };

    const handleVerificationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        if (!otp || otp.length !== 6) {
            setError("Please enter the 6-digit code from your email.");
            return;
        }
        finalizeWithdrawal({
            method: 'POST',
            body: JSON.stringify({ amount: parseFloat(amount), otp, device_identity: deviceIdentity })
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-800">
                    <Icon icon="material-symbols:close" className="h-6 w-6" />
                </button>

                {step === 'amount' && (
                    <form onSubmit={handleAmountSubmit}>
                        <h2 className="text-title-desktop font-bold mb-2">Withdraw Funds</h2>
                        <p className="text-body-desktop text-neutral-600 mb-6">
                            Available balance: <span className="font-bold text-green-600">${availableBalance.toFixed(2)}</span>
                        </p>
                        <div>
                            <label htmlFor="withdrawal-amount" className="block text-sm font-medium text-neutral-700 mb-1">Amount to Withdraw</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                                <input id="withdrawal-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full border border-neutral-300 rounded-lg py-2 pl-7 pr-3 focus:ring-primary-500 focus:border-primary-500" required />
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
                        <FilledButton type="submit" disabled={isLoading} className="w-full mt-6 bg-green-600 hover:bg-green-700">
                            {isLoading ? <Icon icon="line-md:loading-twotone-loop" className="h-6 w-6" /> : 'Continue'}
                        </FilledButton>
                    </form>
                )}

                {step === 'verify' && (
                    <form onSubmit={handleVerificationSubmit}>
                        <h2 className="text-title-desktop font-bold mb-2">Verify Your Request</h2>
                        <p className="text-body-desktop text-neutral-600 mb-6">
                            For your security, we've sent a 6-digit code to your email. Please enter it below to confirm your withdrawal of <span className="font-bold">${parseFloat(amount).toFixed(2)}</span>.
                        </p>
                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-neutral-700 mb-1">Verification Code</label>
                            <input
                                id="otp"
                                type="text"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full border border-neutral-300 rounded-lg py-2 px-3 text-center tracking-[0.5em] font-mono text-lg"
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
                        <FilledButton type="submit" disabled={isLoading} className="w-full mt-6 bg-green-600 hover:bg-green-700">
                            {isLoading ? <Icon icon="line-md:loading-twotone-loop" className="h-6 w-6" /> : 'Verify & Withdraw'}
                        </FilledButton>
                    </form>
                )}
            </div>
        </div>
    );
}