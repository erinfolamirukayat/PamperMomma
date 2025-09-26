"use client"

import { ServiceListCard } from '@/components/cards';
import { InputField } from '@/components/inputs';
import { AppLogo } from '@/components/logo';
import { CreateRegistry, DefaultService } from '@/lib/services/registry/types'
import { useHulkFetch } from 'hulk-react-utils';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Dialog, DialogBackdrop } from '@headlessui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

interface LocalDefaultService extends DefaultService {
    isLocal?: boolean;
}

function Page() {
    // User can add one or more services to their registry
    // Default services can be fetched from the backend
    // The user can also add custom services
    const {
        data: defaultServicesData,
        dispatch: fetchDefaultServices
    } = useHulkFetch<DefaultService[]>(
        '/registries/services/default/',
    )
    // const _localServices: LocalDefaultService[] = [
    //     { name: 'Childcare Support', description: 'Professional childcare services to help you care for your baby.', hours: 10, cost_per_hour: "20" },
    //     { name: 'Household Help', description: 'Assistance with household chores and errands to ease your daily routine.', hours: 8, cost_per_hour: "15" },
    //     { name: 'Meal Support', description: 'Nutritious meal preparation and delivery services for you and your family.', hours: 5, cost_per_hour: "25" },
    // ]
    const router = useRouter();
    const [localDefaultService, setLocalDefaultService] = useState([]);
    const [myServices, setMyServices] = useState<LocalDefaultService[]>([]);
    const [isCustomServiceModalOpen, setIsCustomServiceModalOpen] = useState(false);

    useEffect(() => {
        // Fetch default services from the backend on component mount
        fetchDefaultServices({ method: 'GET' });
    }, []);

    useEffect(() => {
        // Initialize local services with fetched default services
        if (defaultServicesData) {
            setLocalDefaultService([
                ...defaultServicesData.map(s => ({ ...s, isLocal: false })),
            ]);
        }
    }, [defaultServicesData]);


    const onCreateLocalDefaultService = (service: LocalDefaultService) => {
        // Add the new custom service to the list of local default services
        // and select it for the user's registry
        // Prevent adding duplicate services by name (case insensitive)
        if (!localDefaultService.some(s => s.name.trim().toLowerCase() === service.name.trim().toLowerCase())) {
            setLocalDefaultService([service, ...localDefaultService]);
            setMyServices([...myServices, service]);
        }
    }

    const onDeleteLocalDefaultService = (service: LocalDefaultService) => {
        // Remove only the local service from the available local services the user can choose from
        // This also removes it from the user's selected services if it was selected
        if (service.isLocal) {
            setLocalDefaultService(localDefaultService.filter(s => s.name !== service.name));
            setMyServices(myServices.filter(s => s.name !== service.name));
        }
    }

    const onSelectService = (service: LocalDefaultService) => {
        // Add or remove the service from the user's selected services
        if (myServices.some(s => s.name === service.name)) {
            // If already selected, remove it
            setMyServices(myServices.filter(s => s.name !== service.name));
        } else {
            // Otherwise, add it
            setMyServices([...myServices, service]);
        }
    }

    const onOpenCustomServiceModal = () => {
        setIsCustomServiceModalOpen(true);
    }

    const onCloseCustomServiceModal = () => {
        setIsCustomServiceModalOpen(false);
    }

    const onContinue = () => {
        // Proceed to the next step in the onboarding flow
        // Save the selected services to session storage
        if (myServices.length === 0) {
            alert("Please select at least one service to continue.");
            return;
        }

        const existingRegistry = sessionStorage.getItem('new-registry');
        if (!existingRegistry) {
            console.error("No existing registry found in session storage.");
            // Redirect to the registry creation page if no existing registry is found
            router.push('/onboarding');
            return;
        }
        const newRegistry: CreateRegistry = JSON.parse(existingRegistry);

        newRegistry.services = myServices.map(s => ({
            name: s.name,
            description: s.description,
            hours: s.hours,
            cost_per_hour: s.cost_per_hour,
        }));
        sessionStorage.setItem('new-registry', JSON.stringify(newRegistry));
        // Redirect to the next page
        router.push('/onboarding/arrival');
    }

    return (
        <main className='flex flex-col items-center mx-6'>
            <div className='py-12'>
                <AppLogo />
            </div>
            <h1 className='text-headline-desktop-small max-w-2xl text-center pb-8'>Select Services for Your Pamper Registry</h1>
            <p className='text-body-desktop max-w-2xl text-center'>Choose from our curated list of services to include in your registry. 
                You can as well add custom services that suit your unique needs.</p>
            {/* Service selection UI goes here */}
            <section className='w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 py-8 mb-24'>
                {localDefaultService.map((service, index) =>
                    <ServiceListCard
                        key={service.name}
                        serviceName={service.name}
                        description={service.description}
                        totalHours={service.hours}
                        costPerHour={parseFloat(service.cost_per_hour)}
                        isSelected={myServices.some(s => s.name === service.name)}
                        onSelect={() => onSelectService(service)}
                        onDelete={service.isLocal ? () => onDeleteLocalDefaultService(service) : undefined}
                    />
                )}
            </section>
            {/* Service selection UI - No local default service */}
            {localDefaultService.length === 0 &&
                <div className='text-center text-neutral-500'>
                    No services available. Please add a custom service to get started.
                </div>
            }
            {/* Fixed continue button at the bottom */}
            <div className='fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-4 px-4'>
                <div className='mx-auto w-full max-w-4xl flex flex-row justify-between'>
                    <button
                        className='bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors mr-4'
                        onClick={onOpenCustomServiceModal}
                    >
                        Add Custom Service
                    </button>
                    <button
                        className='bg-primary-500 text-white px-6 py-3 rounded-md hover:bg-primary-600 transition-colors'
                        onClick={onContinue}
                    >
                        Continue
                    </button>
                </div>
            </div>
            <CustomLocalServiceModal
                isOpen={isCustomServiceModalOpen}
                onClose={onCloseCustomServiceModal}
                onCreate={onCreateLocalDefaultService}
            />
        </main>
    )
}

export default Page

function CustomLocalServiceModal(props: {
    isOpen: boolean,
    onClose: () => void,
    onCreate: (service: LocalDefaultService) => void,
}) {
    // A modal to add a custom service to the registry
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const hours = parseInt(formData.get('hours') as string, 10);
        const cost_per_hour = formData.get('cost_per_hour') as string;
        if (name && description && hours > 0 && cost_per_hour) {
            props.onCreate({ name, description, hours, cost_per_hour, isLocal: true });
            props.onClose();
        }
    }
    return (
        <Dialog open={props.isOpen} onClose={props.onClose} className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
                <DialogBackdrop className="fixed inset-0 bg-black opacity-30" />
                <div className="bg-white rounded-lg max-w-md w-full p-6 z-20">
                    <h2 className="text-xl font-bold mb-4">Add Custom Service</h2>
                    <form onSubmit={onSubmit}>
                        <div className="flex flex-col gap-4">
                            <InputField
                                type="text"
                                id="name"
                                name="name"
                                labeltext="Service Name"
                                placeholder="e.g., Night Nurse"
                                required
                                autoFocus
                                pattern=".{3,50}"
                                title="Service name should be between 3 and 50 characters."
                            />
                            <InputField
                                type="text"
                                id="description"
                                name="description"
                                labeltext="Service Description"
                                placeholder="Brief description of the service"
                                required
                                pattern=".{10,200}"
                                title="Description should be between 10 and 200 characters."
                            />
                            <InputField
                                type="number"
                                id="hours"
                                name="hours"
                                labeltext="Estimated Hours"
                                placeholder="e.g., 10"
                                required
                                min={1}
                                title="Please enter a valid number of hours."
                            />
                            <InputField
                                type="text"
                                id="cost_per_hour"
                                name="cost_per_hour"
                                labeltext="Cost per Hour (USD)"
                                placeholder="e.g., 20"
                                required
                                pattern="^\d+(\.\d{1,2})?$"
                                title="Please enter a valid cost (e.g., 20 or 20.00)."
                            />
                            <div className="flex flex-row justify-end gap-4 mt-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors"
                                    onClick={props.onClose}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                                >
                                    Add Service
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Dialog>
    )
}