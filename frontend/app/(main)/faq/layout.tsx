import React from 'react'

function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className='relative'>
            {/* header */}
            <section className='sticky top-0 z-20 w-full h-16 bg-primary-500 flex items-center justify-center shadow-md'>
                <h1 className='text-2xl font-semibold text-primary-100'>PamperMomma</h1>
            </section>
            {/* content */}
            {children}
        </div>
    )
}

export default Layout