'use client'

import { Appbar, Menubar } from '@/components/menubar'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useHulk, useHulkFetch } from 'hulk-react-utils'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from "next/navigation";
import { CreateRegistry, Registry } from "@/lib/services/registry/types";
import { User } from '@/lib/services/auth/types'

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    // This layout is used for the dashboard
    const container = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP({ scope: container });
    const hulk = useHulk();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(true);

    const { data: user, dispatch } = useHulkFetch<User>('/accounts/me/profile/', {
        onSuccess(data, alert) {
            // If the user profile is successfully fetched, update the auth context
            hulk.auth.update({ user: data })
            console.log('User profile updated in auth context:', data)
        }
    });

    const { dispatch: createRegistry } = useHulkFetch<Registry>("/registries/r/", {
        onSuccess: (data) => {
            console.log('Registry created successfully from session data:', data);
            // CRITICAL: Clear the session storage to prevent infinite loops and data leakage.
            sessionStorage.removeItem('new-registry');
            // Redirect to the newly created registry's page.
            router.push(`/mom/registries/${data.id}`);
        },
        onError: (error) => {
            console.error('Failed to create registry from session data:', error);
            // CRITICAL: Clear the invalid data to prevent retries.
            sessionStorage.removeItem('new-registry');
            setIsProcessing(false); // Allow rendering to continue.
        }
    });

    useEffect(() => {
        const newRegistryData = sessionStorage.getItem('new-registry');
        if (newRegistryData) {
            setIsProcessing(true); // Show loading state while we process the session data.
            try {
                const registryPayload: CreateRegistry = JSON.parse(newRegistryData);
                if (registryPayload.services && registryPayload.services.length > 0) {
                    createRegistry({ method: 'POST', body: JSON.stringify(registryPayload) });
                } else {
                    // Data is invalid or incomplete, clear it and stop processing.
                    sessionStorage.removeItem('new-registry');
                    setIsProcessing(false);
                }
            } catch (error) {
                console.error("Error parsing registry data from session storage", error);
                sessionStorage.removeItem('new-registry'); // Clear corrupted data.
                setIsProcessing(false);
            }
        } else {
            // No onboarding data found, proceed normally.
            setIsProcessing(false);
            if (hulk.auth.state?.user === undefined) {
                // Only fetch if not already fetched.
                if (!user) {
                    console.log('Fetching user profile...');
                    dispatch({ method: 'GET' });
                }
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hulk.auth.state?.user?.id]); // Depend on a stable value like user ID

    const breakpoint = 768; // Define the breakpoint for responsiveness
    useGSAP(() => {
        const defaultLayout = () => {
            if (window.innerWidth >= breakpoint) {
                gsap.set('.main-view', { marginLeft: '18rem' });
                gsap.set('.menu', { x: '0%' });
                gsap.set('.menu-open-btn', { display: 'none' });
            } else {
                gsap.set('.main-view', { marginLeft: '0rem' });
                gsap.set('.menu', { x: '-100%' });
                gsap.set('.menu-open-btn', { display: 'block' });
            }
        }
        defaultLayout(); // Set initial layout based on current window size
        window.addEventListener('resize', defaultLayout); // Update layout on window resize
    }, { scope: container });

    useGSAP(() => {
        // Close the menu when clicking outside of it on mobile
        const f = (e: React.MouseEvent) => {
            const isOpen = gsap.getProperty('.menu', 'x') === 0;
            if (isOpen &&
                ((e.target as HTMLElement).closest('.menu') === null) &&
                window.innerWidth < breakpoint
            ) {
                closeMenu();
            }
        }
        document.addEventListener('click', f as any);
        return () => {
            document.removeEventListener('click', f as any);
        }
    }, { scope: container });

    const openMenu = contextSafe(() => {
        gsap.to('.menu', { x: '0%', duration: 0.3 },);
        gsap.to('.menu-open-btn', { display: 'none', duration: 0.3 },);
        gsap.matchMedia()
            .add({
                isDesktop: `(min-width: ${breakpoint}px)`,
                isMobile: `(max-width: ${breakpoint - 1}px)`
            }, (context) => {
                const { isDesktop } = context.conditions;
                if (isDesktop) {
                    gsap.to('.main-view', { marginLeft: '18rem', duration: 0.3 },);
                } else {
                    gsap.to('.main-view', { marginLeft: '0rem', duration: 0.3 },);
                }
            });
    });
    const closeMenu = contextSafe(() => {
        gsap.to('.menu', { x: '-100%', duration: 0.3 },);
        gsap.to('.main-view', { marginLeft: '0rem', duration: 0.3 },);
        gsap.to('.menu-open-btn', { display: 'block', duration: 0.3 },);
    });
    const onClickNewPage = () => {
        // Close the menu when navigating to a new page on mobile
        if (window.innerWidth < breakpoint) {
            closeMenu();
        }
    }

    return (
        <div ref={container}>
            <Menubar
                onClose={closeMenu}
                onClickNewPage={onClickNewPage}
                className='menu w-72 fixed top-0 left-0 z-20 h-screen'
            />
            <section className='main-view min-h-screen flex flex-col'>
                <Appbar onMenuPressed={openMenu} />
                {isProcessing ? (
                    <div className="flex-1 flex items-center justify-center bg-neutral-50">
                        <p className="text-neutral-600">Finalizing your setup...</p>
                    </div>
                ) : (
                    children
                )}
            </section>
        </div>
    )
}

export default Layout