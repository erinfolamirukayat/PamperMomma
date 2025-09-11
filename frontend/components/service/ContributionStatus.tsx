"use client";

import { useSearchParams } from 'next/navigation';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export function ContributionStatus() {
    const searchParams = useSearchParams();
    const status = searchParams.get('redirect_status');
    const sharableId = searchParams.get('sharable_id');

    const linkHref = sharableId ? `/contribute/${sharableId}` : '/';
    if (status === 'succeeded') {
        return (
            <div className='text-center'>
                <div className='bg-green-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center'>
                    <Icon icon="material-symbols:check-circle-outline-rounded" className="h-12 w-12 text-green-600" />
                </div>
                <h3 className='text-title-desktop-large text-neutral-800 font-bold mb-4'>Payment Successful!</h3>
                <p className='text-body-desktop text-neutral-600 mb-8 leading-relaxed'>
                    Thank you for your generous contribution. Your support means the world to the new mom!
                </p>
                <Link href={linkHref} passHref>
                    <button className='bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-all duration-300'>
                        Done
                    </button>
                </Link>
            </div>
        );
    }

    if (status === 'processing') {
        return (
            <div className='text-center'>
                <div className='bg-blue-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center'>
                    <Icon icon="line-md:loading-twotone-loop" className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className='text-title-desktop-large text-neutral-800 font-bold mb-4'>Payment Processing</h3>
                <p className='text-body-desktop text-neutral-600 mb-8 leading-relaxed'>
                    Your payment is being processed. We will update you once it is complete.
                </p>
            </div>
        );
    }

    return (
        <div className='text-center'>
            <div className='bg-red-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center'>
                <Icon icon="material-symbols:error-outline-rounded" className="h-12 w-12 text-red-600" />
            </div>
            <h3 className='text-title-desktop-large text-neutral-800 font-bold mb-4'>Payment Failed</h3>
            <p className='text-body-desktop text-neutral-600 mb-8 leading-relaxed'>
                Something went wrong with your payment. Please try again or contact support.
            </p>
            <Link href={linkHref} passHref>
                <button className='bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-all duration-300'>
                    Done
                </button>
            </Link>
        </div>
    );
}
