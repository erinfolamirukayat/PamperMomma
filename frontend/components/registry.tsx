"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import { DashboardCard } from "./cards";
import { Registry, SharedRegistry } from "@/lib/services/registry/types";
import { formatDate, getDaysUntilArrival } from "@/lib/helper";
import { useRouter } from "next/navigation";

export interface RegistryHeaderProps {
    registryname: string;
    registryWelcomeMessage?: string;
    babiesCount: number;
    arrivalDate: string;
    isFirstTime: boolean;
    shareableId?: string;
}


export function RegistryHeader(props: RegistryHeaderProps) {
    const [copied, setCopied] = useState(false);
    const getSharableLink = () => {
        if (!props.shareableId) return '';
        return `${window.location.origin}/contribute/${props.shareableId}`;
    }
    const onShareClick = () => {
        if (props.shareableId) {
            navigator.clipboard.writeText(getSharableLink());
            setCopied(true);
            setTimeout(() => setCopied(false), 2500); // Reset after 2.5 seconds
        }
    }
    return (
        <section className='px-6 sm:px-12 py-8 bg-gradient-to-r from-primary-100 to-orange-100 border-b border-neutral-200'>
            <div className='max-w-6xl mx-auto'>
                <div className='flex flex-col lg:flex-row lg:items-baseline gap-12'>
                    <div className='space-y-2 flex-1 lg:basis-md'>
                        <h1 className='text-headline-mobile-large sm:text-headline-desktop text-neutral-900'>
                            {props.registryname}
                        </h1>
                        {props.registryWelcomeMessage && (
                            <p className='text-body-mobile-small lg:text-body-desktop-small text-neutral-600'>
                                {props.registryWelcomeMessage}
                            </p>
                        )}
                        <div className='flex flex-wrap items-center gap-4 text-label-desktop text-neutral-600'>
                            <span className='flex items-center gap-2'>
                                <Icon icon="material-symbols:baby-changing-station" className="h-5 w-5" />
                                {props.babiesCount} {props.babiesCount === 1 ? 'Baby' : 'Babies'}
                            </span>
                            <span className='flex items-center gap-2'>
                                <Icon icon="material-symbols-light:calendar-today-outline" className="h-5 w-5" />
                                Due: {props.arrivalDate}
                            </span>
                            {props.isFirstTime && (
                                <span className='flex items-center gap-2 text-primary-600'>
                                    <Icon icon="material-symbols:star-outline" className="h-5 w-5" />
                                    First Time Parent
                                </span>
                            )}
                        </div>
                    </div>
                    {props.shareableId && (
                        <button onClick={onShareClick} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-label-desktop ${copied ? 'bg-green-500 text-white' : 'bg-primary-500 text-white hover:bg-primary-600'}`}>
                            <Icon icon={copied ? "material-symbols:check-circle-outline-rounded" : "material-symbols-light:share-outline"} className="h-5 w-5" />
                            {copied ? 'Link Copied!' : 'Share Pamper Registry'}
                        </button>
                    )}
                </div>
            </div>
        </section>
    )
}


export interface RegistryOverviewProps {
    available_services: string,
    completed_services: string,
    total_raised: string,
    total_cost: string,
}

export function RegistryOverview(props: RegistryOverviewProps) {
    return (
        <section className='px-6 sm:px-12 py-8'>
            <div className='max-w-6xl mx-auto'>
                <h2 className='text-title-desktop-large text-neutral-900 mb-6'>Registry Overview</h2>
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6'>
                    <DashboardCard
                        title='Available Services'
                        description={props.available_services}
                    />
                    <DashboardCard
                        title='Fully Paid Services'
                        description={props.completed_services}
                    />
                    <DashboardCard
                        title='Total Raised'
                        description={props.total_raised}
                    />
                    <DashboardCard
                        title='Total Cost'
                        description={props.total_cost}
                    />
                </div>
            </div>
        </section>
    )
}


export interface FinancialSummaryProps {
    total_contribution: string,
    total_withdrawn: string,
    total_fees: string,
    stripe_balance: {
        available: string;
        pending: string;
    };
    payouts_enabled: boolean;
    onSetupPayoutsClick: () => void; // Kept for onboarding flow
    onWithdrawClick: () => void;
}


export function FinancialSummary(props: FinancialSummaryProps) {
    return (
        <section className='px-6 sm:px-12 pb-8'>
            <div className='max-w-6xl mx-auto'>
                <div className='bg-gradient-to-r from-green-100 to-orange-100 rounded-2xl p-6'>
                    <h3 className='text-title-desktop text-neutral-900 mb-4'>Financial Summary</h3>
                    <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                        <div className='text-center'>
                            <p className='text-label-desktop text-neutral-600'>Stripe Fees</p>
                            <p className='text-title-desktop-large text-red-600'>-${props.total_fees}</p>
                        </div>
                        <div className='text-center'>
                            <p className='text-label-desktop text-neutral-600'>Total Withdrawn</p>
                            <p className='text-title-desktop-large text-neutral-500'>${props.total_withdrawn}</p>
                        </div>
                        <div className='text-center'>
                            <p className='text-label-desktop text-neutral-600'>Pending Funds</p>
                            <p className='text-title-desktop-large text-orange-600'>${parseFloat(props.stripe_balance.pending || '0').toFixed(2)}</p>
                        </div>
                        <div className='text-center'>
                            <p className='text-label-desktop text-neutral-600'>Available for Withdrawal</p>
                            <p className='text-title-desktop-large text-primary-600'>${parseFloat(props.stripe_balance.available || '0').toFixed(2)}</p>
                        </div>
                    </div>
                    <div className="text-center mt-4 text-body-small text-neutral-600">
                        <p>
                            Note: Contributions enter a 'Pending' state for a few business days before they become 'Available for Withdrawal'. 
                            This is a standard banking process to ensure funds are secure.
                        </p>
                    </div>
                    <div className="mt-6 text-center">
                        {props.payouts_enabled ? (
                            parseFloat(props.stripe_balance.available || '0') > 0 && (
                                <button onClick={props.onWithdrawClick} className="bg-green-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                                    Withdraw Funds
                                </button>
                            )
                        ) : (
                            <div className="bg-primary-100 p-4 rounded-lg border border-primary-200">
                                <p className="text-body-desktop text-neutral-700 mb-3">To withdraw funds, you need to set up your payout account with Stripe.</p>
                                <button onClick={props.onSetupPayoutsClick} className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                                    Set Up Payouts
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export interface RegistryHeroProps {
    totalRegistries: number
}


export function RegistryHero(props: RegistryHeroProps) {
    return (
        <section className='px-6 sm:px-12 py-8 bg-gradient-to-r from-primary-100 to-orange-100 border-b border-neutral-200'>
            <div className='max-w-6xl mx-auto'>
                <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6'>
                    <div className='space-y-2'>
                        <h1 className='text-headline-mobile-large sm:text-headline-desktop text-neutral-900'>
                            My Pamper Registries
                        </h1>
                        <p className='text-body-desktop text-neutral-600'>
                            Manage your baby registries and track your journey to parenthood
                        </p>
                    </div>

                    {/* Registry Count */}
                    <div className='flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm'>
                        <Icon icon="material-symbols-light:list-alt" className="h-5 w-5 text-primary-500" />
                        <span className='text-label-desktop text-neutral-700'>
                            {props.totalRegistries} {props.totalRegistries === 1 ? 'Registry' : 'Registries'}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}


export const RegistryCard = ({ registry, sharedId }: { registry: Registry, sharedId?: number }) => {
    const router = useRouter()
    const daysUntil = getDaysUntilArrival(registry.arrival_date);
    const handleRegistryClick = () => {
        if (sharedId) {
            router.push(`/mom/registries/shared/${sharedId}`)
        } else {
            router.push(`/mom/registries/${registry.id}`)
        }
    };
    return (
        <article
            onClick={handleRegistryClick}
            className='flex flex-col bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-neutral-200 hover:border-primary-300 group'
        >
            {/* Header */}
            <div className='flex-1 flex items-start justify-between mb-4'>
                <div className='flex-1'>
                    <h3 className='text-title-desktop text-neutral-900 group-hover:text-primary-600 transition-colors mb-1'>
                        {registry.name}
                    </h3>
                    {sharedId && (
                        <span className='inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-label-desktop-small mb-2'>
                            <Icon icon="material-symbols-light:share-outline" className="h-4 w-4" />
                            Shared Registry
                        </span>
                    )}
                </div>
                <Icon
                    icon="material-symbols-light:arrow-forward"
                    className="h-6 w-6 text-neutral-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-300"
                />
            </div>

            {/* Registry Details */}
            <div className='space-y-3 mb-6'>
                <div className='flex items-center gap-2 text-neutral-600'>
                    <Icon icon="material-symbols:baby-changing-station" className="h-5 w-5 text-primary-500" />
                    <span className='text-body-desktop'>
                        {registry.babies_count} {registry.babies_count === 1 ? 'Baby' : 'Babies'}
                    </span>
                </div>

                <div className='flex items-center gap-2 text-neutral-600'>
                    <Icon icon="material-symbols-light:calendar-today-outline" className="h-5 w-5 text-orange-500" />
                    <span className='text-body-desktop'>
                        Due: {formatDate(registry.arrival_date)}
                    </span>
                </div>

                {registry.is_first_time && (
                    <div className='flex items-center gap-2 text-primary-600'>
                        <Icon icon="material-symbols:star-outline" className="h-5 w-5" />
                        <span className='text-body-desktop font-medium'>First Time Parent</span>
                    </div>
                )}
            </div>

            {/* Days Counter */}
            <div className='bg-gradient-to-r from-primary-50 to-orange-50 rounded-xl p-4 text-center mb-4'>
                <div className='text-title-desktop text-primary-600 font-bold'>
                    {daysUntil > 0 ? daysUntil : 'Arrived!'}
                </div>
                <div className='text-label-desktop text-neutral-600'>
                    {daysUntil > 0 ? 'days to go' : 'Congratulations! 🎉'}
                </div>
            </div>

            {/* Registry Stats */}
            <div className='flex justify-between text-center border-t border-neutral-100 pt-4'>
                <div>
                    <div className='text-label-desktop text-neutral-500'>Created</div>
                    <div className='text-label-desktop-large text-neutral-900'>
                        {formatDate(registry.created_at).split(',')[0]}
                    </div>
                </div>
                <div>
                    <div className='text-label-desktop text-neutral-500'>ID</div>
                    <div className='text-label-desktop-large text-neutral-900 font-mono'>
                        {registry.shareable_id?.slice(-6) || 'N/A'}
                    </div>
                </div>
            </div>
        </article>
    );
};


export interface RegistryWidgetProps {
    registries?: Registry[] | undefined;
    sharedRegistries?: SharedRegistry[] | undefined;
    title: string;
    action?: React.ReactNode
}


export function RegistryWidget(props: RegistryWidgetProps) {
    const hasRegistries = props.registries && props.registries.length > 0;
    const hasSharedRegistries = props.sharedRegistries && props.sharedRegistries.length > 0;

    // Don't render the widget if there's nothing to show.
    // This makes the component's behavior more intuitive.
    if (!hasRegistries && !hasSharedRegistries) {
        return null;
    }
    return (
        <div>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4'>
                <h2 className='text-title-mobile-large sm:text-title-desktop-large text-neutral-900'>
                    {props.title}
                </h2>

                {props.action}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {props.registries?.map((registry) => (
                    <RegistryCard key={registry.id} registry={registry} />
                ))}
                {props.sharedRegistries?.map((shared) => (
                    <RegistryCard key={shared.id} registry={shared.registry} sharedId={shared.id} />
                ))}
            </div>
        </div>
    )
}


export interface QuickActionsProps {
    title: string;
    descrption: string;
    actions?: React.ReactNode
}


export function QuickActions(props: QuickActionsProps) {
    return (
        <div className='bg-gradient-to-r from-green-50 to-primary-50 rounded-2xl p-6 border border-green-200'>
            <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                <div className="flex-1">
                    <h3 className='text-title-desktop text-neutral-900 mb-1'>
                        {props.title}
                    </h3>
                    <p className='text-body-desktop text-neutral-600'>
                        {props.descrption}
                    </p>
                </div>
                <div>
                    {props.actions}
                </div>
            </div>
        </div>
    )
}