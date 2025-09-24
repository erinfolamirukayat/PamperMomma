"use client";

import { Icon } from '@iconify/react';
import Link from 'next/link';

export function ContributeHeader() {
    return (
        <section className='sticky top-0 z-20 w-full h-16 bg-primary-500 flex items-center justify-center shadow-md'>
            <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <Icon icon="material-symbols:favorite" className="text-primary-500 text-lg" />
                </div>
                <span className="text-2xl font-bold text-white">PamperMomma</span>
            </Link>
        </section>
    );
}