import { Icon } from '@iconify/react';
import Link from 'next/link';
import React from 'react'
import { Metadata, ResolvingMetadata } from 'next';
import { PublicRegistryProps } from '@/lib/services/registry/types';

export async function generateMetadata(
    { params }: {
        params: { sharableId: string }
    },
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const { sharableId } = params;

    // Base URL
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const url = new URL(`/registries/public/${sharableId}/`, baseURL);

    try {
        // fetch data
        const response = await fetch(url);

        if (!response.ok) {
            // Handle cases where the registry is not found (404) or other server errors
            return {
                title: 'Registry Not Found | PamperMomma',
                description: 'The registry you are looking for could not be found.',
            };
        }

        const registry: PublicRegistryProps = await response.json();

        // optionally access and extend (rather than replace) parent metadata
        const previousImages = (await parent).openGraph?.images || []

        return {
            title: `${registry.name} Pamper Registry` || 'Pamper Registry',
            description: `Pamper Registry for ${registry.name} - Shareable ID: ${registry.shareable_id}`,
            keywords: ['pamper registry', 'public registry', 'baby registry', 'contribute'],
            openGraph: {
                title: `${registry.name} Pamper Registry` || 'Pamper Registry',
                description: `Pamper Registry for ${registry.name} - Shareable ID: ${registry.shareable_id}`,
            },
        }
    } catch (error) {
        // This catches network errors like "fetch failed"
        console.error("Failed to generate metadata due to network error:", error);
        return {
            title: 'Error Loading Registry | PamperMomma',
            description: 'There was a problem connecting to our services to load this registry.',
        }
    }
}


function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className='relative'>
            {/* header */}
            <section className='sticky top-0 z-20 w-full h-16 bg-primary-500 flex items-center justify-center shadow-md'>
                <Link href="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <Icon icon="material-symbols:favorite" className="text-primary-500 text-lg" />
                    </div>
                    <span className="text-2xl font-bold text-white">PamperMomma</span>
                </Link>
            </section>
            {/* content */}
            {children}
        </div>
    )
}

export default Layout