// "use client"

// import { ErrorModal, LoadingModal, NewRegistryModal } from '@/components/modals'
// import { ImageTile } from '@/components/tiles'
// import { useFetch } from '@/lib/services/auth/hooks'
// import { DefaultRegistry } from '@/lib/services/auth/types'
// import Link from 'next/link'
// import React, { useEffect, useState } from 'react'


// function Page() {
//   const [isOpen, setIsOpen] = useState(false)
//   const [selectedRegistry, setSelectedRegistry] = useState<DefaultRegistry | null>(null)
//   const {
//     go: fetchRegistries,
//     error: registriesError,
//     status: registriesStatus,
//     data: registriesData
//   } = useFetch<DefaultRegistry[]>("/registries/default/")

//   useEffect(() => {
//     fetchRegistries({ method: "GET" })
//   }, [])


//   const handleOpen = (registry: DefaultRegistry) => {
//     setIsOpen(true)
//     setSelectedRegistry(registry)
//   }

//   const handleClose = () => {
//     setIsOpen(false)
//     setSelectedRegistry(null)
//   }

//   return (
//     <div className='pb-16'>
//       <main className='flex flex-col items-center mx-lg'>
//         <div className='text-title-desktop py-12'>PamperMomma</div>
//         <h1 className='text-headline-desktop-small max-w-2xl text-center pb-8'>Design the Help You Deserve After Baby Arrives</h1>
//         <section className='w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-lg'>
//           {/* <ImageTile label='Childcare Support' onClick={handleOpen} />
//           <ImageTile label='Household Help' onClick={handleOpen} />
//           <ImageTile label='Meal Support' onClick={handleOpen} />
//           <ImageTile label='Childcare Support' onClick={handleOpen} />
//           <ImageTile label='Household Help' onClick={handleOpen} />
//           <ImageTile label='Meal Support' onClick={handleOpen} />
//           <ImageTile label='Others' onClick={handleOpen} /> */}
//           {registriesData?.map(registry =>
//             <ImageTile
//               key={registry.name}
//               label={registry.name}
//               image={registry?.cover_image}
//               onClick={() => handleOpen(registry)}
//             />
//           )}
//           {registriesStatus === "success"
//             && <ImageTile
//               label='Custom'
//               image='/next.svg'
//               onClick={() => handleOpen({
//                 name: '',
//                 cover_image: '/next.svg',
//                 services: [],
//               })}
//             />}
//         </section>
//       </main>
//       <footer className='bg-background fixed bottom-0 w-full h-16 flex flex-col items-center justify-center'>
//         <p className='text-label-desktop-large'>Already have an account? <Link href="" className='text-title-desktop-small'>Log In</Link></p>
//       </footer>
//       <NewRegistryModal
//         open={isOpen}
//         onClose={(_) => handleClose()}
//         registry={selectedRegistry}
//       />
//       <LoadingModal
//         isLoading={registriesStatus === "loading"}
//       />
//       <ErrorModal
//         isOpen={registriesStatus === "error"}
//         error={registriesError}
//       />
//     </div>
//   )
// }

// export default Page