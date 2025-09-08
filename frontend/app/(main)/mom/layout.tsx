'use client'

import { Appbar, Menubar } from '@/components/menubar'
import { User } from '@/lib/services/auth/types'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useHulk, useHulkFetch } from 'hulk-react-utils'
import React, { useEffect, useRef } from 'react'

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    // This layout is used for the dashboard
    const container = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP({ scope: container });
    const hulk = useHulk()
    const { data: user, dispatch } = useHulkFetch<User>('/accounts/me/profile/', {
        onSuccess(data, alert) {
            // If the user profile is successfully fetched, update the auth context
            hulk.auth.update({ user: data })
            console.log('User profile updated in auth context:', data)
        }
    });
    useEffect(() => {
        (async () => {
            if (hulk.auth.state?.user === undefined) {
                // If the user is not authenticated, try to fetch the user profile
                console.log('Fetching user profile...')
                dispatch({ method: 'GET' })

            }
        })() // Fetch user profile on initial load
    }, [])

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
                {children}
            </section>
        </div>
    )
}

export default Layout