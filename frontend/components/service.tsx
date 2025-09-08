"use client";

import { Service } from "@/lib/services/registry/types";
import { Icon } from "@iconify/react";
import { useParams, useRouter } from "next/navigation";
import { FilledButton } from "./buttons";
import { CheckboxField, InputField } from "./inputs";
import { useState } from "react";
import { formatDate } from "@/lib/helper";

export interface ServiceWidgetProps {
    title: string;
    description: string;
    services: Service[];
    context: "shared" | "public" | "mom"
}


export function ServiceWidget(props: ServiceWidgetProps) {
    return (
        <div className='relative'>
            {/* Background decoration */}
            <div className='absolute inset-0 bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl opacity-50'></div>

            <div className='relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-pink-100 shadow-lg'>
                <div className='flex flex-wrap items-center gap-4 mb-8'>
                    <div className='bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-2xl order-1'>
                        <Icon icon="material-symbols:volunteer-activism" className="h-8 w-8 text-white" />
                    </div>
                    <div className="order-3 sm:order-2">
                        <h2 className='text-title-desktop-large text-neutral-900 font-bold'>{props.title}</h2>
                        <p className='text-body-desktop text-neutral-600'>{props.description}</p>
                    </div>
                    <div className='order-2 sm:order-3 ml-auto bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full text-label-desktop font-semibold'>
                        {props.services.length} Available
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {props.services.map((service, index) => (
                        <ServiceCard key={index} service={service} context={props.context} />
                    ))}
                </div>
            </div>
        </div>
    )
}



export interface ServiceCardProps {
    service: Service;
    context: "shared" | "public" | "mom"
}


export function ServiceCard(props: ServiceCardProps) {
    const { registryId, sharedId } = useParams()
    const router = useRouter()

    const onClick = () => {
        switch (props.context) {
            case "shared":
                router.push(`/mom/registries/shared/${sharedId}/services/${props.service.id}`)
                break;
            case "public":
                // Add logic for "public" context here
                break;
            case "mom":
                router.push(`/mom/registries/${registryId}/services/${props.service.id}`)
                break;
            default:
                // Handle default case if necessary
                break;
        }
    }

    const handleButtonText = () => {
        if (props.context === "public") {
            return "Contribute Now"
        } else {
            return "View Details"
        }
    }

    return (
        <div key={props.service.id} className='flex flex-col group relative bg-white rounded-2xl p-6 border border-neutral-200 hover:border-pink-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
            {/* Progress indicator */}
            <div className='absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full animate-pulse'></div>

            <div className='mb-4 flex-1'>
                <h3 className='text-title-desktop text-neutral-900 font-semibold mb-2 group-hover:text-pink-600 transition-colors'>
                    {props.service.name}
                </h3>
                <p className='text-body-desktop-small text-neutral-600 line-clamp-2'>
                    {props.service.description}
                </p>
            </div>

            <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                    <span className='text-label-desktop text-neutral-500'>Progress</span>
                    <span className='text-label-desktop text-pink-600 font-semibold'>
                        ${parseFloat(props.service.total_contributions).toFixed(0)} / ${parseFloat(props.service.total_cost).toFixed(0)}
                    </span>
                </div>

                {/* Progress bar */}
                <div className='w-full bg-neutral-200 rounded-full h-2'>
                    <div
                        className='bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-500'
                        style={{
                            width: `${Math.min((parseFloat(props.service.total_contributions) / parseFloat(props.service.total_cost)) * 100, 100)}%`
                        }}
                    ></div>
                </div>

                <div className='flex justify-between items-center text-body-desktop-small text-neutral-500'>
                    <span>{props.service.hours} hours</span>
                    <span>${props.service.cost_per_hour}/hr</span>
                </div>
            </div>
            <button
                className='w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105'
                onClick={onClick}>
                {handleButtonText()}
            </button>
        </div>
    )
}


export interface ServiceHeroProps {
    service: Service;
    setShowContributeForm: (value: React.SetStateAction<boolean>) => void;
    completionPercentage: string
}


export function ServiceHero(props: ServiceHeroProps) {
    const router = useRouter()
    return (
        <section className='px-6 sm:px-12 py-8 bg-gradient-to-br from-primary-100 via-orange-50 to-green-50 border-b border-neutral-200'>
            <div className='max-w-4xl mx-auto'>
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className='flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors mb-6 text-label-desktop'
                >
                    <Icon icon="material-symbols-light:arrow-back" className="h-5 w-5" />
                    Back
                </button>

                <div className='space-y-6'>
                    {/* Service Title & Status */}
                    <div className='flex flex-col lg:flex-row lg:items-start justify-between gap-4'>
                        <div className='space-y-2'>
                            <h1 className='text-headline-mobile-large sm:text-headline-desktop text-neutral-900'>
                                {props.service.name}
                            </h1>
                            <div className='flex items-center gap-4'>
                                <span className={`px-3 py-1 rounded-full text-label-desktop-small font-medium ${props.service.is_available
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}>
                                    {props.service.is_available ? 'Available' : 'Not Available'}
                                </span>
                                {props.service.is_completed && (
                                    <span className='px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-label-desktop-small font-medium'>
                                        Completed
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {!props.service.is_owned_by_user && props.service.is_available && (
                            <div className='flex gap-3'>
                                <FilledButton
                                    onClick={() => props.setShowContributeForm(true)}
                                    className='flex items-center gap-2'
                                >
                                    <Icon icon="material-symbols-light:volunteer-activism-outline" className="h-5 w-5" />
                                    Contribute
                                </FilledButton>
                            </div>
                        )}
                    </div>

                    {/* Progress Bar */}
                    <div className='bg-white rounded-2xl p-6 shadow-sm'>
                        <div className='flex justify-between items-center mb-3'>
                            <span className='text-label-desktop text-neutral-600'>Funding Progress</span>
                            <span className='text-title-desktop-small text-neutral-900'>{props.completionPercentage}%</span>
                        </div>
                        <div className='w-full bg-neutral-200 rounded-full h-3 mb-3'>
                            <div
                                className='bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500'
                                style={{ width: `${Math.min(parseFloat(props.completionPercentage), 100)}%` }}
                            />
                        </div>
                        <div className='flex justify-between text-label-desktop text-neutral-600'>
                            <span>${props.service.total_contributions} raised</span>
                            <span>of ${props.service.total_cost} goal</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}


interface ServiceDetailsCardProps {
    service: Service
}

export function ServiceDetailsCard(props: ServiceDetailsCardProps) {
    return (
        <div className='lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm'>
            <h2 className='text-title-desktop-large text-neutral-900 mb-4'>Service Details</h2>

            <div className='space-y-4'>
                <div>
                    <h3 className='text-title-desktop-small text-neutral-900 mb-2'>Description</h3>
                    <p className='text-body-desktop text-neutral-700 leading-relaxed'>
                        {props.service.description}
                    </p>
                </div>

                {/* Service Metrics */}
                <div className='grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200'>
                    <div className='text-center p-4 bg-neutral-50 rounded-xl'>
                        <Icon icon="material-symbols-light:schedule-outline" className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                        <div className='text-title-desktop text-neutral-900'>{props.service.hours}</div>
                        <div className='text-label-desktop text-neutral-600'>Hours Needed</div>
                    </div>
                    <div className='text-center p-4 bg-neutral-50 rounded-xl'>
                        <Icon icon="material-symbols-light:money-outline-rounded" className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <div className='text-title-desktop text-neutral-900'>${props.service.cost_per_hour}</div>
                        <div className='text-label-desktop text-neutral-600'>Per Hour</div>
                    </div>
                </div>
            </div>
        </div>
    )
}



export interface ServiceQuickStatCardProps {
    service: Service
}


export function ServiceQuickStatCard(props: ServiceQuickStatCardProps) {
    return (
        <div className='bg-white rounded-2xl p-6 shadow-sm'>
            <h3 className='text-title-desktop text-neutral-900 mb-4'>Quick Stats</h3>
            <div className='space-y-3'>
                <div className='flex justify-between'>
                    <span className='text-label-desktop text-neutral-600'>Total Cost</span>
                    <span className='text-label-desktop-large text-neutral-900'>${props.service.total_cost}</span>
                </div>
                <div className='flex justify-between'>
                    <span className='text-label-desktop text-neutral-600'>Amount Raised</span>
                    <span className='text-label-desktop-large text-green-600'>${props.service.total_contributions}</span>
                </div>
                <div className='flex justify-between'>
                    <span className='text-label-desktop text-neutral-600'>Remaining</span>
                    <span className='text-label-desktop-large text-orange-600'>
                        ${(parseFloat(props.service.total_cost) - parseFloat(props.service.total_contributions)).toFixed(2)}
                    </span>
                </div>
                {props.service.contributions && <div className='flex justify-between pt-2 border-t border-neutral-200'>
                    <span className='text-label-desktop text-neutral-600'>Contributors</span>
                    <span className='text-label-desktop-large text-primary-600'>
                        {props.service.contributions?.filter(c => c.fulfilled).length || 0}
                    </span>
                </div>}
            </div>
        </div>
    )
}



export interface ServiceTimelineCardProps {
    service: Service
}


export function ServiceTimelineCard(props: ServiceTimelineCardProps) {
    return (
        <div className='bg-white rounded-2xl p-6 shadow-sm'>
            <h3 className='text-title-desktop text-neutral-900 mb-4'>Timeline</h3>
            <div className='space-y-3 text-label-desktop text-neutral-600'>
                <div className='flex items-center gap-2'>
                    <Icon icon="material-symbols-light:calendar-add-on-outline" className="h-4 w-4" />
                    <span>Created: {formatDate(props.service.created_at).split(',')[0]}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <Icon icon="material-symbols-light:update" className="h-4 w-4" />
                    <span>Updated: {formatDate(props.service.updated_at).split(',')[0]}</span>
                </div>
            </div>
        </div>
    )
}



export interface ServiceContributionsCardProps {
    service: Service;
    setShowContributeForm: (value: React.SetStateAction<boolean>) => void;
}


export function ServiceContributionsCard(props: ServiceContributionsCardProps) {
    return (
        <>
            {props.service.contributions && props.service.contributions.length > 0 && (
                <div className='bg-white rounded-2xl p-6 shadow-sm'>
                    <h2 className='text-title-desktop-large text-neutral-900 mb-6'>Contributions</h2>

                    <div className='overflow-x-auto'>
                        <table className='w-full'>
                            <thead>
                                <tr className='border-b-2 border-neutral-200'>
                                    <th className='text-left text-label-desktop text-neutral-700 pb-3'>Contributor</th>
                                    <th className='text-left text-label-desktop text-neutral-700 pb-3'>Amount</th>
                                    <th className='text-left text-label-desktop text-neutral-700 pb-3'>Date</th>
                                    <th className='text-left text-label-desktop text-neutral-700 pb-3'>Status</th>
                                    <th className='text-left text-label-desktop text-neutral-700 pb-3'>Message</th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.service.contributions.map((contribution, index) => (
                                    <tr key={index} className='border-b border-neutral-100 hover:bg-neutral-50 transition-colors'>
                                        <td className='py-4 text-body-desktop-small text-neutral-900'>
                                            {contribution.contributor}
                                        </td>
                                        <td className='py-4 text-body-desktop-small font-medium text-green-600'>
                                            ${contribution.amount}
                                        </td>
                                        <td className='py-4 text-body-desktop-small text-neutral-600'>
                                            {formatDate(contribution.created_at).split(',')[0]}
                                        </td>
                                        <td className='py-4'>
                                            <span className={`px-2 py-1 rounded-full text-label-mobile-small ${contribution.fulfilled
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-orange-100 text-orange-800'
                                                }`}>
                                                {contribution.fulfilled ? 'Fulfilled' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className='py-4 text-body-desktop-small text-neutral-600 max-w-xs truncate'>
                                            {contribution.summary || 'No message'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Empty State for Contributions */}
            {(!props.service.contributions || props.service.contributions.length === 0) && (
                <div className='bg-white rounded-2xl p-12 shadow-sm text-center'>
                    <Icon icon="material-symbols-light:volunteer-activism-outline" className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
                    <h3 className='text-title-desktop text-neutral-600 mb-2'>No Contributions Yet</h3>
                    <p className='text-body-desktop text-neutral-500 mb-6'>
                        {/* Be the first to support this service and help make it happen! */}
                        {props.service.is_owned_by_user
                            ? 'You have not received any contributions yet. Share your registry to get support!'
                            : 'This service is available for contributions. Help make it happen!'
                        }
                    </p>
                    {!props.service.is_owned_by_user && props.service.is_available && (
                        <FilledButton onClick={() => props.setShowContributeForm(true)}>
                            Make First Contribution
                        </FilledButton>
                    )}
                </div>
            )}
        </>
    )
}


export interface ServiceContributionFormModalProps {
    setShowContributeForm: (value: React.SetStateAction<boolean>) => void;
    showContributeForm: boolean;
}


export function ServiceContributionFormModal(props: ServiceContributionFormModalProps) {
    const [isVolunteer, setIsVolunteer] = useState(false)

    const handleContribute = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle contribution logic here
        const formData = new FormData(e.currentTarget);
        const amount = formData.get('amount')?.toString();
        const datetime = formData.get('datetime')?.toString();

        console.log('Contribution:', { amount, datetime, isVolunteer });

        // Reset form
        props.setShowContributeForm(false);
        setIsVolunteer(false);
    };
    return (
        <>
            {props.showContributeForm && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
                    <div className='bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6'>
                        <div className='flex justify-between items-center mb-6'>
                            <h3 className='text-title-desktop text-neutral-900'>Contribute to Service</h3>
                            <button
                                onClick={() => props.setShowContributeForm(false)}
                                className='text-neutral-500 hover:text-neutral-700 transition-colors'
                            >
                                <Icon icon="material-symbols-light:close" className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleContribute} className='space-y-4'>
                            {isVolunteer ? (
                                <InputField
                                    labeltext="Convenient Day and Time"
                                    name="datetime"
                                    type="datetime-local"
                                    required
                                />
                            ) : (
                                <InputField
                                    labeltext="Amount ($)"
                                    name="amount"
                                    type="number"
                                    step="0.01"
                                    min="1"
                                    placeholder="Enter amount"
                                    required
                                />
                            )}

                            <InputField
                                labeltext="Message (Optional)"
                                name="message"
                                placeholder="Add a supportive message..."
                            />

                            <div className='flex items-center justify-between pt-4'>
                                {/* <CheckboxField
                                    id="volunteer"
                                    labeltext="I want to volunteer"
                                    checked={isVolunteer}
                                    onChange={(e) => setIsVolunteer(e.target.checked)}
                                /> */}
                                <div className='space-x-3'>
                                    <FilledButton type="submit">
                                        {isVolunteer ? 'Volunteer' : 'Contribute'}
                                    </FilledButton>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}