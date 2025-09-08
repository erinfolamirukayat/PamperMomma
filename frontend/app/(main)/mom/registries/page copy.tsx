// "use client";

// import { DashboardCard, ServiceCard } from '@/components/cards'
// import { ErrorModal, LoadingModal } from '@/components/modals';
// import { ServiceWidget, ServiceWidgetStandalone } from '@/components/service-widget';
// import { useFetch } from '@/lib/services/auth/hooks';
// import { Registry, Service } from '@/lib/services/auth/types';
// import Link from 'next/link'
// import { useSearchParams } from 'next/navigation';
// import React, { useEffect } from 'react'

// function Page() {
//     const searchParams = useSearchParams();
//     const rId = searchParams.get('registry') ?? undefined;
//     const {
//         go: goRegistries,
//         status: registriesStatus,
//         error: registriesError,
//         data: registriesData
//     } = useFetch<Service[]>("/registries/services/")

//     useEffect(() => {
//         console.log('Fetching registries with rId:', rId);
//         if (rId) {
//             goRegistries({ method: 'GET', query: { registry: rId } });
//         }
//     }, [rId])

//     const availableServices = registriesData?.filter((service) => service.is_available) ?? [];
//     const completedServices = registriesData?.filter((service) => service.is_completed) ?? [];

//     return (
//         <main className='relative min-h-full flex-1'>
//             {/* <section className='px-12 py-8 flex flex-row justify-center gap-6 max-w-lg mx-auto'>
//                 <DashboardCard
//                     title='Active Services'
//                     description={availableServices.length.toString()}
//                 />
//                 <DashboardCard
//                     title='Completed Services'
//                     description={completedServices.length.toString()}
//                 />
//                 <DashboardCard
//                     title='Voluntary Services'
//                     description='5'
//                 />
//                 <DashboardCard
//                     title='Offered Services'
//                     description='32'
//                 />
//             </section> */}
//             <section className='px-12 pb-12 space-y-6'>
//                 <ServiceWidgetStandalone title='Available Services' services={availableServices} />
//                 <ServiceWidgetStandalone title='Completed Services' services={completedServices} />
//             </section>
//             <LoadingModal isLoading={registriesStatus === 'loading'} className='bg-background' />
//             <ErrorModal error={registriesError} isOpen={registriesStatus === 'error'} />
//         </main>
//     )
// }

// export default Page


