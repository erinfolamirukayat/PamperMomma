'use client'

import { DefaultService } from '@/lib/services/registry/types'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import { FilledButton } from '@/components/buttons'
import { InputField, CheckboxField } from '@/components/inputs'
import { ServiceListCard } from '@/components/cards'
import { useHulkFetch } from 'hulk-react-utils'

interface NewService extends DefaultService {
    total_withdrawn?: string;
}

function Page() {
    const { registryId } = useParams()
    const router = useRouter()
    const serviceFormRef = useRef<HTMLFormElement | null>(null)
    const [services, setServices] = useState<NewService[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Fetch default services for suggestions
    const {
        dispatch: fetchDefaultServices,
        data: defaultServicesData
    } = useHulkFetch<DefaultService[]>("/registries/services/default/")

    // Submit services to API
    const {
        dispatch: submitServices,
        data: submitData
    } = useHulkFetch("/registries/services/", {
        onSuccess(data, alert) {
            // Redirect back to registry page
            router.push(`/mom/registries/${registryId}`)
        },
    })

    useEffect(() => {
        fetchDefaultServices({ method: 'GET' });
    }, [])

    // Handle form submission for adding a service
    const handleAddService = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const newService: NewService = {
            name: formData.get("serviceName")?.toString() ?? "",
            description: formData.get("description")?.toString() ?? "",
            hours: parseInt(formData.get("hours")?.toString() ?? "0"),
            cost_per_hour: formData.get("cost_per_hour")?.toString() ?? "0",
            is_active: formData.get("is_active") === "on",
        }

        // Validation
        // TODO: USE A BETTER ALERT SYSTEM
        if (!newService.name.trim()) {
            alert("Service name is required")
            return
        }
        if (!newService.description.trim()) {
            alert("Service description is required")
            return
        }
        if (newService.hours <= 0) {
            alert("Hours must be greater than 0")
            return
        }
        if (parseFloat(newService.cost_per_hour) <= 0) {
            alert("Cost per hour must be greater than 0")
            return
        }

        // Check for duplicate service names
        if (services.find(service => service.name.trim().toLowerCase() === newService.name.trim().toLowerCase())) {
            alert("A service with this name already exists")
            return
        }

        // Add service to list
        setServices(prev => [...prev, newService])

        // Reset form
        e.currentTarget.reset()
    }

    // Handle service deletion
    const handleDeleteService = (serviceName: string) => {
        setServices(prev => prev.filter(service => service.name !== serviceName))
    }

    // Handle service suggestion
    const handleServiceSuggestion = (e: React.ChangeEvent<HTMLInputElement>) => {
        const serviceName = e.target.value.trim().toLowerCase()
        const suggestedService = defaultServicesData?.find(service =>
            service.name.trim().toLowerCase() === serviceName
        )

        if (suggestedService && serviceFormRef.current) {
            const form = serviceFormRef.current
            form.serviceName.value = suggestedService.name
            form.description.value = suggestedService.description
            form.hours.value = suggestedService.hours.toString()
            form.cost_per_hour.value = suggestedService.cost_per_hour
        }
    }

    // Handle final submission
    const handleSubmitServices = async () => {
        if (services.length === 0) {
            alert("Please add at least one service")
            return
        }

        setIsSubmitting(true)

        try {
            submitServices({
                method: 'POST',
                query: { registry: registryId as string },
                body: JSON.stringify(services),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        } catch (error) {
            console.error('Error submitting services:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Navigate back
    const handleBack = () => {
        if (services.length > 0) {
            const confirmLeave = confirm("You have unsaved services. Are you sure you want to leave?")
            if (!confirmLeave) return
        }
        router.back()
    }

    return (
        <main className='relative min-h-full flex-1'>
            {/* Header Section */}
            <section className='px-6 sm:px-12 py-8 bg-gradient-to-r from-primary-100 to-orange-100 border-b border-neutral-200'>
                <div className='max-w-6xl mx-auto'>
                    {/* Back Button */}
                    <button
                        onClick={handleBack}
                        className='flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors mb-6 text-label-desktop'
                    >
                        <Icon icon="material-symbols-light:arrow-back" className="h-5 w-5" />
                        Back to Registry
                    </button>

                    <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6'>
                        <div className='space-y-2'>
                            <h1 className='text-headline-mobile-large sm:text-headline-desktop text-neutral-900'>
                                Add New Services
                            </h1>
                            <p className='text-body-desktop text-neutral-600'>
                                Create multiple services for your registry. You can add as many as you need.
                            </p>
                        </div>

                        {/* Services Count */}
                        <div className='flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm'>
                            <Icon icon="material-symbols-light:list-alt" className="h-5 w-5 text-primary-500" />
                            <span className='text-label-desktop text-neutral-700'>
                                {services.length} {services.length === 1 ? 'Service' : 'Services'} Added
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className='px-6 sm:px-12 py-8'>
                <div className='max-w-6xl mx-auto'>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                        {/* Services List */}
                        <div className='space-y-4'>
                            <h2 className='text-title-desktop-large text-neutral-900 mb-4'>Added Services</h2>

                            {services.length === 0 ? (
                                <div className='bg-white rounded-2xl p-12 shadow-sm text-center border-2 border-dashed border-neutral-200'>
                                    <Icon icon="material-symbols-light:add-circle-outline" className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
                                    <h3 className='text-title-desktop text-neutral-600 mb-2'>No Services Added Yet</h3>
                                    <p className='text-body-desktop text-neutral-500'>
                                        Use the form on the right to add services to your registry.
                                    </p>
                                </div>
                            ) : (
                                <div className='space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar'>
                                    {services.map((service, index) => (
                                        <ServiceListCard
                                            serviceName={service.name}
                                            description={service.description}
                                            totalHours={service.hours}
                                            costPerHour={parseFloat(service.cost_per_hour)}
                                            isActive={service.is_active}
                                            onDelete={() => handleDeleteService(service.name)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Service Creation Form */}
                        <div className='bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 h-fit sticky top-8'>
                            <h2 className='text-title-desktop-large text-neutral-900 mb-6'>Add Service</h2>

                            <form onSubmit={handleAddService} ref={serviceFormRef} className='space-y-4'>
                                {/* Service Name with Suggestions */}
                                <InputField
                                    labeltext="Service Name *"
                                    name="serviceName"
                                    placeholder="e.g., House Cleaning, Meal Prep"
                                    required
                                    list="service-suggestions"
                                    onChange={handleServiceSuggestion}
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="words"
                                />
                                <datalist id="service-suggestions">
                                    {defaultServicesData?.map((service, index) => (
                                        <option key={index} value={service.name} />
                                    ))}
                                </datalist>

                                {/* Description */}
                                <InputField
                                    labeltext="Description *"
                                    name="description"
                                    placeholder="Describe what this service includes..."
                                    required
                                />

                                {/* Hours and Cost in a row */}
                                <div className='grid grid-cols-2 gap-4'>
                                    <InputField
                                        labeltext="Total Hours *"
                                        name="hours"
                                        type="number"
                                        min="1"
                                        step="1"
                                        placeholder="e.g., 8"
                                        required
                                    />
                                    <InputField
                                        labeltext="Cost Per Hour *"
                                        name="cost_per_hour"
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        placeholder="e.g., 25.00"
                                        required
                                    />
                                </div>

                                {/* Advanced Options */}
                                <div className='space-y-3 pt-2 border-t border-neutral-200'>
                                    <h3 className='text-title-desktop-small text-neutral-900'>Advanced Options</h3>

                                    <CheckboxField
                                        id="is_active"
                                        name="is_active"
                                        labeltext="Service is active (can receive contributions)"
                                        defaultChecked={true}
                                    />
                                </div>

                                {/* Add Service Button */}
                                <FilledButton
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-2"
                                >
                                    <Icon icon="material-symbols-light:add" className="h-5 w-5" />
                                    Add Service
                                </FilledButton>
                            </form>
                        </div>
                    </div>

                    {/* Submit Section */}
                    {services.length > 0 && (
                        <div className='mt-8 bg-gradient-to-r from-green-50 to-primary-50 rounded-2xl p-6 border border-green-200'>
                            <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
                                <div>
                                    <h3 className='text-title-desktop text-neutral-900 mb-1'>
                                        Ready to Submit?
                                    </h3>
                                    <p className='text-body-desktop text-neutral-600'>
                                        You have {services.length} service{services.length !== 1 ? 's' : ''} ready to be added to your registry.
                                    </p>
                                </div>
                                <div className='flex gap-3'>
                                    <button
                                        onClick={() => setServices([])}
                                        className='px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors text-label-desktop'
                                        disabled={isSubmitting}
                                    >
                                        Clear All
                                    </button>
                                    <FilledButton
                                        onClick={handleSubmitServices}
                                        disabled={isSubmitting}
                                        className='flex items-center gap-2'
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Icon icon="material-symbols-light:sync" className="h-5 w-5 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Icon icon="material-symbols-light:check" className="h-5 w-5" />
                                                Submit Services
                                            </>
                                        )}
                                    </FilledButton>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}

export default Page