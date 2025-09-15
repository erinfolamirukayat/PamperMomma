'use client'

import { CreateRegistry, DefaultService, Registry } from '@/lib/services/registry/types'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import { FilledButton } from '@/components/buttons'
import { InputField, CheckboxField, TextAreaField } from '@/components/inputs'
import { ServiceListCard } from '@/components/cards'
import { useHulkFetch } from 'hulk-react-utils'
import { QuickActions } from '@/components/registry'

function Page() {
    const router = useRouter()
    const serviceFormRef = useRef<HTMLFormElement | null>(null)
    const registryFormRef = useRef<HTMLFormElement | null>(null)

    const {
        dispatch: goRegistries,
        data: registriesData
    } = useHulkFetch<Registry>("/registries/r/", {
        onSuccess(data, alert) {
            // Navigate to next step after registry creation
            router.push(`/mom/registries/${data.id}`)
        },
    })

    const [registry, setRegistry] = useState<CreateRegistry>({
        name: "",
        arrival_date: "",
        babies_count: 1,
        is_first_time: false,
        services: [],
        thank_you_message: "",
        welcome_message: ""
    })

    const [formError, setFormError] = useState<string | null>(null);

    // Fetch default services for suggestions
    const {
        dispatch: fetchDefaultServices,
        data: defaultServicesData
    } = useHulkFetch<DefaultService[]>("/registries/services/default/")

    useEffect(() => {
        fetchDefaultServices({ method: 'GET' });
    }, [])

    // Handle registry name changes with suggestions
    const handleRegistryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Update registry name in state
        setRegistry(prev => ({
            ...prev,
            name: e.target.value,
        }))
    }

    // Handle service form submission
    const handleAddService = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setFormError(null); // Clear previous errors

        const formData = new FormData(e.currentTarget)
        const newService: DefaultService = {
            name: formData.get("serviceName")?.toString() ?? "",
            description: formData.get("description")?.toString() ?? "",
            hours: parseInt(formData.get("hours")?.toString() ?? "0"),
            cost_per_hour: formData.get("cost_per_hour")?.toString() ?? "0",
            is_active: formData.get("is_active") === "on"
        }

        if (!newService.name.trim()) {
            setFormError("Service name is required.");
            return
        }
        if (!newService.description.trim()) {
            setFormError("Service description is required.");
            return
        }
        if (newService.hours <= 0) {
            setFormError("Hours must be greater than 0.");
            return
        }
        if (parseFloat(newService.cost_per_hour) <= 0) {
            setFormError("Cost per hour must be greater than 0.");
            return
        }

        // Check for duplicate service names
        if (registry.services?.find(service =>
            service.name.trim().toLowerCase() === newService.name.trim().toLowerCase()
        )) {
            setFormError("A service with this name already exists.");
            return
        }

        // Add service to registry
        setRegistry(prev => ({
            ...prev,
            services: [newService, ...(prev.services ?? [])]
        }))

        // Reset form
        e.currentTarget.reset()
    }

    // Handle service deletion
    const handleDeleteService = (serviceName: string) => {
        setRegistry(prev => ({
            ...prev,
            services: prev.services?.filter(service => service.name !== serviceName) ?? []
        }))
    }

    // Handle service suggestion auto-fill
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

    // Handle final registry creation/update
    const handleCreateRegistry = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setFormError(null);
        if (!registry.name.trim()) {
            setFormError("Registry name is required.");
            return
        }

        if ((registry.services?.length ?? 0) === 0) {
            setFormError("Registry must have at least one service.");
            return
        }

        const formData = new FormData(e.currentTarget)
        const registryData = {
            ...registry,
            arrival_date: formData.get("arrival_date")?.toString(),
            babies_count: parseInt(formData.get("babies_count")?.toString() ?? "1"),
            is_first_time: formData.get("first_time") === "on",
            welcome_message: formData.get("welcome_message")?.toString() ?? "",
            thank_you_message: formData.get("thank_you_message")?.toString() ?? ""
        }

        // Submit the registry data
        await goRegistries({
            method: 'POST',
            body: JSON.stringify(registryData),
        })
    }

    // Navigate back with confirmation
    const handleBack = () => {
        if (registry.services && registry.services.length > 0) {
            const confirmLeave = confirm("You have unsaved changes. Are you sure you want to leave?")
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
                        Back
                    </button>

                    <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6'>
                        <div className='space-y-2'>
                            <h1 className='text-headline-mobile-large sm:text-headline-desktop text-neutral-900'>
                                Create a Pamper Registry
                            </h1>
                            <p className='text-body-desktop text-neutral-600'>
                                Set up your baby registry with personalized services for your journey ahead
                            </p>
                        </div>

                        {/* Services Count */}
                        <div className='flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm'>
                            <Icon icon="material-symbols:baby-changing-station" className="h-5 w-5 text-primary-500" />
                            <span className='text-label-desktop text-neutral-700'>
                                {registry.services?.length ?? 0} {(registry.services?.length ?? 0) === 1 ? 'Service' : 'Services'} Added
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Registry Information Section */}
            <section className='px-6 sm:px-12 py-8 bg-white border-b border-neutral-200'>
                <div className='max-w-6xl mx-auto'>
                    <h2 className='text-title-desktop-large text-neutral-900 mb-6'>Registry Information</h2>

                    <form ref={registryFormRef} onSubmit={handleCreateRegistry} className='space-y-6'>
                        {/* Registry Details Grid */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl'>
                            <InputField
                                labeltext="Registry Name *"
                                name="registryName"
                                placeholder="e.g., John's Pamper Registry"
                                value={registry.name}
                                onChange={handleRegistryNameChange}
                                list="registry-suggestions"
                                autoComplete="off"
                                required
                                className="flex-1"
                            />
                            <InputField
                                name='arrival_date'
                                labeltext='Expected Arrival Date *'
                                type='date'
                                required
                            />
                            <InputField
                                name='babies_count'
                                labeltext='Number of Babies *'
                                type='number'
                                min={1}
                                max={10}
                                defaultValue={1}
                                required
                            />
                            <CheckboxField
                                id='first_time'
                                name='first_time'
                                labeltext="I'm a first-time parent"
                            />
                            {/* Welcome message */}
                            <TextAreaField
                                name='welcome_message'
                                labeltext='Welcome Message'
                                placeholder='This is shown to everyone who visit your pamper registry.'
                                rows={3}
                                className='col-span-2'
                            />
                            {/* Thank you message */}
                            <TextAreaField
                                name='thank_you_message'
                                labeltext='Thank You Message'
                                placeholder='This is shown to everyone who contributes to your pamper registry.'
                                rows={3}
                                className='col-span-2'
                            />
                        </div>
                    </form>
                </div>
            </section>

            {/* Main Content - Services Section */}
            <section className='px-6 sm:px-12 py-8'>
                <div className='max-w-6xl mx-auto'>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                        {/* Services List */}
                        <div className='space-y-4'>
                            <h2 className='text-title-desktop-large text-neutral-900 mb-4'>
                                Added Services
                            </h2>

                            {(registry.services?.length ?? 0) === 0 ? (
                                <div className='bg-white rounded-2xl p-12 shadow-sm text-center border-2 border-dashed border-neutral-200'>
                                    <Icon icon="material-symbols-light:add-circle-outline" className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
                                    <h3 className='text-title-desktop text-neutral-600 mb-2'>No Services Added Yet</h3>
                                    <p className='text-body-desktop text-neutral-500'>
                                        Add services using the form on the right. You can select from our suggestions or create custom services.
                                    </p>
                                </div>
                            ) : (
                                <div className='space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar'>
                                    {registry.services?.map((service, index) => (
                                        <ServiceListCard
                                            key={service.name}
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
                                    placeholder="e.g., Baby Sitting, House Cleaning"
                                    required
                                    list="service-suggestions"
                                    onChange={handleServiceSuggestion}
                                    autoComplete="off"
                                />
                                <datalist id="service-suggestions">
                                    {defaultServicesData?.map((service, index) => (
                                        <option key={index} value={service.name} />
                                    ))}
                                </datalist>

                                {/* Description */}
                                <TextAreaField
                                    labeltext="Description *"
                                    name="description"
                                    placeholder="Describe what this service includes..."
                                    cols={2}
                                    required
                                />

                                {/* Hours and Cost */}
                                <div className='grid grid-cols-2 gap-4'>
                                    <InputField
                                        labeltext="Total Hours *"
                                        name="hours"
                                        type="number"
                                        min="1"
                                        step="1"
                                        placeholder="8"
                                        required
                                    />
                                    <InputField
                                        labeltext="Cost Per Hour *"
                                        name="cost_per_hour"
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        placeholder="25.00"
                                        required
                                    />
                                </div>

                                {/* Service Options */}
                                <div className='pt-4 border-t border-neutral-200'>
                                    <CheckboxField
                                        id="is_active"
                                        name="is_active"
                                        labeltext="Service is active (can receive contributions)"
                                        defaultChecked={true}
                                    />
                                </div>

                                {/* Display Form Error */}
                                {formError && (
                                    <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{formError}</p>
                                )}

                                {/* Add Service Button */}
                                <FilledButton
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-2"
                                >
                                    <Icon icon="material-symbols-light:add" className="h-5 w-5" />
                                    Add Service
                                </FilledButton>
                            </form>

                            {/* Service Suggestions */}
                            {defaultServicesData && defaultServicesData.length > 0 && (
                                <div className='mt-6 pt-4 border-t border-neutral-200'>
                                    <h3 className='text-title-desktop-small text-neutral-900 mb-3'>Popular Services</h3>
                                    <div className='flex flex-wrap gap-2'>
                                        {defaultServicesData.slice(0, 6).map((service, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => {
                                                    if (serviceFormRef.current) {
                                                        const form = serviceFormRef.current
                                                        form.serviceName.value = service.name
                                                        form.description.value = service.description
                                                        form.hours.value = service.hours.toString()
                                                        form.cost_per_hour.value = service.cost_per_hour
                                                    }
                                                }}
                                                className='px-3 py-1 text-xs bg-primary-100 text-primary-700 rounded-full hover:bg-primary-200 transition-colors'
                                            >
                                                {service.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Section */}
                    {(registry.services?.length ?? 0) > 0 && (
                        // <div className='mt-8 bg-gradient-to-r from-green-50 to-primary-50 rounded-2xl p-6 border border-green-200'>
                        //     <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
                        //         <div>
                        //             <h3 className='text-title-desktop text-neutral-900 mb-1'>
                        //                 Ready to Create Registry?
                        //             </h3>
                        //             <p className='text-body-desktop text-neutral-600'>
                        //                 You have {registry.services?.length} service{(registry.services?.length ?? 0) !== 1 ? 's' : ''} ready.
                        //                 Complete your registry information to continue.
                        //             </p>
                        //         </div>
                        //         <div className='flex gap-3'>
                        //             <button
                        //                 onClick={() => setRegistry(prev => ({ ...prev, services: [] }))}
                        //                 className='px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors text-label-desktop'
                        //             >
                        //                 Clear All
                        //             </button>
                        //             <FilledButton
                        //                 onClick={() => {
                        //                     if (registryFormRef.current) {
                        //                         registryFormRef.current.requestSubmit()
                        //                     } else {
                        //                         console.error("Registry form reference is not set")
                        //                     }
                        //                 }}
                        //                 disabled={!registry.name.trim()}
                        //                 className='flex items-center gap-2'
                        //             >
                        //                 <Icon icon="material-symbols-light:check" className="h-5 w-5" />
                        //                 Create Registry
                        //             </FilledButton>
                        //         </div>
                        //     </div>
                        // </div>
                        <QuickActions
                            title='Ready to Create Your Pamper Registry?'
                            descrption={`You have ${registry.services?.length ?? 0} service${(registry.services?.length ?? 0) !== 1 ? 's' : ''} ready. Complete your registry information to continue.`}
                            actions={
                                <div className='flex flex-col gap-3'>
                                    <FilledButton
                                        onClick={() => {
                                            if (window.confirm("Are you sure you want to clear all added services? This action cannot be undone.")) {
                                                setRegistry(prev => ({ ...prev, services: [] }));
                                            }
                                        }}
                                        className='flex items-center gap-2'
                                    >
                                        <Icon icon="material-symbols-light:delete" className="h-5 w-5" />
                                        Clear All Services
                                    </FilledButton>
                                    <FilledButton
                                        onClick={() => {
                                            if (registryFormRef.current) {
                                                registryFormRef.current.requestSubmit()
                                            } else {
                                                console.error("Registry form reference is not set")
                                            }
                                        }}
                                        disabled={!registry.name.trim()}
                                        className='flex items-center gap-2'
                                    >
                                        <Icon icon="material-symbols-light:check" className="h-5 w-5" />
                                        Create Registry
                                    </FilledButton>
                                </div>
                            }
                        />

                    )}
                </div>
            </section>
        </main>
    )
}

export default Page