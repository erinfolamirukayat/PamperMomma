"use client"
import { Dialog, DialogProps, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"
import { Icon } from "@iconify/react";
import clx from "clsx";
import { ServiceListCard } from "./cards";
import { CheckboxField, InputField } from "./inputs";
import { FilledButton } from "./buttons";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
// import { CreateRegistry, CreateService, DefaultService, Service } from "@/lib/services/auth/types";
import { HulkFetchErrorProps } from "hulk-react-utils";


// export interface NewRegistryModalProps extends DialogProps {
//     registry?: DefaultRegistry | null;
// }


// export function NewRegistryModal(props: NewRegistryModalProps) {
//     // This modal is used to create a new registry
//     // It will be shown when the user clicks on a tile
//     const serviceFormRef = useRef<HTMLFormElement | null>(null);
//     const router = useRouter();
//     const [registry, setRegistry] = useState<CreateRegistry | null>(null);
//     const {
//         go: fetchDefaultServices,
//         status: defaultServicesStatus,
//         error: defaultServicesError,
//         data: defaultServicesData
//     } = useFetch<DefaultService[]>("/registries/services/default/")

//     useEffect(() => {
//         fetchDefaultServices({ method: 'GET' });
//     }, [])

//     useEffect(() => {
//         // If a registry is passed as a prop, set it as the current registry
//         // If not, initialize a new registry with an empty name and no services
//         // Cast to CreateRegistry to ensure type compatibility
//         if (props.registry) {
//             setRegistry({ 
//                 name: props.registry.name || "",
//                 services: props.registry.services || [],
//                 arrival_date: "",
//                 babies_count: 1,
//                 is_first_time: false
//             });
//         } else {
//             setRegistry({
//                 name: "",
//                 services: [],
//                 is_first_time: false,
//                 arrival_date: "",
//                 babies_count: 1
//             });
//         }
//     }, [props.registry]);

//     const onEditTitle: (e: React.ChangeEvent<HTMLInputElement>) => void = (e) => {
//         if (!registry) return;
//         const newRegistry: CreateRegistry = { ...registry, name: e.target.value };
//         setRegistry(newRegistry);
//     };

//     const onAddService = (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         if (!registry) return;
//         const formData = new FormData(e.currentTarget);
//         const newService: CreateService = {
//             name: formData.get("serviceName")?.toString() ?? "",
//             description: formData.get("description")?.toString() ?? "",
//             hours: parseInt(formData.get("hours")?.toString() ?? "0"),
//             cost_per_hour: formData.get("cost_per_hour")?.toString() ?? "0",
//         }
//         if (registry.services?.find(v => v.name.trim().toLowerCase() === newService.name.trim().toLowerCase())) {
//             // If a service with the same name already exists, do not add it again
//             console.error("Service with the same name already exists", newService.name);
//             return;
//         }
//         // if (!newService.name || !newService.description || isNaN(newService.hours) || isNaN(parseFloat(newService.cost_per_hour))) {
//         //     console.error("Invalid service data", newService);
//         //     return;
//         // }
//         const updatedRegistry: CreateRegistry = {
//             ...registry,
//             services: [newService, ...(registry.services ?? [])]
//         };
//         setRegistry(updatedRegistry);
//         e.currentTarget.reset(); // Reset the form after adding the service
//     }

//     const onDeleteService = (serviceName: string) => {
//         if (!registry) return;
//         const updatedServices = registry.services?.filter(service => service.name !== serviceName) ?? [];
//         const updatedRegistry: CreateRegistry = { ...registry, services: updatedServices };
//         setRegistry(updatedRegistry);
//     }

//     const onSuggestService = (e: React.ChangeEvent<HTMLInputElement>) => {
//         // This function is used to populate the service information into the form
//         const serviceName = e.target.value.trim().toLowerCase();
//         const suggestedService = defaultServicesData?.find(service => service.name.trim().toLowerCase() === serviceName);
//         if (suggestedService && serviceFormRef.current) {
//             const form = serviceFormRef.current;
//             form.serviceName.value = suggestedService.name;
//             form.description.value = suggestedService.description;
//             form.hours.value = suggestedService.hours.toString();
//             form.cost_per_hour.value = suggestedService.cost_per_hour;
//         }
//     }

//     const onCreateRegistry = () => {
//         // This function is used to create a new registry
//         if (!registry) return;
//         if ((registry?.services?.length ?? 0) === 0) {
//             console.error("Registry must have at least one service");
//             return;
//         }
//         // Stash the registry to session storage
//         sessionStorage.setItem("new-registry", JSON.stringify(registry));
//         // Redirect to the next step in the onboarding process
//         router.push("/onboarding/arrival");
//     }

//     return (
//         <Dialog {...props}>
//             <DialogBackdrop className="fixed inset-0 bg-black/30" />
//             <div className="fixed inset-0 flex w-screen justify-center">
//                 <DialogPanel
//                     className="my-auto bg-neutral-100 max-w-4xl w-full rounded-lg shadow-lg"
//                 >
//                     <div className="relative flex flex-col items-center justify-center px-6 py-4">
//                         <DialogTitle className="text-title-desktop text-neutral-800">
//                             New Registry
//                         </DialogTitle>
//                         <button
//                             className="absolute right-6 text-neutral-500 hover:text-neutral-800"
//                             onClick={() => props.onClose?.(false)}
//                         >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                         </button>
//                     </div>
//                     <div className="flex flex-row px-6">
//                         <label htmlFor="registry-name"></label>
//                         <Icon icon="material-symbols-light:edit-outline-rounded" className="h-12 w-12 text-neutral-900 mx-auto my-4" />
//                         <input
//                             type="text"
//                             placeholder="Registry Name"
//                             defaultValue={registry?.name ?? ""}
//                             onChange={onEditTitle}
//                             id="registry-name"
//                             className="w-full text-headline-desktop-small text-neutral-900 text-center outline-0"
//                             autoFocus
//                         />
//                     </div>
//                     {/* <div>{JSON.stringify(registry)}</div> */}
//                     <div className="max-h-[300px] px-6 py-4 flex flex-row gap-x-12">
//                         <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
//                             {(registry?.services?.length ?? 0) === 0 && (
//                                 <p className="text-body-desktop text-neutral-700 text-center mb-2">
//                                     Your added services will be displayed here. You can add services to your registry by filling out the form here. You can as well select the dropdown on the `Service Name` field to select a service from the default services.
//                                 </p>
//                             )}
//                             {registry?.services?.map((service, index) => (
//                                 <ServiceListCard
//                                     key={index}
//                                     serviceName={service.name}
//                                     description={service.description}
//                                     totalHours={service.hours}
//                                     costPerHour={parseFloat(service.cost_per_hour)}
//                                     isActive={service.is_active}
//                                     onDelete={() => onDeleteService(service.name)}
//                                 />
//                             ))}
//                         </div>
//                         <form onSubmit={onAddService} ref={serviceFormRef} className="flex-1 flex flex-col gap-2">
//                             <InputField
//                                 labeltext="Service Name"
//                                 name="serviceName"
//                                 required
//                                 list="service-names"
//                                 onChange={onSuggestService}
//                                 autoComplete="off"
//                                 autoCorrect="off"
//                                 autoCapitalize="off"
//                             />
//                             <datalist id="service-names">
//                                 {defaultServicesData?.map((service, index) => (
//                                     <option key={index} value={service.name} />
//                                 ))}
//                             </datalist>
//                             <InputField
//                                 labeltext="Description"
//                                 name="description"
//                                 required
//                             />
//                             <div className="flex flex-row items-end gap-4">
//                                 <InputField
//                                     labeltext="Total Hours"
//                                     name="hours"
//                                     type="number"
//                                     inputMode="numeric"
//                                     className="flex-1"
//                                     required
//                                 />
//                                 <InputField
//                                     labeltext="Cost Per Hour"
//                                     name="cost_per_hour"
//                                     type="text"
//                                     inputMode="decimal"
//                                     className="flex-1"
//                                     required
//                                 />
//                                 <FilledButton type="submit" className="w-fit">Add&nbsp;Service</FilledButton>
//                             </div>
//                         </form>
//                     </div>
//                     <div className="flex py-4">
//                         <FilledButton className="mx-auto max-w-96 w-full" onClick={onCreateRegistry}>
//                             Create Registry
//                         </FilledButton>
//                     </div>
//                 </DialogPanel>
//             </div>
//         </Dialog>
//     )
// }

// function NewRegistryCompactModal(props: NewRegistryModalProps) {
//     // This modal is used to create a new registry
//     // It will be shown when the user clicks on a tile
//     const serviceFormRef = useRef<HTMLFormElement | null>(null);
//     const router = useRouter();
//     const [registry, setRegistry] = useState(props.registry);
//     const {
//         go: fetchDefaultServices,
//         status: defaultServicesStatus,
//         error: defaultServicesError,
//         data: defaultServicesData
//     } = useFetch<DefaultService[]>("/registries/services/default/")

//     const {
//         go: fetchDefaultRegistries,
//         status: defaultRegistriesStatus,
//         error: defaultRegistriesError,
//         data: defaultRegistriesData
//     } = useFetch<DefaultRegistry[]>("/registries/default/")

//     useEffect(() => {
//         fetchDefaultServices({ method: 'GET' });
//         if (!props.isForModification) {
//             // Fetch default registries only if not in modification mode
//             // This is to ensure that we can create a new registry without modifying an existing one
//             fetchDefaultRegistries({ method: 'GET' });
//         }

//     }, [])

//     useEffect(() => {
//         setRegistry(props.registry ?? null);
//     }, [props.registry]);

//     const onEditTitle: (e: React.ChangeEvent<HTMLInputElement>) => void = (e) => {
//         // Trigger the suggest registry function to update the registry based on the input
//         const suggestedRegistry = onSuggestRegistry(e);
//         // console.log("Suggested Registry:", suggestedRegistry, "Current Registry:", registry);
//         // if (!registry || suggestedRegistry === undefined) return;
//         // console.log("Updating:", (suggestedRegistry || registry))
//         const newRegistry: DefaultRegistry = { 
//             ...(suggestedRegistry || registry), 
//             name: e.target.value, 
//             services: suggestedRegistry?.services || registry?.services || [] 
//         };
//         setRegistry(newRegistry);

//     };

//     const onAddService = (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         if (!registry) return;
//         const formData = new FormData(e.currentTarget);
//         const newService: DefaultService = {
//             name: formData.get("serviceName")?.toString() ?? "",
//             description: formData.get("description")?.toString() ?? "",
//             hours: parseInt(formData.get("hours")?.toString() ?? "0"),
//             cost_per_hour: formData.get("cost_per_hour")?.toString() ?? "0",
//         }
//         if (registry.services?.find(v => v.name.trim().toLowerCase() === newService.name.trim().toLowerCase())) {
//             // If a service with the same name already exists, do not add it again
//             console.error("Service with the same name already exists", newService.name);
//             return;
//         }
//         // if (!newService.name || !newService.description || isNaN(newService.hours) || isNaN(parseFloat(newService.cost_per_hour))) {
//         //     console.error("Invalid service data", newService);
//         //     return;
//         // }
//         const updatedRegistry: DefaultRegistry = {
//             ...registry,
//             services: [newService, ...(registry.services ?? [])]
//         };
//         setRegistry(updatedRegistry);
//         e.currentTarget.reset(); // Reset the form after adding the service
//     }

//     const onDeleteService = (serviceName: string) => {
//         if (!registry) return;
//         const updatedServices = registry.services?.filter(service => service.name !== serviceName) ?? [];
//         const updatedRegistry: DefaultRegistry = { ...registry, services: updatedServices };
//         setRegistry(updatedRegistry);
//     }

//     const onSuggestService = (e: React.ChangeEvent<HTMLInputElement>) => {
//         // This function is used to populate the service information into the form
//         const serviceName = e.target.value.trim().toLowerCase();
//         const suggestedService = defaultServicesData?.find(service => service.name.trim().toLowerCase() === serviceName);
//         if (suggestedService && serviceFormRef.current) {
//             const form = serviceFormRef.current;
//             form.serviceName.value = suggestedService.name;
//             form.description.value = suggestedService.description;
//             form.hours.value = suggestedService.hours.toString();
//             form.cost_per_hour.value = suggestedService.cost_per_hour;
//         }
//     }

//     const onSuggestRegistry = (e: React.ChangeEvent<HTMLInputElement>) => {
//         // console.log("Suggesting registry based on input:", e.target.value, defaultRegistriesData, "registry:", registry);
//         // This function is used to populate the registry information into the form
//         const registryName = e.target.value.trim().toLowerCase();
//         const suggestedRegistry = defaultRegistriesData?.find(reg => reg.name.trim().toLowerCase() === registryName);
//         // if (suggestedRegistry) {
//         //     setRegistry(suggestedRegistry);
//         // }
//         return suggestedRegistry;
//     }

//     const onCreateRegistry = () => {
//         // This function is used to create a new registry
//         if (!registry) return;
//         if ((registry?.services?.length ?? 0) === 0) {
//             console.error("Registry must have at least one service");
//             return;
//         }
//         // Stash the registry to session storage
//         sessionStorage.setItem("new-registry", JSON.stringify(registry));
//         // Redirect to the next step in the onboarding process
//         router.push("/onboarding/arrival");
//     }

//     return (
//         <Dialog {...props}>
//             <DialogBackdrop className="fixed inset-0 z-30 bg-black/30" />
//             <div className="fixed inset-0 z-40 flex w-screen justify-center p-6">
//                 <DialogPanel
//                     className="my-auto bg-neutral-100 max-w-4xl w-full rounded-lg shadow-lg"
//                 >
//                     <div className="relative flex flex-col items-center justify-center px-6 py-4">
//                         <DialogTitle className="text-title-desktop text-neutral-800">
//                             {props.isForModification ? "Add New Service" : "New Registry"}
//                         </DialogTitle>
//                         <button
//                             className="absolute right-6 text-neutral-500 hover:text-neutral-800"
//                             onClick={() => props.onClose?.(false)}
//                         >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                         </button>
//                     </div>
//                     <div className="flex flex-row px-6">
//                         <label htmlFor="registry-name"></label>
//                         <Icon icon="material-symbols-light:edit-outline-rounded" className="h-12 w-12 text-neutral-900 mx-auto my-4" />
//                         <input
//                             type="text"
//                             placeholder="Registry Name"
//                             defaultValue={registry?.name ?? ""}
//                             onChange={props.isForModification ? undefined : onEditTitle}
//                             id="registry-name"
//                             className="w-full text-headline-desktop-small text-neutral-900 text-center outline-0"
//                             autoFocus
//                             disabled={props.isForModification} // Disable editing if in modification mode
//                             list="registry-names"
//                         />
//                         {!props.isForModification && (
//                             <datalist id="registry-names">
//                                 {defaultRegistriesData?.map((reg, index) => (
//                                     <option key={index} value={reg.name} />
//                                 ))}
//                             </datalist>
//                         )}
//                     </div>
//                     {/* <div>{JSON.stringify(registry)}</div> */}
//                     {!props.isForModification && <div className="flex flex-row flex-wrap justify-between gap-6 px-6">
//                         <InputField
//                             name='arrival_date'
//                             id='arrival_date'
//                             labeltext='Arrival date'
//                             type='date'
//                             required
//                         />
//                         <InputField
//                             name='babies_count'
//                             id='babies_count'
//                             labeltext='Number of Babies'
//                             type='number'
//                             inputMode='numeric'
//                             defaultValue={1}
//                             min={1}
//                             max={10}
//                             required
//                         />
//                         <CheckboxField
//                             id='first_time'
//                             name='first_time'
//                             labeltext="I'm a first-time mom"
//                             defaultChecked={false}
//                         />
//                     </div>}
//                     <div className="max-h-[300px] px-6 py-4 flex flex-row gap-x-12">
//                         <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
//                             {(registry?.services?.length ?? 0) === 0 && (
//                                 <p className="text-body-desktop text-neutral-700 text-center mb-2">
//                                     Your added services will be displayed here. You can add services to your registry by filling out the form here. You can as well select the dropdown on the `Service Name` field to select a service from the default services.
//                                 </p>
//                             )}
//                             {registry?.services?.map((service, index) => (
//                                 <ServiceListCard
//                                     key={index}
//                                     serviceName={service.name}
//                                     description={service.description}
//                                     totalHours={service.hours}
//                                     costPerHour={parseFloat(service.cost_per_hour)}
//                                     // Only allow deletion if not in modification mode
//                                     onDelete={!props.isForModification ? (() => onDeleteService(service.name)) : undefined}
//                                 />
//                             ))}
//                         </div>
//                         <form onSubmit={onAddService} ref={serviceFormRef} className="flex-1 flex flex-col gap-2">
//                             <InputField
//                                 labeltext="Service Name"
//                                 name="serviceName"
//                                 required
//                                 list="service-names"
//                                 onChange={onSuggestService}
//                                 autoComplete="off"
//                                 autoCorrect="off"
//                                 autoCapitalize="off"
//                             />
//                             <datalist id="service-names">
//                                 {defaultServicesData?.map((service, index) => (
//                                     <option key={index} value={service.name} />
//                                 ))}
//                             </datalist>
//                             <InputField
//                                 labeltext="Description"
//                                 name="description"
//                                 required
//                             />
//                             <div className="flex flex-row items-end gap-4">
//                                 <InputField
//                                     labeltext="Total Hours"
//                                     name="hours"
//                                     type="number"
//                                     inputMode="numeric"
//                                     className="flex-1"
//                                     required
//                                 />
//                                 <InputField
//                                     labeltext="Cost Per Hour"
//                                     name="cost_per_hour"
//                                     type="text"
//                                     inputMode="decimal"
//                                     className="flex-1"
//                                     required
//                                 />
//                                 <FilledButton type="submit" className="w-fit">Add&nbsp;Service</FilledButton>
//                             </div>
//                         </form>
//                     </div>
//                     <div className="flex py-4">
//                         <FilledButton className="mx-auto max-w-96 w-full" onClick={onCreateRegistry}>
//                             {props.isForModification ? "Update Registry" : "Create Registry"}
//                         </FilledButton>
//                     </div>
//                 </DialogPanel>
//             </div>
//         </Dialog>
//     )
// }


// export interface ServiceModalProps extends DialogProps {
//     service: Service;
// }


// export function ServiceModal(props: ServiceModalProps) {
//     // This modal is used to display a service
//     // It will be shown when the user clicks on a service card
//     const [isVolunteer, setIsVolunteer] = useState(false)
//     return (
//         <Dialog {...props}>
//             <DialogBackdrop className="fixed inset-0 z-30 bg-black/30" />
//             <div className="fixed inset-0 z-40 flex w-screen justify-center">
//                 <DialogPanel className={clx("my-auto bg-neutral-100 max-w-lg w-full rounded-lg shadow-lg", props.className)}>
//                     <div className="relative flex flex-col items-center justify-center px-6 py-4">
//                         <DialogTitle className="text-title-desktop text-neutral-800">
//                             {props.service.name}
//                         </DialogTitle>
//                         <button
//                             className="absolute right-6 text-neutral-500 hover:text-neutral-800"
//                             onClick={() => props.onClose?.(false)}
//                         >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                         </button>
//                     </div>
//                     {/* Service details go here */}
//                     <section className="px-12 py-4 space-y-6">
//                         <section className="space-y-md">
//                             {/* Service Description */}
//                             <p className="text-body-desktop text-neutral-700 first-letter:uppercase">{props.service.description}</p>

//                             {/* Service Details Grid */}
//                             <div className="grid grid-cols-3 gap-4 gap-x-8 text-neutral-900">
//                                 <div className="flex flex-col">
//                                     <span className="font-semibold text-label-desktop text-neutral-600">Hours Needed:</span>
//                                     <span className="text-body-desktop">{props.service.hours}</span>
//                                 </div>
//                                 <div className="flex flex-col">
//                                     <span className="font-semibold text-label-desktop text-neutral-600">Cost Per Hour:</span>
//                                     <span className="text-body-desktop">${props.service.cost_per_hour}</span>
//                                 </div>
//                                 <div className="flex flex-col">
//                                     <span className="font-semibold text-label-desktop text-neutral-600">Total Cost:</span>
//                                     <span className="text-body-desktop">${props.service.total_cost}</span>
//                                 </div>
//                                 <div className="flex flex-col">
//                                     <span className="font-semibold text-label-desktop text-neutral-600">Raised Amount:</span>
//                                     <span className="text-body-desktop">${props.service.total_contributions}</span>
//                                 </div>
//                                 <div className="flex flex-col">
//                                     <span className="font-semibold text-label-desktop text-neutral-600">Status:</span>
//                                     <span className="text-body-desktop">{props.service.is_available ? "Available" : "Not Available"}</span>
//                                 </div>
//                                 {/* <div className="flex flex-col">
//                                     <span className="font-semibold text-label-desktop text-neutral-600">Withdrawn:</span>
//                                     <span className="text-body-desktop">{props.service.cashed_out ? "Yes" : "No"}</span>
//                                 </div> */}
//                             </div>
//                         </section>
//                         <form action="" className="space-y-4">
//                             {isVolunteer &&
//                                 <InputField
//                                     labeltext="Convinient Day and Time"
//                                     type="datetime-local"
//                                 />
//                             }
//                             {!isVolunteer &&
//                                 <InputField
//                                     labeltext="Amount"
//                                 />
//                             }
//                             <div className="flex flex-row justify-between items-center">
//                                 <FilledButton>Contribute</FilledButton>
//                                 <CheckboxField
//                                     id="volunteer"
//                                     labeltext="Volunteer"
//                                     defaultValue={new String(isVolunteer).toString()}
//                                     value={"false"}
//                                     // disabled={true}
//                                     title="This feature is not available yet"
//                                     onChange={(e) => setIsVolunteer(e.target.checked)}
//                                 />
//                             </div>
//                         </form>
//                     </section>
//                 </DialogPanel>
//             </div>
//         </Dialog>
//     )
// }

// export function ServiceOwnerModal(props: ServiceModalProps) {
//     // This modal is used to display a service for the owner
//     return (
//         <Dialog {...props}>
//             <DialogBackdrop className="fixed inset-0 z-30 bg-black/30" />
//             <div className="fixed inset-0 z-40 flex w-screen justify-center p-6">
//                 <DialogPanel className={clx("my-auto bg-neutral-100 max-w-4xl w-full rounded-lg shadow-lg", props.className)}>
//                     <div className="relative flex flex-col items-center justify-center px-6 py-4">
//                         <DialogTitle className="text-title-desktop text-neutral-800">
//                             {props.service.name}
//                         </DialogTitle>
//                         <button
//                             className="absolute right-6 text-neutral-500 hover:text-neutral-800"
//                             onClick={() => props.onClose?.(false)}
//                         >
//                             <Icon icon="material-symbols-light:close" className="h-6 w-6" />
//                         </button>
//                     </div>
//                     {/* Service details go here */}
//                     <div className="px-12 py-4 space-y-6">
//                         <section className="space-y-md">
//                             {/* Service Description */}
//                             <p className="text-body-desktop text-neutral-700 first-letter:uppercase">{props.service.description}</p>

//                             {/* Service Details Grid */}
//                             <div className="grid grid-cols-3 gap-4 gap-x-8 text-neutral-900">
//                                 <div className="flex flex-col">
//                                     <span className="font-semibold text-label-desktop text-neutral-600">Hours Needed:</span>
//                                     <span className="text-body-desktop">{props.service.hours}</span>
//                                 </div>
//                                 <div className="flex flex-col">
//                                     <span className="font-semibold text-label-desktop text-neutral-600">Cost Per Hour:</span>
//                                     <span className="text-body-desktop">${props.service.cost_per_hour}</span>
//                                 </div>
//                                 <div className="flex flex-col">
//                                     <span className="font-semibold text-label-desktop text-neutral-600">Total Cost:</span>
//                                     <span className="text-body-desktop">${props.service.total_cost}</span>
//                                 </div>
//                                 <div className="flex flex-col">
//                                     <span className="font-semibold text-label-desktop text-neutral-600">Raised Amount:</span>
//                                     <span className="text-body-desktop">${props.service.total_contributions}</span>
//                                 </div>
//                                 <div className="flex flex-col">
//                                     <span className="font-semibold text-label-desktop text-neutral-600">Status:</span>
//                                     <span className="text-body-desktop">{props.service.is_available ? "Available" : "Not Available"}</span>
//                                 </div>
//                                 <div className="flex flex-col">
//                                     <span className="font-semibold text-label-desktop text-neutral-600">Withdrawn:</span>
//                                     {/* <span className="text-body-desktop">{props.service.cashed_out ? "Yes" : "No"}</span> */}
//                                 </div>
//                             </div>
//                         </section>
//                         <section className="space-y-md">
//                             <h3 className="text-title-desktop-small">Contributions</h3>
//                             <section className="space-y-4">
//                                 {/* Header Row */}
//                                 <div className="grid grid-cols-5 items-center border-b-2 border-neutral-300 font-semibold text-neutral-700 py-2">
//                                     <span className="col-span-2 text-label-desktop">Contributor</span>
//                                     <span className="text-label-desktop">Amount</span>
//                                     <span className="text-label-desktop">Date</span>
//                                     <span className="text-label-desktop">Status</span>
//                                 </div>

//                                 {/* Contribution Rows */}
//                                 {props.service.contributions?.length === 0 && (
//                                     <p className="text-body-desktop text-neutral-700 text-center">
//                                         No contributions yet. Share your registry to get contributions.
//                                     </p>
//                                 )}
//                                 {props.service.contributions?.map((contribution, index) => (
//                                     <div
//                                         key={index}
//                                         className="grid grid-cols-5 items-center border-b border-neutral-200 py-2"
//                                     >
//                                         <span className="col-span-2 text-body-desktop-small">{contribution.contributor}</span>
//                                         <span className="text-body-desktop-small">${contribution.amount}</span>
//                                         <span className="text-label-desktop text-neutral-500">
//                                             {new Date(contribution.created_at).toLocaleDateString()}
//                                         </span>
//                                         <span className="text-label-desktop text-neutral-500">
//                                             {contribution.fulfilled ? "Fulfilled" : "Initiated"}
//                                         </span>
//                                     </div>
//                                 ))}
//                             </section>
//                         </section>
//                         <section className="flex flex-row items-end gap-4">
//                             {props.service.is_active ? (
//                                 <FilledButton className="bg-red-500" onClick={() => props.onClose?.(false)}>
//                                     Pause Service
//                                 </FilledButton>
//                             ) : (
//                                 <FilledButton className="bg-green-500" onClick={() => props.onClose?.(false)}>
//                                     Activate Service
//                                 </FilledButton>
//                             )}
//                             {/* {!props.service.cashed_out && parseFloat(props.service.total_contributions) > 0 && (
//                                 <FilledButton className=" mt-4" onClick={() => props.onClose?.(false)}>
//                                     Withdraw Contributions
//                                 </FilledButton>
//                             )} */}
//                         </section>
//                     </div>
//                 </DialogPanel>
//             </div>
//         </Dialog>
//     )
// }


export function LoadingModal(props: { isLoading: boolean, className?: string }) {
    if (!props.isLoading) {
        return null; // Don't render anything if not loading
    }
    return (
        <div className={clx("fixed inset-0 z-50 flex items-center justify-center", props.className ?? "bg-black/40 backdrop-blur-sm")}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center max-w-64 w-full mx-4 animate-pulse">
                {/* Animated Logo/Icon */}
                <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce"></div>
                    <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full animate-ping opacity-20"></div>
                </div>
                
                {/* Loading Spinner */}
                {/* <div className="relative mb-4">
                    <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                </div> */}
                
                {/* Loading Text */}
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading...</h3>
                <p className="text-gray-600 text-center text-sm">Please wait while we prepare everything for you</p>
                
                {/* Animated Progress Dots */}
                {/* <div className="flex space-x-1 mt-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div> */}
                
                {/* Animated Background Elements */}
                <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute bottom-4 left-4 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-2 w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>
        </div>
    );
};


export function ErrorModal(props: { error: HulkFetchErrorProps | undefined, onClose?: (value: boolean) => void, isOpen?: boolean }) {
    // This modal is used to display an error
    const [isOpen, setIsOpen] = useState<boolean>(true)

    useEffect(() => {
        setIsOpen(props.isOpen ?? true);
    }, [props.isOpen])

    const handleClose = (value: boolean = false) => {
        setIsOpen(value);
        props.onClose?.(value);
    };

    if (!props.error) {
        return null; // Don't render anything if no error
    }

    return (
        <Dialog open={isOpen} onClose={handleClose} className="fixed inset-0 flex items-center justify-center z-10">
            <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <DialogPanel className="z-50 zbg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all">
                {/* Header with animated error icon */}
                <header className="relative bg-gradient-to-r from-red-500 to-pink-600 px-6 py-8 text-white">
                    <div className="flex flex-col items-center">
                        {/* Animated Error Icon */}
                        <div className="relative mb-4">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                                <Icon icon="material-symbols:error-outline" className="w-10 h-10 text-white animate-bounce" />
                            </div>
                            <div className="absolute inset-0 w-16 h-16 border-4 border-white/30 rounded-full animate-ping"></div>
                        </div>
                        
                        <DialogTitle className="text-2xl font-bold text-center mb-2">
                            Oops! Something went wrong
                        </DialogTitle>
                        <p className="text-white/90 text-sm text-center">
                            We encountered an unexpected error
                        </p>
                    </div>
                    
                    {/* Close button */}
                    <button
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors duration-200 p-1 rounded-full hover:bg-white/10"
                        onClick={() => handleClose()}
                    >
                        <Icon icon="material-symbols:close" className="w-6 h-6" />
                    </button>
                </header>

                {/* Content */}
                <section className="px-6 py-6 space-y-4">
                    {/* Error Message */}
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg overflow-auto max-h-48">
                        <div className="flex items-start">
                            <Icon icon="material-symbols:warning-outline" className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                                <h4 className="text-red-800 font-semibold text-sm mb-1">
                                    {props.error.message}
                                </h4>
                                {props.error.details && props.error.details.length > 0 && (
                                    <div className="text-red-700 text-sm space-y-1">
                                        {props.error.details.map((detail, index) => (
                                            <p key={index} className="leading-relaxed">• {detail}</p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Error Code (if available) */}
                    {props.error.code && (
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center">
                                <Icon icon="material-symbols:code" className="w-4 h-4 text-gray-500 mr-2" />
                                <span className="text-xs font-mono text-gray-600">
                                    Error Code: {props.error.code}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Helpful suggestions */}
                    {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start">
                            <Icon icon="material-symbols:lightbulb-outline" className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                                <h4 className="text-blue-800 font-semibold text-sm mb-2">What you can do:</h4>
                                <ul className="text-blue-700 text-sm space-y-1">
                                    <li>• Try refreshing the page</li>
                                    <li>• Check your internet connection</li>
                                    <li>• Contact support if the problem persists</li>
                                </ul>
                            </div>
                        </div>
                    </div> */}
                </section>

                {/* Action buttons */}
                <footer className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex space-x-3 justify-end">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center"
                        >
                            <Icon icon="material-symbols:refresh" className="w-4 h-4 mr-1.5" />
                            Refresh Page
                        </button>
                        <button
                            onClick={() => handleClose()}
                            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-pink-600 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            Close
                        </button>
                    </div>
                </footer>

                {/* Decorative elements */}
                <div className="absolute top-20 right-6 w-3 h-3 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute top-16 right-12 w-2 h-2 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </DialogPanel>
        </Dialog>
    );
}